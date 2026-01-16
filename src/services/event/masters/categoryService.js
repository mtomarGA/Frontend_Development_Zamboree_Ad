import axios from "axios";

import React from 'react'
const BASE_URL = process.env.NEXT_PUBLIC_URL;

const EventCategory = {

    Get: async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/event/category`, { headers });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    Post: async (formData) => {

        // console.log(formData);

        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };


            const response = await axios.post(`${BASE_URL}/event/category`, formData, { headers });


            return response.data;

        } catch (error) {
            return error;
        }
    },


    putData: async (id, EditData) => {
        const token = sessionStorage.getItem("user_token");
    
        try {

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.put(`${BASE_URL}/event/category/${id}`, EditData, { headers });

            return response.data;
        } catch (error) {
            return error;
        }
    },


    deleteData: async (id) => {
        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                //   'Content-Type': 'application/json',
            };

            const response = await axios.delete(`${BASE_URL}/event/category/${id}`, { headers });
            return response.data;

        } catch (error) {
           return error;
        }
    },

    getdatabyid: async (id) => {
        const token = sessionStorage.getItem("user_token");

        try {

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.get(`${BASE_URL}/quiz-activity/${id}/`, { headers });
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
            const response = await axios.put(`${BASE_URL}/event/category/update-order`, { categories }, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },


}
export default EventCategory

