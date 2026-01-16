

import axios from "axios";

import React from 'react'
const BASE_URL = process.env.NEXT_PUBLIC_URL;

const TrueAndFalseLevelRoute = {

    Get: async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/true-and-false-level/`, { headers });
            return response.data;
        } catch (error) {
            return error
        }
    },

    Post: async (formData) => {



        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',

            };


            const response = await axios.post(`${BASE_URL}/true-and-false-level/`, formData, { headers });


            return response.data;

        } catch (error) {
            return error
        }
    },


    putData: async (id, EditData) => {
        const token = sessionStorage.getItem("user_token");

        try {

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.put(`${BASE_URL}/true-and-false-level/${id}`, EditData, { headers });
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

            const response = await axios.delete(`${BASE_URL}/true-and-false-level/${id}`, { headers });

            return response.data;
        } catch (error) {
            console.error(error);
        }
    },




}
export default TrueAndFalseLevelRoute
