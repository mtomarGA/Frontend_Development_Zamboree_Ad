import axios from "axios"
import { toast } from "react-toastify"

const BASE_URL = process.env.NEXT_PUBLIC_URL
const token = sessionStorage.getItem('user_token');

const bannerService = {
    getCitys: async (state) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/location/state-city/${state}`, { headers })
            return (response.data)
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    createBanner: async (data) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.post(`${BASE_URL}/admin/banner/create`, data, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getAllBanner: async () => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/admin/banner/get`, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getSingleBanner: async (bannerId) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/admin/banner/single/${bannerId}`, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    deleteBanner: async (bannerId) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.delete(`${BASE_URL}/admin/banner/delete/${bannerId}`, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    updateBanner: async (bannerId, data) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.put(`${BASE_URL}/admin/banner/update/${bannerId}`, data, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    approveBanner: async (bannerId, data) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.put(`${BASE_URL}/admin/banner/approve/${bannerId}`, data, { headers })
            return response.data
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },

    proposalGenerate: async (bannerId, data) => {


        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.put(`${BASE_URL}/admin/banner/proposal/${bannerId}`, data, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getInvoiceId: async () => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/admin/banner/get-invoice`, { headers })
            return response.data
        } catch (error) {
            throw error;
        }
    },
    getPropsal: async () => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/admin/banner/get-proposal`, { headers })
            return response.data
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    invoiceGenerate: async (bannerId, data) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.put(`${BASE_URL}/admin/banner/invoice/${bannerId}`, data, { headers })
            return response.data
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getInvoiceBanner: async () => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/admin/banner/banner-invoiced`, { headers })
            return response.data
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getAllproposalDetailsById: async (id) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/admin/banner/get-proposalDetails/${id}`, { headers })
            return response.data
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },

    getPaidListing: async () => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/admin/banner/banner-approve`, { headers })
            return response.data
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getDetails: async (bannerId) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/admin/banner/details/${bannerId}`, { headers })
            return response.data
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    addPaymentInvoice: async (invoiceId, data) => {
        console.log(data,"datadata");
        
         const headers = {
                Authorization: `Bearer ${token}`,
            };
        try {
            const response = await axios.put(`${BASE_URL}/admin/banner/add-payement/${invoiceId}`, data, { headers })
            return response.data
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    sendMail: async (data) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.post(`${BASE_URL}/admin/banner/send-mail`, data, { headers })
            return response.data
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    CompanyDetails: async () => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/invoice-setting/get-invoice`, { headers })
            return response.data
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    addNotes:async(bannerId,data)=>{
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.put(`${BASE_URL}/admin/banner/add-notes/${bannerId}`,data, { headers })
            return response.data
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        } 
    },
    getNotes:async(bannerId,data)=>{
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/admin/banner/get-notes/${bannerId}`,data, { headers })
            return response.data
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        } 
    }


}
export default bannerService
