import axios from "axios";
import React from 'react'
const BASE_URL = process.env.NEXT_PUBLIC_URL;

const TrueAndFalseSubCategoryRoute = {

    Get: async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/true-and-false-subcategory/`, { headers });
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


            const response = await axios.post(`${BASE_URL}/true-and-false-subcategory/`, formData, { headers });


            return response.data;

        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },


    putData: async (id, EditData) => {
        const token = sessionStorage.getItem("user_token");

        try {

            const headers = {
                Authorization: `Bearer ${token}`,
                // 'Content-Type': 'application/json',
            };
            const response = await axios.put(`${BASE_URL}/true-and-false-subcategory/${id}`, EditData, { headers });
            // console.log(response.data);
            return response.data;
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

            const response = await axios.delete(`${BASE_URL}/true-and-false-subcategory/${id}`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    getdatabyid: async (id) => {
        const token = sessionStorage.getItem("user_token");

        try {

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.get(`${BASE_URL}/true-and-false-subcategory/${id}/`, { headers });
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
            const response = await axios.put(`${BASE_URL}/true-and-false-subcategory/update-order`, { categories }, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    searchcategory: async (data) => {
        const token = sessionStorage.getItem("user_token");
        // console.log(categories, "categories");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.post(`${BASE_URL}/true-and-false-subcategory/search`, data, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    subcategory: async (category) => {
        const token = sessionStorage.getItem("user_token");
        // console.log(categories, "categories");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.post(`${BASE_URL}/true-and-false-subcategory/subcategory`, { category }, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },




}
export default TrueAndFalseSubCategoryRoute
