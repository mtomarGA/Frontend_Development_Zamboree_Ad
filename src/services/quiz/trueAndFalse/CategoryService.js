import axios from "axios";

import React from 'react'
const BASE_URL = process.env.NEXT_PUBLIC_URL;

const TrueAndFalseCategoryRoute = {

    Get: async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/true-and-false-category/`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    Post: async (formData) => {

        // console.log(formData);

        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,

            };


            const response = await axios.post(`${BASE_URL}/true-and-false-category/`, formData, { headers });


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
            const response = await axios.put(`${BASE_URL}/true-and-false-category/${id}`, EditData, { headers });
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

            const response = await axios.delete(`${BASE_URL}/true-and-false-category/${id}`, { headers });
            // console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    getdatabyid: async (id) => {
        const token = sessionStorage.getItem("user_token");
        console.log(id, "iiddddddd");
        try {

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.get(`${BASE_URL}/true-and-false-category/${id}/`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    updateOrder: async (categories) => {
        const token = sessionStorage.getItem("user_token");
        // console.log(categories, "categories");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.put(`${BASE_URL}/true-and-false-category/update-order`, { categories }, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    category: async () => {
        const token = sessionStorage.getItem("user_token");
        // console.log(categories, "categories");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.get(`${BASE_URL}/true-and-false-category/category`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },


}
export default TrueAndFalseCategoryRoute
