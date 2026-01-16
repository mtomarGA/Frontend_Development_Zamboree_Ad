'use client'

import axios from 'axios'
import React, { createContext, use, useContext, useState } from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_URL
const InvoiceContext = createContext()

export function InvoiceSettingProvider({ children }) {
    // state
    const [data, setdata] = useState([]);


    const getSetting = async () => {
        const token = sessionStorage.getItem('user_token')
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }

        try {
            const response = await axios.get(
                `${BASE_URL}/invoice-setting/`,
                { headers }
            )
            return response.data
        } catch (error) {
            return error
        }
    }

    const getdatafun = async () => {
        const response = await getSetting();
        setdata(response.data || []);
    }



    const addInvoice = async (data) => {
        const token = sessionStorage.getItem('user_token')
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }

        try {
            const response = await axios.post(
                `${BASE_URL}/invoice-setting/`,
                data,
                { headers }
            )
            return response.data
        } catch (error) {
            return error.response.data
        }
    }


    const deleteSetting = async (id) => {
        const token = sessionStorage.getItem('user_token')
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }

        try {
            const response = await axios.delete(
                `${BASE_URL}/invoice-setting/${id}`,
                { headers }
            )
            return response.data
        } catch (error) {
            return error.response.data
        }
    }

    const updateSetting = async (id, data) => {
        const token = sessionStorage.getItem('user_token')
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }

        try {
            const response = await axios.put(
                `${BASE_URL}/invoice-setting/${id}`,
                data,
                { headers }
            )
            return response.data
        } catch (error) {
            return error.response.data
        }
    }

    return (
        <InvoiceContext.Provider value={{ addInvoice, getdatafun, data, setdata, deleteSetting, updateSetting }}>
            {children}
        </InvoiceContext.Provider>
    )
}

export const useInvoiceContext = () => useContext(InvoiceContext)
