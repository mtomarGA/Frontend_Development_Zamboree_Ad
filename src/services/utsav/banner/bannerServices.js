import axios from "axios";

import React from 'react'
const BASE_URL = process.env.NEXT_PUBLIC_URL;

const BannerRoute = {

    getBanner: async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/banner/`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    PostBanner: async (AddData) => {
        const token = sessionStorage.getItem("user_token");
        // console.log(AllData)
        try {
            const headers = {
                Authorization: `Bearer ${token}`,

            };

            // Send the POST request with the request body
            const response = await axios.post(`${BASE_URL}/banner/`, AddData, { headers });


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
            const response = await axios.put(`${BASE_URL}/banner/${id}`, EditData, { headers });
            return response.data;
        } catch (error) {
            return error.data;
        }
    },


    deleteData: async (id) => {
        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                //   'Content-Type': 'application/json',
            };

            const response = await axios.delete(`${BASE_URL}/banner/${id}`, { headers });
            return response.data;
        } catch (error) {
            return response.data;
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
            const response = await axios.get(`${BASE_URL}/banner/${id}`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    getsearch: async (searchbill) => {
        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.post(`${BASE_URL}/banner/search`, searchbill, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }

    }



}
export default BannerRoute
