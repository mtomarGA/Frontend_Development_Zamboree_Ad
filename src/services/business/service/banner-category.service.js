import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_URL;

const CategoryBanner = {
    getBanner: async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/admin-category-banner/get-all-category`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    createBanner: async (data) => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post(`${BASE_URL}/admin-category-banner/create-category-banner`, data, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    deleteBanner: async (_id) => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.delete(`${BASE_URL}/admin-category-banner/delete-banner/${_id}`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    UpdatedBanner: async (_id,data) => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.put(`${BASE_URL}/admin-category-banner/update-banner/${_id}`,data, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

}

export default CategoryBanner
