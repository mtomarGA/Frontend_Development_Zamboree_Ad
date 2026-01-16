import axios from "axios";
import { Search } from "lucide-react";

import React from 'react'
const BASE_URL = process.env.NEXT_PUBLIC_URL;

const EventService = {

    Get: async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/event-management/`, { headers });
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


            const response = await axios.post(`${BASE_URL}/event-management/`, formData, { headers });


            return response.data;

        } catch (error) {
            return error.response.data;
        }
    },


    putData: async (id, EditData) => {
        const token = sessionStorage.getItem("user_token");

        try {

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.put(`${BASE_URL}/event-management/${id}`, EditData, { headers });

            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },

    getbyid: async (id) => {
        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.get(`${BASE_URL}/event-management/${id}`, { headers });
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

            const response = await axios.delete(`${BASE_URL}/event-management/${id}`, { headers });
            return response.data;

        } catch (error) {
            return error;
        }
    },




}
export default EventService

