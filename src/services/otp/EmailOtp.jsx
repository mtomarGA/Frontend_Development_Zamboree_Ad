import axios from "axios";
import { toast } from "react-toastify";
const BASE_URL = process.env.NEXT_PUBLIC_URL

const EmailOtpService = {
    sendOtp: async (data) => {
        const payload = {
            email: data.email,
            name: data.name
        };

        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.post(`${BASE_URL}/email/send-otp`, payload, { headers });
            return response.data;
        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error(error.response?.data?.message || 'Failed to send OTP');
            throw error;
        }
    },

    verifyOtp: async (data) => {
        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.post(`${BASE_URL}/email/verify-otp`, data, { headers });
            return response.data;
        } catch (error) {
            console.error('Error verifying OTP:', error);
            toast.error(error.response?.data?.message);
            throw error;
        }
    }
}
export default EmailOtpService;
