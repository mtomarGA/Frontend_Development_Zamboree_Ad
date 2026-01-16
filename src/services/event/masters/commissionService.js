import axios from "axios";

import React from 'react'
const BASE_URL = process.env.NEXT_PUBLIC_URL;

const commissionService = {

    Get: async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/event/event-commission`, { headers });
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


            const response = await axios.post(`${BASE_URL}/event/event-commission`, formData, { headers });


            return response.data;

        } catch (error) {
            return error.response.data;
        }
    },


    putData: async (id, EditData) => {
        const token = sessionStorage.getItem("user_token");
        console.log(id, EditData, "nejedi");
        try {

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.put(`${BASE_URL}/event/event-commission/${id}`, EditData, { headers });

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

            const response = await axios.delete(`${BASE_URL}/event/event-commission/${id}`, { headers });
            return response.data;

        } catch (error) {
            return error;
        }
    },




}
export default commissionService

