'use client'
import axios, { isCancel } from "axios";


// import axios from 'axios';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
const BASE_URL = process.env.NEXT_PUBLIC_URL;
import { io } from 'socket.io-client';
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;


const MailContext = createContext()

// Change your socket connection to include CORS config
// const socket = io("http://localhost:3001", {
//     withCredentials: true,
//     auth: {
//         token: "abcd"
//     },
//     extraHeaders: {
//         "my-custom-header": "bdgdg"
//     },
//     transports: ['websocket', 'polling'],
//     forceNew: true, // Force a new connection
//     timeout: 20000
// });




export const MailProvider = ({ children }) => {
    const socket = io(SOCKET_URL, {
        withCredentials: true,
        // Use query instead of auth for better compatibility
        query: {
            token: "abcd"
        },
        auth: {
            token: "abcdc"
        },
        // Keep your custom header
        extraHeaders: {
            "my-custom-header": "bdgdg",
            "authorization": "Bearer abcd" // Fallback option
        },
        transports: ['websocket', 'polling'],
        autoConnect: true
    });

    // Handle connection events
    socket.on('connect', () => {
        console.log('✅ Connected to socket server');
        console.log('🆔 Socket ID:', socket.id);
    });

    socket.on('connect_error', (error) => {
        console.error('❌ Connection failed:', error.message);
        console.error('❌ Full error:', error);
    });
    // states
    const [Compose, setCompose] = useState({

    });
    const [Mails, setMails] = useState([])
    const [emailList, setEmailList] = useState([])
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false);

    const [InTrash, setInTrash] = useState(false)
    const [InInbox, setInbox] = useState(true)
    const [InDraft, setInDraft] = useState(false)
    const [InSend, setInSent] = useState(false)
    const [Starred, setStarred] = useState(false)



    const [inboxMails, setInboxMails] = useState([]);
    const [sentMails, setSentMails] = useState([]);
    const [draftMails, setDraftMails] = useState([]);
    const [trashMails, setTrashMails] = useState([]);

    // pagination
    const [page, setPage] = useState(1);
    const [limit] = useState(10); // fixed rows per page
    const [total, setTotal] = useState(0);

    // onchange Function
    const ChangeFun = (e) => {
        setCompose({ ...Compose, [e.target.name]: e.target.value })
    }

    console.log(InInbox, "Mail provider")

    const UserID = async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/mail/userid`, { headers });
            return response.data;
        } catch (error) {
            return error;
        }
    }

    const [currentUserEmail, setcurrentUserEmail] = useState('');
    const [fetchuserLoading, setfetchuserLoading] = useState(false);
    useEffect(() => {
        const fetchid = async () => {
            const id = await UserID();
            setcurrentUserEmail(id.data);
        }
        fetchid();
    }, []);


    socket.on("sent-msg", function (data) {
        console.log(data, "received");
    });






    const latestUidsRef = useRef(new Set());
    const fetchControllerRef = useRef(new AbortController());
    const isFetchingRef = useRef(false);
    // Remove shared throttling state that could drop unrelated events
    const mailCacheRef = useRef(new Map());

    // Throttle helper
    const throttle = (func, limit) => {
        let lastCall = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastCall >= limit) {
                lastCall = now;
                return func(...args);
            }
        };
    };


    // ✅ Handle new mail from socket
    const handleNewMail = useCallback(
        async (data) => {
            if (!InInbox) {
                console.log("⚠️ Ignored new-mail: not in Inbox view");
                return;
            }
            if (!data) {
                console.log("⚠️ Ignored new-mail: empty payload");
                return;
            }
            const eventEmail = String(data.email || '').toLowerCase();
            const userEmail = String(currentUserEmail || '').toLowerCase();
            if (!eventEmail || eventEmail !== userEmail) {
                console.log("⚠️ Ignored new-mail: email mismatch", { eventEmail, userEmail });
                return;
            }
            if (data.lastUid == null) {
                console.log("⚠️ Ignored new-mail: missing lastUid");
                return;
            }

            console.log("📨 New mail socket event:", data);

            try {
                isFetchingRef.current = true;
                const token = sessionStorage.getItem("user_token");

                const headers = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                };

                // 👉 fetch only mails after provided lastUid WITH pagination params
                const response = await axios.get(`${BASE_URL}/mail/inbox`, {
                    headers,
                    params: {
                        lastUid: Number(data.lastUid),
                        pageNo: 1, // Always fetch first page for new emails
                        limit: limit // Include limit parameter
                    },
                    signal: fetchControllerRef.current.signal,
                });

                // Extract the Paginatedmsg from the response data
                const fetched = response.data?.data?.messages || [];
                console.log("📩 API returned:", fetched);

                // Deduplicate
                const newMails = fetched.filter((mail) => {
                    const isNew =
                        !latestUidsRef.current.has(mail.uid) &&
                        !mailCacheRef.current.has(mail.uid);

                    if (isNew) {
                        latestUidsRef.current.add(mail.uid);
                        mailCacheRef.current.set(mail.uid, mail);
                    }
                    return isNew;
                });

                if (newMails.length > 0) {
                    const sortedNew = newMails.sort(
                        (a, b) => new Date(b.date) - new Date(a.date)
                    );

                    // Update mails state - only if we're on the first page
                    if (page === 1) {
                        setMails((prev) => {
                            const prevUids = new Set(prev.map((mail) => mail.uid));
                            const trulyNew = sortedNew.filter(
                                (mail) => !prevUids.has(mail.uid)
                            );

                            // Add new emails to the top and maintain the limit
                            const updated = [...trulyNew, ...prev];
                            return updated.slice(0, limit);
                        });

                        setcopyAlldata((prev) => {
                            const prevUids = new Set(prev.map((mail) => mail.uid));
                            const trulyNew = sortedNew.filter(
                                (mail) => !prevUids.has(mail.uid)
                            );
                            return [...trulyNew, ...prev];
                        });
                    }
                }
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error("❌ Error fetching new mail:", error);
                }
            } finally {
                isFetchingRef.current = false;
            }
        },
        [currentUserEmail, InInbox, Mails, page, limit] // Add limit to dependencies
    );


    // Bind the new-mail listener (throttled) only once with user context

    // WebSocket setup
    useEffect(() => {
        if (!currentUserEmail) return;

        // Initialize with current UIDs
        latestUidsRef.current = new Set(Mails.map(mail => mail.uid));
        Mails.forEach(mail => mailCacheRef.current.set(mail.uid, mail));

        const throttledHandler = throttle((data) => {
            handleNewMail(data);
        }, 1000);

        socket.on('connect', () => {
            console.log('Connected to Socket Server');
            latestUidsRef.current = new Set(Mails.map(mail => mail.uid));
        });
        socket.on('connect_error', (err) => {
            console.error('Socket connect_error', err?.message || err);
        });
        socket.on('error', (err) => {
            console.error('Socket error', err);
        });

        // Ensure listener is bound (in case previous cleanup removed it)
        socket.off(currentUserEmail);
        socket.on(currentUserEmail, throttledHandler);
        socket.on('disconnect', () => console.log('Socket disconnected'));

        return () => {
            fetchControllerRef.current.abort();
            socket.off(currentUserEmail, throttledHandler);
            fetchControllerRef.current = new AbortController();
        };
    }, [currentUserEmail, handleNewMail, Mails, InInbox]);
    // post function
    const SendMail = async () => {
        console.log(Compose, "inside send")
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post(`${BASE_URL}/mail/send-email`, Compose, { headers });
            return response.data;
        } catch (error) {
            return error;
        }

    }

    console.log(currentUserEmail, "emailllllllllllllllllllllllllll")
    // const [pageloading, setLoading] = useState(false);
    // const [pagelastUid, setPagelastUid] = useState('');
    // const GetMail = async () => {

    //     console.log(pagelastUid, "dddnjd")
    //     const token = sessionStorage.getItem("user_token");
    //     const headers = {
    //         Authorization: `Bearer ${token}`,
    //         'Content-Type': 'application/json',
    //     };

    //     try {
    //         setLoading(true);
    //         const response = await axios.get(`${BASE_URL}/mail/inbox?page=${page}&limit=${limit}&pagelastUid=${pagelastUid}`, { headers });
    //         // const response = await axios.get(`${BASE_URL}/mail/inbox?page=${page}&limit=${limit}`, { headers });
    //         setfetchuserLoading(true);
    //         return response.data;
    //     } catch (error) {
    //         return error.response.data;
    //     } finally {
    //         setLoading(false);
    //     }

    // }


    // // Removed duplicate 'new-mail' listener; unified above


    // // fetch 

    // const [copyAlldata, setcopyAlldata] = useState([]);
    // const fetchData = async () => {
    //     try {
    //         setMails([]);
    //         const response = await GetMail()
    //         // console.log(response, "fetchdata")
    //         // setMails(response?.data || [])
    //         if (response.success == false) {
    //             toast.error(response?.message)

    //             return
    //         }
    //         setMails(response?.data?.messages.sort((a, b) => new Date(b.date) - new Date(a.date)) || []);
    //         setcopyAlldata(response?.data?.messages.sort((a, b) => new Date(b.date) - new Date(a.date)) || []);
    //         setTotal(response?.data?.pagination?.totalMessages);
    //         if (page == 1) {
    //             const lastuidforpage = Mails.length > 0 ? Mails[Mails.length - 1].uid : ''
    //             setPagelastUid('');
    //             console.log(lastuidforpage, "ddd")
    //             setPagelastUid(lastuidforpage);
    //             // only update pagelastUid for next page fetch
    //         } else {
    //             setPagelastUid(response.data.data?.nextCursorUid || '');
    //         }


    //         // setMails(response?.data.message.sort((a, b) => new Date(b.date) - new Date(a.date)) || []);
    //         // setcopyAlldata(response?.data.message.sort((a, b) => new Date(b.date) - new Date(a.date)) || []);


    //         // console.log(response.data, "inside")

    //     } catch (error) {
    //         console.error('Error fetching mails:', error)
    //     }
    // }


    // useEffect(() => {
    //     fetchData()
    // }, [page])



    // --------------------->INBOX

    const [pageloading, setLoading] = useState(false);
    const [pageCache, setPageCache] = useState({}); // Cache both data and UIDs for each page

    const GetMail = async (currentPage, currentPagelastUid) => {
        console.log(`Fetching page ${currentPage} with UID: ${currentPagelastUid}`);
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            setLoading(true);
            // Only pass pagelastUid if it's not page 1
            const uidParam = currentPage === 1 ? '' : currentPagelastUid;
            const response = await axios.get(
                `${BASE_URL}/mail/inbox?page=${currentPage}&limit=${limit}&pagelastUid=${uidParam}`,
                { headers }
            );
            setfetchuserLoading(true);
            return response.data;
        } catch (error) {
            return error.response.data;
        } finally {
            setLoading(false);
        }
    }

    const [copyAlldata, setcopyAlldata] = useState([]);

    const fetchData = async () => {
        try {
            // Check if we have cached data for this page

            if (pageCache[page] && pageCache[page].emails) {
                console.log(`Using cached data for page ${page}`);
                setMails(pageCache[page].emails);
                setcopyAlldata(pageCache[page].emails);
                return;
            }

            setMails([]);

            // Determine the correct pagelastUid for current page
            let currentPagelastUid = '';

            if (page === 1) {
                // For page 1, always start fresh (no pagelastUid)
                currentPagelastUid = '';
            } else {
                // For pages > 1, we need to build the UID chain sequentially
                // await buildUidChain(page);
                currentPagelastUid = pageCache[page]?.startUid || '';
            }

            const response = await GetMail(page, currentPagelastUid);

            if (response.success == false) {
                toast.error(response?.message);
                return;
            }

            const emailData = response?.data?.messages || [];
            const sortedEmails = emailData.sort((a, b) => new Date(b.date) - new Date(a.date));

            setMails(sortedEmails);
            setcopyAlldata(sortedEmails);
            setTotal(response?.data?.pagination?.totalMessages);

            // Cache the page data with proper UIDs
            const nextCursorUid = response?.data?.nextCursorUid;
            setPageCache(prev => ({
                ...prev,
                [page]: {
                    emails: sortedEmails,
                    startUid: currentPagelastUid, // UID used to fetch this page
                    nextUid: nextCursorUid, // UID for next page
                    timestamp: Date.now() // For cache invalidation if needed
                }
            }));

            // Store the startUid for next page
            if (nextCursorUid) {
                setPageCache(prev => ({
                    ...prev,
                    [page + 1]: {
                        ...prev[page + 1],
                        startUid: nextCursorUid
                    }
                }));
            }

            console.log(`Page ${page} loaded and cached with startUid: ${currentPagelastUid}, nextUid: ${nextCursorUid}`);
            console.log('Page Cache:', pageCache);

        } catch (error) {
            console.error('Error fetching mails:', error);
        }
    }
    const refreshInbox = async () => {
        try {
            // Check if we have cached data for this page

            setMails([]);

            // Determine the correct pagelastUid for current page
            let currentPagelastUid = '';

            if (page === 1) {
                // For page 1, always start fresh (no pagelastUid)
                currentPagelastUid = '';
            } else {
                // For pages > 1, we need to build the UID chain sequentially
                // await buildUidChain(page);
                currentPagelastUid = pageCache[page]?.startUid || '';
            }

            const response = await GetMail(page, currentPagelastUid);

            if (response.success == false) {
                toast.error(response?.message);
                return;
            }

            const emailData = response?.data?.messages || [];
            const sortedEmails = emailData.sort((a, b) => new Date(b.date) - new Date(a.date));

            setMails(sortedEmails);
            setcopyAlldata(sortedEmails);
            setTotal(response?.data?.pagination?.totalMessages);

            // Cache the page data with proper UIDs
            const nextCursorUid = response?.data?.nextCursorUid;
            setPageCache(prev => ({
                ...prev,
                [page]: {
                    emails: sortedEmails,
                    startUid: currentPagelastUid, // UID used to fetch this page
                    nextUid: nextCursorUid, // UID for next page
                    timestamp: Date.now() // For cache invalidation if needed
                }
            }));

            // Store the startUid for next page
            if (nextCursorUid) {
                setPageCache(prev => ({
                    ...prev,
                    [page + 1]: {
                        ...prev[page + 1],
                        startUid: nextCursorUid
                    }
                }));
            }

            console.log(`Page ${page} loaded and cached with startUid: ${currentPagelastUid}, nextUid: ${nextCursorUid}`);
            console.log('Page Cache:', pageCache);

        } catch (error) {
            console.error('Error fetching mails:', error);
        }
    }

    // Build UID chain sequentially for proper pagination
    // const buildUidChain = async (targetPage) => {
    //     for (let p = 1; p < targetPage; p++) {
    //         if (!pageCache[p] || !pageCache[p].nextUid) {
    //             console.log(`Building chain: fetching page ${p} to get UID for page ${p + 1}`);

    //             // Get the startUid for current page in chain
    //             const startUid = p === 1 ? '' : pageCache[p]?.startUid || '';
    //             const response = await GetMail(p, startUid);

    //             if (response.success && response.data) {
    //                 const emailData = response?.data?.messages || [];
    //                 const sortedEmails = emailData.sort((a, b) => new Date(b.date) - new Date(a.date));
    //                 const nextCursorUid = response?.data?.nextCursorUid;

    //                 // Cache this page
    //                 setPageCache(prev => ({
    //                     ...prev,
    //                     [p]: {
    //                         emails: sortedEmails,
    //                         startUid: startUid,
    //                         nextUid: nextCursorUid,
    //                         timestamp: Date.now()
    //                     }
    //                 }));

    //                 // Set startUid for next page
    //                 if (nextCursorUid) {
    //                     setPageCache(prev => ({
    //                         ...prev,
    //                         [p + 1]: {
    //                             ...prev[p + 1],
    //                             startUid: nextCursorUid
    //                         }
    //                     }));
    //                 }
    //             }
    //         }
    //     }
    // }

    // Clear cache when new emails arrive or refresh
    const resetPagination = () => {
        setPageCache({});
        setPage(1);
        console.log('Pagination reset - all cache cleared');
    }

    // Clear cache from a specific page onwards (useful when new emails arrive)
    const clearCacheFromPage = (fromPage) => {
        setPageCache(prev => {
            const newCache = { ...prev };
            Object.keys(newCache).forEach(pageKey => {
                if (parseInt(pageKey) >= fromPage) {
                    delete newCache[pageKey];
                }
            });
            return newCache;
        });
        console.log(`Cache cleared from page ${fromPage} onwards`);
    }

    // Optional: Prefetch next page for better UX
    const prefetchNextPage = async (currentPage) => {
        const nextPage = currentPage + 1;
        if (!pageCache[nextPage] || !pageCache[nextPage].emails) {
            console.log(`Prefetching page ${nextPage}`);
            const nextPageUid = pageCache[nextPage]?.startUid || pageCache[currentPage]?.nextUid;
            if (nextPageUid) {
                try {
                    const response = await GetMail(nextPage, nextPageUid);
                    if (response.success && response.data) {
                        const emailData = response?.data?.Paginatedmsg || [];
                        const sortedEmails = emailData.sort((a, b) => new Date(b.date) - new Date(a.date));

                        setPageCache(prev => ({
                            ...prev,
                            [nextPage]: {
                                emails: sortedEmails,
                                startUid: nextPageUid,
                                nextUid: response?.data?.nextCursorUid,
                                timestamp: Date.now()
                            }
                        }));
                    }
                } catch (error) {
                    console.log(`Prefetch failed for page ${nextPage}:`, error);
                }
            }
        }
    }

    useEffect(() => {
        fetchData();

        // // Optional: Prefetch next page after current page loads
        const timer = setTimeout(() => {
            if (pageCache[page] && pageCache[page].emails) {
                prefetchNextPage(page);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [page]);

    // Listen for new emails and clear cache
    useEffect(() => {
        // When new emails arrive, clear cache to force refresh
        const handleNewEmail = () => {
            clearCacheFromPage(1);
        };

        // Add your new email listener here
        // socket.on('new-email', handleNewEmail);

        return () => {
            // socket.off('new-email', handleNewEmail);
        };
    }, []);




    //---------------->INBOX END


    // fetch sent mails

    // const [pagesNo, setpagesNo] = useState(1);
    // const [limits, setlimits] = useState(10);
    // const [sentloading, setsentloading] = useState(false);
    // const [cachedPages, setCachedPages] = useState({});

    // const SentMails = async (type) => {

    //     if (cachedPages[pagesNo]) {
    //         console.log("Loaded from cache:", pagesNo);
    //         setSentMails(cachedPages[pagesNo]);
    //         return;
    //     }
    //     const token = sessionStorage.getItem("user_token");
    //     const headers = {
    //         Authorization: `Bearer ${token}`,
    //         'Content-Type': 'application/json',
    //     };

    //     try {
    //         setsentloading(true);
    //         const response = await axios.get(`${BASE_URL}/mail/folders/${type}?pageNo=${pagesNo}&limit=${limits}`, { headers });
    //         const pageData = response.data.Paginatedmsg || [];
    //         console.log(response.data, "sent")
    //         // ✅ store in cache
    //         setCachedPages((prev) => ({
    //             ...prev,
    //             [pagesNo]: pageData,
    //         }));
    //         return response.data;
    //     } catch (error) {
    //         return error;
    //     } finally {
    //         setsentloading(false);
    //     }

    // }


    const [pagesNo, setpagesNo] = useState(1);
    const [limits, setlimits] = useState(10);
    const [sentloading, setsentloading] = useState(false);
    const [cachedPages, setCachedPages] = useState({});
    const [TrashcachedPages, setTrashCachedPages] = useState({});
    const [DraftcachedPages, setDraftCachedPages] = useState({});
    // const [sentMails, setSentMails] = useState([]); // ✅ define state to store data

    const SentMails = async (type) => {
        // ✅ Check cache first
        if (cachedPages[pagesNo] && type === "sent") {
            console.log("Loaded from cache:", pagesNo);
            // setSentMails(cachedPages[pagesNo]);
            return cachedPages[pagesNo];
        }
        if (TrashcachedPages[pagesNo] && type === "trash") {
            console.log("Loaded from cache:", pagesNo);
            return TrashcachedPages[pagesNo];
        }
        if (DraftcachedPages[pagesNo] && type === "draft") {
            console.log("Loaded from cache:", pagesNo);
            return DraftcachedPages[pagesNo];
        }

        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        try {
            setsentloading(true);
            const response = await axios.get(
                `${BASE_URL}/mail/folders/${type}?pageNo=${pagesNo}&limit=${limits}`,
                { headers }
            );

            const pageData = response.data || [];
            console.log("Fetched from API:", response.data);

            // ✅ store in cache
            if (type === 'sent') {
                setCachedPages((prev) => ({
                    ...prev,
                    [pagesNo]: pageData,
                }));

            }

            if (type === "trash") {
                setTrashCachedPages((prev) => ({
                    ...prev,
                    [pagesNo]: pageData,
                }));
            }
            if (type === "draft") {
                setDraftCachedPages((prev) => ({
                    ...prev,
                    [pagesNo]: pageData,
                }));
            }

            // ✅ update UI data
            // setSentMails(pageData);

            return response.data;
        } catch (error) {
            console.error("Error fetching mails:", error);
            return error;
        } finally {
            setsentloading(false);
        }
    };


    // Move to Trash
    const MoveTrash = async (data) => {

        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post(`${BASE_URL}/mail/move-to-trash`, data, { headers });
            return response.data;
        } catch (error) {
            return error;
        }

    }
    // Restore Email
    const RestoreMail = async (data) => {

        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post(`${BASE_URL}/mail/restore-from-trash`, data, { headers });
            return response.data;
        } catch (error) {
            return error;
        }

    }

    // Delete Permanent Email
    const DeletePermanentMail = async (data) => {

        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post(`${BASE_URL}/mail/delete-permanently`, data, { headers });
            return response.data;
        } catch (error) {
            return error;
        }

    }
    // Mark as seen
    const MarkSeen = async (data) => {

        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post(`${BASE_URL}/mail/mark-as-read`, data, { headers });
            return response.data;
        } catch (error) {
            return error;
        }

    }



    // save as draft

    const SaveDraft = async (data) => {

        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post(`${BASE_URL}/mail/save-draft`, Compose, { headers });
            return response.data;
        } catch (error) {
            return error;
        }

    }

    // 
    const SaveMail = async (data) => {

        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post(`${BASE_URL}/mail/label`, data, { headers });
            return response.data;
        } catch (error) {
            return error;
        }

    }


    const getLabelbyMsgId = async (id) => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/mail/label/${id}`, { headers });
            return response.data;
        } catch (error) {
            return error;
        }
    }

    const DeleteLabelbyMsgId = async (data) => {
        console.log(data, "delete");
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.delete(`${BASE_URL}/mail/label`, {
                headers,
                data
            });
            return response.data;
        } catch (error) {
            return error;
        }
    };


    const [GetallLabel, setGetallLabel] = useState([]);
    const getAllLabel = async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/mail/label`, { headers });
            return response.data;
        } catch (error) {
            return error;
        }
    }

    const getEmailid = async (data) => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        console.log(data, "inside getemailid")
        try {
            const response = await axios.post(`${BASE_URL}/mail/searchEmail`, { data: data }, { headers });
            return response.data;
        } catch (error) {
            return error;
        }
    }




    const fetchAllLabels = async () => {
        const response = await getAllLabel()
        setGetallLabel(response?.data);
    }


    const [isReply, setisReply] = useState(false)
    const [isForward, setisForward] = useState(false)



    useEffect(() => {
        const handleNewSent = (data) => {
            console.log("Received new send:", data);

            const lastUid = sentMails.length > 0 ? sentMails[sentMails.length - 1].uid : 0;
            const enriched = {
                ...data,
                uid: lastUid + 1 // Assign uid based on last one
            };

            setSentMails(prev => [...prev, enriched]);
        };

        socket.on("new-send", handleNewSent);

        return () => {
            socket.off("new-send", handleNewSent);
        };
    }, [sentMails]);



    useEffect(() => {
        const handleNewDraft = (data) => {
            console.log("Received new send:", data);

            const lastUid = draftMails.length > 0 ? draftMails[draftMails.length - 1].uid : 0;
            const enriched = {
                ...data,
                uid: lastUid + 1 // Assign uid based on last one
            };

            setDraftMails(prev => [...prev, enriched]);
        };

        socket.on("Save-draft", handleNewDraft);

        return () => {
            socket.off("Save-draft", handleNewDraft);
        };
    }, [SaveDraft]);

    // useEffect(() => {
    //     const TrashFun = async (data) => {
    //         // async function (data) {

    //         const lastUid = trashMails?.[trashMails.length - 1]?.uid || 0;

    //         console.log(lastUid, "tarsmails")

    //         const token = sessionStorage.getItem("user_token");
    //         const headers = {
    //             Authorization: `Bearer ${token}`,
    //             'Content-Type': 'application/json',
    //         };

    //         console.log(data, "inside getemailid")
    //         try {
    //             const response = await axios.get(`${BASE_URL}/mail/trash/${lastUid}`, { headers });
    //             console.log(response.data.data, "new mail tarsh")
    //             setTrashMails([...trashMails, ...response?.data?.data]);

    //         } catch (error) {
    //             return error;
    //         }
    //     }
    //     socket.on("trash-emails", TrashFun)
    // }, [])


    const trashMailsRef = useRef(trashMails);

    useEffect(() => {
        trashMailsRef.current = trashMails;
    }, [trashMails]);

    useEffect(() => {
        const TrashFun = async (data) => {
            const lastUid = trashMailsRef.current?.[trashMailsRef.current.length - 1]?.uid || 0;

            console.log(lastUid, "trash UID");

            const token = sessionStorage.getItem("user_token");
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            try {
                const response = await axios.get(`${BASE_URL}/mail/trash/${lastUid}`, { headers });
                const newMails = response?.data?.data;

                if (Array.isArray(newMails) && newMails.length > 0) {
                    setTrashMails(prev => [...prev, ...newMails]);
                }
            } catch (error) {
                console.error("Fetch failed:", error);
            }
        };

        socket.on("trash-emails", TrashFun);

        return () => {
            socket.off("trash-emails", TrashFun);
        };
    }, []);


    const props = {
        SentMails,
        fetchData,
        Mails,
        Compose,
        setCompose,
        ChangeFun,
        setMails,
        emailList,
        setEmailList,
        open,
        handleClickOpen,
        handleClose,
        SendMail,
        GetMail,
        MoveTrash,
        RestoreMail,
        DeletePermanentMail,
        MarkSeen,
        SaveDraft,
        SaveMail,
        getLabelbyMsgId,
        DeleteLabelbyMsgId,
        fetchAllLabels,
        GetallLabel,
        setisReply,
        isReply,
        isForward,
        setisForward,
        copyAlldata,
        getEmailid, InTrash, setInTrash, InInbox, setInbox, InDraft, setInDraft, InSend, setInSent, Starred, setStarred, inboxMails, setInboxMails,
        sentMails, setSentMails,
        draftMails, setDraftMails,
        trashMails, setTrashMails,
        setPage, limit, total, page, pageloading,
        setpagesNo, limits, sentloading, pagesNo,refreshInbox

    }



    return (
        <MailContext.Provider value={props}>
            {children}
        </MailContext.Provider>
    )
}


export const useMail = () => useContext(MailContext)
