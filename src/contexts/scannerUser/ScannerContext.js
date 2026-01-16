'use client'

import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { createContext } from "react"
import WithdrawService from '../../services/event/event_mgmt/WithdrawService';
const BASE_URL = process.env.NEXT_PUBLIC_URL;

const ScannerContext = createContext();



export function ScannerProvider({ children }) {
    // const [Event, setevent] = useState([]);

    const addUser = async (data) => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post(`${BASE_URL}/event-scanner/`, data, { headers });

            return response.data;
        } catch (error) {
            return error;
        }
    }

    const getUser = async (token) => {
        try {
            const response = await axios.get(`${BASE_URL}/event-scanner/`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('user_token') || token}`,
                    // Authorization: `Bearer ${localStorage.getItem('user_token')}`,
                    'Content-Type': 'application/json',
                },
            })
            return response.data
        } catch (error) {
            console.error('Error fetching user data:', error)
            throw error
        }
    }

    const updateUser = async (id, data) => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.put(`${BASE_URL}/event-scanner/updateUser/${id}`, data, { headers });

            return response.data;
        } catch (error) {
            return error;
        }
    }
    const deleteUser = async (id) => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.delete(`${BASE_URL}/event-scanner/deleteUser/${id}`, { headers });
            return response.data;
        } catch (error) {
            return error;
        }
    }


    const [vendorEvent, setVendorEvent] = useState([]);
    const getvendorEvent = async (organizer) => {
        // console.log(Adddata)
        const res = await WithdrawService.vendorEvent(organizer);
        console.log(res, "vendorEVnt");
        setVendorEvent(res.data || []);
    }

    // useEffect(() => {
    //     getvendorEvent();
    // }, [Adddata.organizer])


    return (
        <ScannerContext.Provider value={{ addUser, getUser, updateUser, deleteUser, vendorEvent, getvendorEvent, setVendorEvent }}>
            {children}
        </ScannerContext.Provider>
    )
}

export const useScannerContext = () => useContext(ScannerContext) 
