import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const servicePayment = {
    // ATTRIBUTE 
    addServicePayment: async (requestBody) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.post(`${BASE_URL}/admin-payment/add-payment`, requestBody, { headers })
            return response.data
        } catch (error) {
            console.log('Error adding attribute:', error);
        }
    },

    getServicePayment: async () => {
        try {
            const token = sessionStorage.getItem('user_token');

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const response = await axios.get(`${BASE_URL}/admin-payment/get-payment`, { headers });
            return response.data;
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    },

    updateServicePayment: async (_id, formData) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.put(`${BASE_URL}/admin-payment/update-payment/${_id}`, formData, { headers })
            return response.data
        } catch (error) {
            console.log('Error adding attribute:', error);
        }
    },

    // GET ATTRIBUTE BY ATTRIBUTE ID
    getDeletePayment: async (id )=> {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.delete(`${BASE_URL}/admin-payment/delete-payment/${id}`, { headers })
            return response.data
        } catch (error) {
            throw error
        }
    },
    
    getACTIVEPayment:async()=>{
         try {
            const token = sessionStorage.getItem('user_token');

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const response = await axios.get(`${BASE_URL}/admin-payment/get-active-payment`, { headers });
            return response.data;
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    }
  
   
}

export default servicePayment
