import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_URL;



const country = {
    getCountry: async () => {
        const token = sessionStorage.getItem("user_token");

        try {

            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            };

            const response = await axios.get(`${BASE_URL}/location/country`, { headers })
            return response.data
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);

            // Re-throw the original error with full Axios structure
            throw error;
        }

    },

    getState: async (id) => {
        if (!id) {
            console.error("getArea: No ID provided");
            return [];
          }
        // console.log(id)
        const token = sessionStorage.getItem("user_token");

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            };


            const response = await axios.get(`${BASE_URL}/location/state/${id}`, { headers })
            return response.data
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);

            // Re-throw the original error with full Axios structure
            throw error;
        }

    },

    getCity: async (id) => {
        if (!id) {
            console.error("getArea: No ID provided");
            return [];
          }
        const token = sessionStorage.getItem("user_token");

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            };

            const response = await axios.get(`${BASE_URL}/location/city/${id}`, { headers })
            return response.data

        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);

            // Re-throw the original error with full Axios structure
            throw error;
        }

    },
    getArea: async (id) => {
        if (!id) {
            console.error("getArea: No ID provided");
            return [];
          }
        
        const token = sessionStorage.getItem("user_token");

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response=await axios.get(`${BASE_URL}/location/area/${id}`,{headers})
            console.log(response.data)

            return response.data

            

        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            // Re-throw the original error with full Axios structure
            throw error;
        }
    }



}


export default country
