import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_URL;

const CategoryBrandRoute = {
    addBussinessBrand: async (data) => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post(`${BASE_URL}/admin/business-brand/create`,data, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    getBussinessBrand: async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/admin/business-brand/get`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    deleteBussinessBrand: async (_id) => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.delete(`${BASE_URL}/admin/business-brand/delete/${_id}`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    updateBussinessBrand: async (_id,data) => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.put(`${BASE_URL}/admin/business-brand/update/${_id}`,data, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
    getBussinessBrandUsingCat: async (_id) => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/admin/business-brand/get-brand-with-cat/${_id}`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },
}

export default CategoryBrandRoute
