"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import AuthService from "@/services/authService";
import { toast } from "react-toastify";

const SetUserCheck = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [isInterceptorReady, setIsInterceptorReady] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const interceptorRef = useRef(null);
  const hasRedirectedRef = useRef(false);

  // Auth state helpers
  const isLoading = useMemo(() => status === "loading", [status]);
  const isAuthenticated = useMemo(() => status === "authenticated", [status]);
  const isUnauthenticated = useMemo(() => status === "unauthenticated", [status]);
  const isOnLoginPage = useMemo(() => pathname === "/en/login", [pathname]);

  const handleUserLogout = async () => {
      try {
        toast.error("Session expired. Please log in again.");
        await signOut({ callbackUrl: '/en/login' });
        await AuthService.logoutUser()
        sessionStorage.removeItem("user_token")  
      } catch (error) {
        console.error(error)

      }
    }

  const shouldRedirectToLogin = useMemo(
    () => isUnauthenticated && !isOnLoginPage,
    [isUnauthenticated, isOnLoginPage]
  );

  const shouldRedirectToDashboard = useMemo(
    () => isAuthenticated && isOnLoginPage,
    [isAuthenticated, isOnLoginPage]
  );

  // Mounted state
  useEffect(() => {
    setMounted(true);
    return () => {
      hasRedirectedRef.current = false;
      setIsNavigating(false);
    };
  }, []);

  // Manage token in sessionStorage
  const manageToken = useCallback((token) => {
    if (typeof window !== "undefined") {
      if (token) {
        sessionStorage.setItem("user_token", token);
      } else {
        sessionStorage.removeItem("user_token");
      }
    }
  }, []);

  // Setup axios interceptor for authenticated users
  useEffect(() => {
    if (!mounted || isLoading) return;

    if (status !== "authenticated" || !session?.accessToken) {
      setIsInterceptorReady(false);
      return;
    }

    if (interceptorRef.current !== null) {
      axios.interceptors.request.eject(interceptorRef.current);
      interceptorRef.current = null;
    }

    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = session?.accessToken;
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
          manageToken(token);
        } else {
          delete config.headers["Authorization"];
          manageToken(null);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // check for 401 response and logout user
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response && error.response.status === 401) {
          // manageToken(null);
          await handleUserLogout();
        }
        return Promise.reject(error);
      }
    );

    interceptorRef.current = interceptor;
    setIsInterceptorReady(true);

    return () => {
      if (interceptorRef.current !== null) {
        axios.interceptors.request.eject(interceptorRef.current);
        interceptorRef.current = null;
      }
      setIsInterceptorReady(false);
    };
  }, [mounted, isLoading, status, session?.accessToken, manageToken]);

  // Handle redirects
  useEffect(() => {
    if (!mounted || isLoading || isNavigating) return;

    let timeoutId;
    const handleNavigation = async () => {
      try {
        setIsNavigating(true);

        if (shouldRedirectToLogin && !hasRedirectedRef.current) {
          hasRedirectedRef.current = true;
          manageToken(null);
          await router.replace("/en/login");
        } else if (shouldRedirectToDashboard && !hasRedirectedRef.current) {
          hasRedirectedRef.current = true;
          if (session?.accessToken) manageToken(session.accessToken);
          await router.replace("/en/dashboards/crm");
        } else {
          setIsNavigating(false);
          return;
        }
      } finally {
        timeoutId = setTimeout(() => {
          setIsNavigating(false);
          hasRedirectedRef.current = false;
        }, 1000);
      }
    };

    const debounceTimeout = setTimeout(handleNavigation, 100);
    return () => {
      clearTimeout(debounceTimeout);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [
    mounted,
    isLoading,
    isNavigating,
    shouldRedirectToLogin,
    shouldRedirectToDashboard,
    router,
    session?.accessToken,
    manageToken,
  ]);

  // ✅ Fixed: Don't block login page by interceptor
  const isReady = useMemo(() => {
    const hasDefinitiveAuthState =
      status === "authenticated" || status === "unauthenticated";

    return (
      mounted &&
      !isLoading &&
      hasDefinitiveAuthState &&
      (status === "unauthenticated" || isInterceptorReady)
    );
  }, [mounted, isLoading, status, isInterceptorReady]);

  // Simple custom skeleton
  const CustomSkeleton = ({ width = "100%", height = 20, className = "", style = {} }) => (
    <div
      className={`animate-pulse bg-gray-300 rounded ${className}`}
      style={{
        width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
    />
  );

  const LoadingSkeleton = useCallback(
    () => (
      <div className="flex flex-col sm:flex-row h-screen w-full overflow-hidden">
        <div className="hidden sm:block w-64 p-4 space-y-2">
          <CustomSkeleton width="80%" height={50} style={{ marginBottom: "8px" }} />
          {Array.from({ length: 14 }, (_, i) => (
            <CustomSkeleton key={i} width="90%" height={40} style={{ marginBottom: "4px" }} />
          ))}
        </div>
        <div className="flex-1 p-4 sm:p-6 w-full">
          <CustomSkeleton width="100%" height={45} style={{ marginBottom: "32px" }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
            {Array.from({ length: 5 }, (_, i) => (
              <CustomSkeleton key={i} height={120} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4" style={{ marginTop: "24px" }}>
            <div className="md:col-span-7">
              <CustomSkeleton height={400} />
            </div>
            <div className="md:col-span-5">
              <CustomSkeleton height={400} />
            </div>
          </div>
        </div>
      </div>
    ),
    []
  );

  if (!isReady || !mounted) {
    return <LoadingSkeleton />;
  }

  return <>{children}</>;
};

export default SetUserCheck;
