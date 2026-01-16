import axios from "axios";
import { toast } from "react-toastify";
const BASE_URL = process.env.NEXT_PUBLIC_URL

const PhoneOtpService = {
    sendOtp: async (data) => {
        console.log(data,"ssssss");
        
        const payload = {
            phone: data,
            to: data
        }
        console.log('payload', payload)
        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.post(`${BASE_URL}/sms/send-otp`, payload, { headers });
            return response.data;
        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error(error.response?.data?.message);
            console.log(error);
        }
    },

    verifyOtp: async (number, otp) => {
        const phone = {
            phone: number,
            otp: otp,
        }

        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.post(`${BASE_URL}/sms/verify-otp`, phone, { headers });
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message);
            console.log(error);
        }
    },

    // Send sign otp for registration it checks vendor already exists or not

    sendSignUpOtp: async (number, to) => {
        const payload = {
            phone: number,
            to: to
        };
        console.log(payload, "phone phone phone");

        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.post(`${BASE_URL}/admin-business/send-otp`, payload, { headers });
            return response.data;
        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error(error.response?.data?.message);
            console.log(error);
        }
    }

}
export default PhoneOtpService;
