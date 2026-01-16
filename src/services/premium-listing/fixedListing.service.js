import axios from "axios"
import { toast } from "react-toastify"

const BASE_URL = process.env.NEXT_PUBLIC_URL
const token = sessionStorage.getItem('user_token');
const headers = {
    Authorization: `Bearer ${token}`,
};

const fixedListing = {
    addFixedListing: async (data) => {
        try {
            const response = await axios.post(`${BASE_URL}/admin/fixed-listing/create`, data, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getFixedListing: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/fixed-listing/get`, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getSingleFixedListing: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/fixed-listing/single/${id}`, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    deleteFixedListing: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/admin/fixed-listing/delete/${id}`, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    updateFixedListing: async (id, data) => {
        try {
            const response = await axios.put(`${BASE_URL}/admin/fixed-listing/update/${id}`, data, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    approvelFixed: async (id, data) => {
        try {
            const response = await axios.put(`${BASE_URL}/admin/fixed-listing/approve-fixed/${id}`, data, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getPosationFixedBusiness: async (data) => {
        try {
            const response = await axios.post(`${BASE_URL}/admin/fixed-listing/get-posation`, data, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    sendProposal: async (fixedListingId, data) => {

        try {
            const response = await axios.put(`${BASE_URL}/admin/fixed-listing/send-proposal/${fixedListingId}`, data, { headers })
            return response.data
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    InvoiceGen: async (fixedListingId, data) => {
        console.log(fixedListingId, data);

        try {
            const response = await axios.put(`${BASE_URL}/admin/fixed-listing/gen-invoice/${fixedListingId}`, data, { headers })
            return response.data
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    checkAvilablePosition: async (data) => {
        console.log(data, "datadata");

        try {
            const response = await axios.post(`${BASE_URL}/admin/fixed-listing/get-avil-position`, data, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    addPaymentInvoice: async (invoiceId, data) => {
        
        try {
            const response = await axios.put(`${BASE_URL}/admin/fixed-listing/add-payemnt/${invoiceId}`, data, { headers })
            return response.data
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    addNotes: async (_id, data) => {
        
        try {
            const response = await axios.put(`${BASE_URL}/admin/fixed-listing/add-notes/${_id}`, data, { headers })
            return response.data
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getNotes: async (_id) => {
        
        try {
            const response = await axios.get(`${BASE_URL}/admin/fixed-listing/get-notes/${_id}`, { headers })
            return response.data
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getInvoiceId: async () => {
        
        try {
            const response = await axios.get(`${BASE_URL}/admin/fixed-listing/get-invoice-fixed`, { headers })
            return response.data
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    }
}
export default fixedListing
