import axios from "axios";

import React from 'react'
const BASE_URL = process.env.NEXT_PUBLIC_URL;

const CouponRoute = {

    getCoupon: async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/coupon/`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    PostCoupon: async (addcoupondata) => {
        const token = sessionStorage.getItem("user_token");
        // console.log(AllData)
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            // Send the POST request with the request body
            const response = await axios.post(`${BASE_URL}/coupon/`, addcoupondata, { headers });


            return response.data;

        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },


    putData: async (id, EditData) => {
        const token = sessionStorage.getItem("user_token");
        // console.log(id, "iiddddddd");
        // console.log(EditData);
        try {

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.put(`${BASE_URL}/coupon/${id}`, EditData, { headers });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    },


    deleteData: async (id) => {
        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                //   'Content-Type': 'application/json',
            };

            const response = await axios.delete(`${BASE_URL}/coupon/${id}`, { headers });
            // console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    },

    getdatabyid: async (id) => {
        const token = sessionStorage.getItem("user_token");
        console.log(id)
        try {

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.get(`${BASE_URL}/coupon/${id}`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    getsearch: async (searchcoupon) => {
        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.post(`${BASE_URL}/coupon/search`, searchcoupon, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }

    }
    ,
    getActiveCoupon: async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/coupon/onlyactive`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    getPendingCoupon: async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/coupon/onlypending`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    getExpiredCoupon: async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/coupon/onlyexpired`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    getRejectedCoupon: async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/coupon/onlyrejected`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    getSearchCoupon: async (search) => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post(`${BASE_URL}/coupon/search`, search, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    getSearchBusiness: async (search) => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post(`${BASE_URL}/coupon/businessSearch`, search, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },



}
export default CouponRoute
