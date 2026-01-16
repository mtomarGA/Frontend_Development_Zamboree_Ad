import axios from "axios";

import React from 'react'
const BASE_URL = process.env.NEXT_PUBLIC_URL;

const categoryRoute = {

    getcategory: async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/utsav-category/`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    PostCategory: async (formData) => {

        // console.log(formData);
        // for (let pair of formData.entries()) {
        //     console.log(`${pair[0]}:`, pair[1]);
        // }
        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                // 'Content-Type': 'application/json',
            };

            // Send the POST request with the request body
            const response = await axios.post(`${BASE_URL}/utsav-category/`, formData, { headers });


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
                // 'Content-Type': 'application/json',
            };
            const response = await axios.put(`${BASE_URL}/utsav-category/${id}`, EditData, { headers });
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

            const response = await axios.delete(`${BASE_URL}/utsav-category/${id}`, { headers });
            // console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    },
    updateOrder: async (data) => {
        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                //   'Content-Type': 'application/json',
            };

            const response = await axios.post(`${BASE_URL}/utsav-category/update-order`, data, { headers });
            // console.log(response.data);
            return response.data
        } catch (error) {
            console.error(error);
            return error.response.data;
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
            const response = await axios.get(`${BASE_URL}/utsav-category/${id}`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    getsearch: async (Searchdata) => {
        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.post(`${BASE_URL}/announce/Search`, Searchdata, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }

    }



}
export default categoryRoute
