import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_URL;

const CategoryBannerRoute = {
    getBanner: async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/admin/category-banner/`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    PostBanner: async (AddData) => {
        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,

            };

            const response = await axios.post(`${BASE_URL}/admin/category-banner/`, AddData, { headers });


            return response.data;

        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },


    putData: async (id, EditData) => {
        const token = sessionStorage.getItem("user_token");
        try {

            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.put(`${BASE_URL}/admin/category-banner/${id}`, EditData, { headers });
            return response.data;
        } catch (error) {
            return error.data;
        }
    },


    deleteData: async (id) => {
        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.delete(`${BASE_URL}/admin/category-banner/${id}`, { headers });
        } catch (error) {
            console.error(error);
        }
    },

    getdatabyid: async (id) => {
        const token = sessionStorage.getItem("user_token");
        console.log(id)
        try {

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.get(`${BASE_URL}/admin/category-banner/${id}`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    getsearch: async (searchbill) => {
        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.post(`${BASE_URL}/admin/category-banner/search`, searchbill, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
}
export default CategoryBannerRoute
