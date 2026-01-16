import axios from "axios"
import { toast } from "react-toastify"




const BASE_URL = process.env.NEXT_PUBLIC_URL
const token = sessionStorage.getItem('user_token')


const headers = {
    Authorization: `Bearer ${token}`
}

axios.defaults.headers = headers

const spritualServices = {
    searchHinduTabmple: async (q) => {
        try {
            const response = await axios.get(`${BASE_URL}/spritual/hindu/search`, {
                params: { q }
            });
            return response.data;
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    SearchGurudwara: async (q) => {
        try {
            const response = await axios.get(`${BASE_URL}/spritual/sikh/search`, {
                params: { q }
            });
            return response.data;
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    SearchChurch:async(q)=>{
        try {
            const response = await axios.get(`${BASE_URL}/spritual/christ/search`, {
                params: { q }
            });
            return response.data;
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        } 
    },
    SearchJain:async(q)=>{
        try {
            const response = await axios.get(`${BASE_URL}/spritual/jain/search`, {
                params: { q }
            });
            return response.data;
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        } 
    },
    SearchIslam:async(q)=>{
        try {
            const response = await axios.get(`${BASE_URL}/spritual/islam/search`, {
                params: { q }
            });
            return response.data;
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        } 
    },
    SearchChaitya:async(q)=>{
        try {
            const response = await axios.get(`${BASE_URL}/spritual/buddha/search`, {
                params: { q }
            });
            return response.data;
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        } 
    }



}

export default spritualServices
