import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_URL;


const NewsService = {
    getNews: async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/news/`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    PostNews: async (AddNews) => {
        const token = sessionStorage.getItem("user_token");
        // console.log(AllData)
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            // Send the POST request with the request body
            const response = await axios.post(`${BASE_URL}/news/`, AddNews, { headers });


            return response.data;

        } catch (error) {
            console.error('Error fetching data:', error);
            return error;
        }
    },


    putData: async (id, EditData) => {
        const token = sessionStorage.getItem("user_token");
        // console.log(id, "iiddddddd");
        // console.log(EditData);
        try {

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.put(`${BASE_URL}/news/${id}`, EditData, { headers });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    },


    deleteData: async (id) => {
        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                //   'Content-Type': 'application/json',
            };

            const response = await axios.delete(`${BASE_URL}/news/${id}`, { headers });
            // console.log(response.data);
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
            const response = await axios.get(`${BASE_URL}/news/${id}`, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    getsearch: async (Searchdata) => {
        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.post(`${BASE_URL}/news/search`, Searchdata, { headers });
            return response.data;
        } catch (error) {
            console.error(error);
        }

    }


}


export default NewsService
