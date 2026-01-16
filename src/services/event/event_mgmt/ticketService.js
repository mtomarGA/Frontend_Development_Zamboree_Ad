import axios from "axios";

import React from 'react'
const BASE_URL = process.env.NEXT_PUBLIC_URL;

const TicketService = {

    Get: async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/event-management/ticket/`, { headers });
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


            const response = await axios.post(`${BASE_URL}/event-management/ticket/`, formData, { headers });


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
            const response = await axios.put(`${BASE_URL}/event-management/ticket/${id}`, EditData, { headers });

            return response.data;
        } catch (error) {
            return error;
        }
    },

    getbyid: async (id) => {
        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.get(`${BASE_URL}/event-management/ticket/${id}`, { headers });
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

            const response = await axios.delete(`${BASE_URL}/event-management/ticket/${id}`, { headers });
            return response.data;

        } catch (error) {
            return error;
        }
    },


    getBookedTicketByTicketId: async (Id) => {
        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.get(`${BASE_URL}/event-management/booked-tickets/${Id}`, { headers });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getBookedTicketByEventIdAttendees: async (data) => {
        // console.log(data)

        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            if (data.date) {
                const response = await axios.post(`${BASE_URL}/event-management/booked-tickets/${data.id}`, { date: data.date }, { headers });
                return response.data;

            }
            else {
                const response = await axios.post(`${BASE_URL}/event-management/booked-tickets/${data.id}`, { headers });
                return response.data;
            }
        } catch (error) {
            return error;
        }
    },

    BookTicket: async (formData) => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post(`${BASE_URL}/event-management/booked-tickets/`, formData, { headers });
            return response.data;
        } catch (error) {
            return error;
        }
    }
}
export default TicketService

