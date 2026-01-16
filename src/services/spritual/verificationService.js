import axios from 'axios'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/spritual`


const verificationService = {
    sendSMS : async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}/send-otp`, values)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            
        }
    },
    verifySMS : async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}/verify-otp`, values)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
           
        }
    },
    sendEmail : async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}/email-otp`, values)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            
        }
    },
    verifyEmail : async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}/verify-email`, values)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            return error.response.data
        }
    },
}
export default verificationService
