import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_URL;


const BookedTicket = {

    getbyEventid: async (id) => {
        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
            const response = await axios.post(`${BASE_URL}/event-management/booked-ticket/Transaction`, {id}, { headers });
            return response.data;
        } catch (error) {
            return error;
        }
    },


    deleteData: async (id) => {
        const token = sessionStorage.getItem("user_token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                //   'Content-Type': 'application/json',
            };

            const response = await axios.delete(`${BASE_URL}/event-management/check-in/${id}`, { headers });
            return response.data;

        } catch (error) {
            return error;
        }
    },



 




}
export default BookedTicket

