import axios from "axios";

import React from 'react'
const BASE_URL = process.env.NEXT_PUBLIC_URL;

const quizRoute = {

    Get: async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/quiz-type/`, { headers });
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
                // 'Content-Type': 'application/json',
            };


            const response = await axios.post(`${BASE_URL}/quiz-type/`, formData, { headers });


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
            const response = await axios.put(`${BASE_URL}/quiz-type/${id}`, EditData, { headers });
            console.log(response.data);
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

            const response = await axios.delete(`${BASE_URL}/quiz-type/${id}`, { headers });
            // console.log(response.data);
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
            const response = await axios.get(`${BASE_URL}/quiz-type/${id}/`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    CoinTransaction: async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/quiz-type/quiz/transactions`, { headers });
            return response.data;
        } catch (error) {
            return error
        }
    },
    DeleteCoinTransaction: async (id) => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.delete(`${BASE_URL}/quiz-type/delete/coin/${id}`, { headers });
            return response.data;
        } catch (error) {
            return error
        }
    },
    contestScore: async (contestId) => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/quiz-type/contest/${contestId}`, { headers });
            return response.data;
        } catch (error) {
            return error
        }
    },

    distribute_Prize: async (ids) => {
        const token = sessionStorage.getItem("user_token");
        try {

            const headers = {
                Authorization: `Bearer ${token}`,
                // 'Content-Type': 'application/json',
            };
            const response = await axios.put(`${BASE_URL}/quiz-type/contest/distribute`, { ids }, { headers });
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
    allleaderboard: async (type) => {
        const token = sessionStorage.getItem("user_token");
        try {

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.get(`${BASE_URL}/quiz-type/allleaderboard?type=${type}`, { headers });
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    },
   

}
export default quizRoute
