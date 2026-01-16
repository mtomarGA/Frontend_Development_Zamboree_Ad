'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import { toast } from 'react-toastify'

const BASE_URL = process.env.NEXT_PUBLIC_URL
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL

const NotificationContext = createContext()

// Socket connect with CORS
const socket = io(SOCKET_URL, {
    withCredentials: true,
    extraHeaders: {
        "my-custom-header": "abcd"
    }
})

function NotificationService({ children }) {
    const [notifications, setNotifications] = useState([])

    // ✅ API Call
    const getNotificationFun = async () => {
        const token = sessionStorage.getItem("user_token")
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }

        try {
            const response = await axios.get(`${BASE_URL}/mail/get-Notications`, { headers })
            return response.data   // return actual data
        } catch (error) {
            console.error("Notification fetch error:", error)
            return null
        }
    }

    const markAsRead = async (id) => {
        try {
            const token = sessionStorage.getItem("user_token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            const response = await axios.put(
                `${BASE_URL}/mail/notification/markAsRead`,
                { id },
                { headers }
            );

            if (response?.data?.success) {
                toast.success(response?.data?.message);

                // ✅ Update only the clicked notification
                setNotifications(prev =>
                    prev.map(note =>
                        note._id === id ? { ...note, isRead: true } : note
                    )
                );
            }
        } catch (err) {
            console.error("Mark as read error:", err);
            toast.error("Failed to mark as read");
        }
    };


    // ✅ Set Notifications
    const getNotifications = async () => {
        const data = await getNotificationFun()
        if (data) {
            // agar API structure { data: [...] } hai toh adjust kare
            setNotifications(data.data || data || [])
        }
    }

    useEffect(() => {
        // First fetch
        getNotifications();

        // ✅ Real-time socket listener
        socket.on("new-mail", (data) => {
            console.log(data, "mails");
            getNotifications();
        });

        // ✅ Polling fallback (runs every 30s)
        const intervalId = setInterval(() => {
            // console.log("⏳ Polling fallback: fetching notifications...");
            getNotifications();
        }, 10000); // adjust interval as needed (e.g., 15s, 60s)

        return () => {
            socket.off("new-mail");
            clearInterval(intervalId); // cleanup on unmount
        };
    }, []);


    // ✅ Remove single notification
    const removeNotification = async (id) => {
        console.log(id, "id");
        try {
            const token = sessionStorage.getItem("user_token")
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }

            const response = await axios.delete(`${BASE_URL}/mail/notification/delete`, { headers, data: { id } })
            if (response?.data?.success == true) {
                toast.success(response?.data?.message);
            }
            setNotifications(prev => prev.filter(note => note._id !== id))
        } catch (error) {
            console.log(error);
        }
    }


    // ✅ Mark all as read
    const markAllRead = async () => {
        try {
            const token = sessionStorage.getItem("user_token")
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }

            const id = notifications.map(note => note._id);
            console.log(id, "alll")

            //   await axios.put(`/api/notifications/read-all`)
            const response = await axios.put(`${BASE_URL}/mail/notification/markAsRead`, { id }, { headers })
            if (response?.data?.success == true) {
                toast.success(response?.data?.message);
            }
            setNotifications(prev => prev.map(note => ({ ...note, isRead: true })))
        } catch (err) {
            console.error('Error marking all read:', err)
        }
    }


    const removeAllNotification = async () => {
        try {
            const token = sessionStorage.getItem("user_token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            const ids = notifications.map(note => note._id);

            const response = await axios.delete(`${BASE_URL}/mail/notification/delete`, { headers, data: { ids } }
            );

            if (response?.data?.success === true) {
                toast.success(response?.data?.message);
                // Agar saare delete ho gaye to list clear kar do
                setNotifications([]);
            }
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <NotificationContext.Provider value={{ notifications, getNotifications, markAsRead, removeNotification, markAllRead, removeAllNotification }}>
            {children}
        </NotificationContext.Provider>
    )

}

export default NotificationService
export const useNotificationContext = () => useContext(NotificationContext)
