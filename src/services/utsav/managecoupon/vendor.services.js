import axios from "axios";

import React from 'react'
const BASE_URL = process.env.NEXT_PUBLIC_URL;

const VendorWiseCouponRoute = {
    getVendorCoupons: async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/vendor/coupon-summary`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    getActiveCoupons: async (BusinessId) => {
        // console.log(BusinessId, "services")
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/vendor/active/${BusinessId}`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    getPendingCoupons: async (BusinessId) => {
        // console.log(BusinessId, "services")
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/vendor/pending/${BusinessId}`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    getExpiredCoupons: async (BusinessId) => {
        // console.log(BusinessId, "services")
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/vendor/expired/${BusinessId}`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    getRejectedCoupons: async (BusinessId) => {
        // console.log(BusinessId, "services")
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/vendor/rejected/${BusinessId}`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },


    getSearchCoupons: async (search) => {
        // console.log(BusinessId, "services")
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post(`${BASE_URL}/vendor/search`, search, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },



}

export default VendorWiseCouponRoute
