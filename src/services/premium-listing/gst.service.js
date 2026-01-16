import axios from "axios"
import { toast } from "react-toastify"

const BASE_URL = process.env.NEXT_PUBLIC_URL
const token = sessionStorage.getItem('user_token');


const gstTextService = {
    updateGST: async (gstData) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.put(`${BASE_URL}/admin/gst-text/gst-text`, gstData, { headers })
            return (response.data)
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getGSTValue: async () => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/admin/gst-text/get-gst-value`, { headers })
            return (response.data)
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },

    addNewGST: async (data) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.post(`${BASE_URL}/admin/add-new-gst/add-gst-percentage`,data, { headers })
            return (response.data)
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getAllACTIVEGST:async()=>{
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/admin/add-new-gst/get-all-gst-perce`, { headers })
            return (response.data)
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    updateGSTDetails:async(_id,data)=>{
         try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.put(`${BASE_URL}/admin/add-new-gst/update-gst/${_id}`,data, { headers })
            return (response.data)
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    }
}


export default gstTextService
