import axios from "axios";

import React from 'react'
const BASE_URL = process.env.NEXT_PUBLIC_URL;

const RedeemRoute = {

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
            // return error
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
            const response = await axios.post(`${BASE_URL}/redeem/`, addcoupondata, { headers });


            return response.data;

        } catch (error) {
            console.error('Error fetching data:', error);
            // throw error;
            return error.response
        }
    },


    sendCodeData: async (sendCode) => {
        // console.log(sendCode)
        const token = sessionStorage.getItem("user_token");
        try {

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.post(`${BASE_URL}/redeem/redeemcode`, sendCode, { headers });
            return response;
            // console.log(response);
            // console.log(response.data)
        } catch (error) {
            return error.response;
        }
    },


    getRedeemHistory: async (id) => {
        const token = sessionStorage.getItem("user_token");
        console.log(id, "hey")
        try {

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.get(`${BASE_URL}/redeem/${id}`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    ClaimCoupon: async (data) => {
        const token = sessionStorage.getItem("user_token");
        try {

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.post(`${BASE_URL}/redeem/claims`, data, { headers });
            return response.data;
        } catch (error) {
            return error.response;
        }
    },



}
export default RedeemRoute
