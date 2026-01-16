import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_URL;


const AIService = {
    addAIService: async (data) => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post(`${BASE_URL}/admin/ai/ai-add`,data ,{ headers });
            return response;
        } catch (error) {
            console.error(error);
        }
    },
    getAIService: async () => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/admin/ai/get-ai` ,{ headers });
            return response;
        } catch (error) {
            console.error(error);
        }
    },
    

}


export default AIService
