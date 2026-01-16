import axios from "axios"
import { toast } from "react-toastify"

const BASE_URL = process.env.NEXT_PUBLIC_URL
const token = sessionStorage.getItem('user_token');
const headers = {
    Authorization: `Bearer ${token}`,
};

const PaidListing = {
    addPaidListing: async (data) => {
        try {
            const response = await axios.post(`${BASE_URL}/admin/paid-listing/create`, data, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }

    },
    getPaidListing: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/paid-listing/get`, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getSinglePaidListing: async (paidListingId) => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/paid-listing/get/${paidListingId}`, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    deletePaidListing: async (paidListingId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/admin/paid-listing/delete/${paidListingId}`, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    updatePaidListing: async (paidListingId, data) => {
        try {
            const response = await axios.put(`${BASE_URL}/admin/paid-listing/update/${paidListingId}`, data, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    approvePaidListing: async (PaidListingId, data) => {
        try {
            const response = await axios.put(`${BASE_URL}/admin/paid-listing/approve/${PaidListingId}`, data, { headers })
            console.log(response, 'asamnjhjw swnhswnswkywhwmshws')
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    generateproposal: async (PaidListingId, data) => {
        try {
            const response = await axios.put(`${BASE_URL}/admin/paid-listing/send-propose/${PaidListingId}`, data, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    addPaymentInvoice: async (invoiceId, data) => {
        try {
            const response = await axios.put(`${BASE_URL}/admin/paid-listing/add-paid-paiment-listing/${invoiceId}`, data, { headers })
            return response.data
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    generateInvoiced: async (PaidListingId, data) => {
        try {
            const response = await axios.put(`${BASE_URL}/admin/paid-listing/invoiced-generate/${PaidListingId}`, data, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    generateInvoicedId: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/paid-listing/get-invoice-id`, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    addNotes: async (_id, data) => {

        try {
            const response = await axios.put(`${BASE_URL}/admin/paid-listing/add-notes/${_id}`, data, { headers })
            return response.data
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getNotes: async (_id) => {

        try {
            const response = await axios.get(`${BASE_URL}/admin/paid-listing/get-notes/${_id}`, { headers })
            return response.data
        } catch (error) {
            // toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    }
}
export default PaidListing
