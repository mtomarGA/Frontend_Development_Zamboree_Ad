import axios from "axios"
import { toast } from "react-toastify"

const BASE_URL = process.env.NEXT_PUBLIC_URL
const token = sessionStorage.getItem('user_token');
const headers = {
    Authorization: `Bearer ${token}`,
};

const testService={
    getTest:async(search)=>{
      try {
            const response = await axios.get(`${BASE_URL}/keyword/get-keyword-by-name-category-sub/${search}`, { headers })
            return response.data

        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getAllFixedListing:async(data)=>{
        console.log(data,"dddddddddddddddddddddddddd");
        
        try {
            
            const response = await axios.put(`${BASE_URL}/admin/fixed-listing/get-business-listing`,data, { headers })
            return response.data

        } catch (error) {
            console.error('Error adding post:', error);
            console.log(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    }
}

export default testService
