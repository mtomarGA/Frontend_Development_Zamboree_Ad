import axios from "axios";
import { Voces } from "next/font/google";

import React from 'react'
import { get } from "react-hook-form";
const BASE_URL = process.env.NEXT_PUBLIC_URL;

const voucherRoute = {

    getVoucher: async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
        

        try {
            const response = await axios.get(`${BASE_URL}/voucher/`, { headers });
            console.log(response.data, "get voucher");
            return response.data;
          
        } catch (error) {
            console.error(error);
        }
    },

    PostVoucher: async (voucher) => {

        const token = sessionStorage.getItem("user_token");
        // console.log(AllData)
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            // Send the POST request with the request body
            const response = await axios.post(`${BASE_URL}/voucher/`, voucher, { headers });


            return response.data;

        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },


    putData: async (id, EditData) => {
        console.log(id, EditData, "nejedi");
        const token = sessionStorage.getItem("user_token");
        // console.log(id, "iiddddddd");
        // console.log(EditData);
        try {

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.put(`${BASE_URL}/voucher/${id}`, EditData, { headers });
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

            const response = await axios.delete(`${BASE_URL}/voucher/${id}`, { headers });
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
            const response = await axios.get(`${BASE_URL}/voucher/${id}`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    getsearch: async (searchvoucher) => {
        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.post(`${BASE_URL}/voucher/search`, searchvoucher, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }

    }



}
export default voucherRoute
