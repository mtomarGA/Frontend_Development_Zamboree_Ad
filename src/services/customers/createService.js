import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_URL;


const userRegister = {

  createUser: async (data) => {

    // console.log(data)
    const token = sessionStorage.getItem("user_token");
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      const response = await axios.post(`${BASE_URL}/create-new-user/create-user`, data, { headers })
      return response.data
    } catch (error) {
      console.error("API Error:", error.response?.data.message || error.message);
      throw error;
    }

  },

  allusers: async () => {
    const token = sessionStorage.getItem("user_token");
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      const response = await axios.get(`${BASE_URL}/create-new-user/get-user`, { headers })
      return response.data

    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      throw error;
    }
  },
  getSerchUser: async (data) => {
    console.log(data, 'dadaddada')
    const token = sessionStorage.getItem("user_token");
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        // "Content-Type": "multipart/form-data",
      };
      const response = await axios.get(`${BASE_URL}/create-new-user/search?data=${data}`, { headers })
      return response.data
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      toast.error(error.response?.data.message);
      throw error
    }

  },

  deleteuser: async (id) => {
    const token = sessionStorage.getItem("user_token");

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        // "Content-Type": "multipart/form-data",
      };

      const response = await axios.delete(`${BASE_URL}/create-new-user/delete-user/${id}`, { headers })
      return response.data

    } catch (error) {

      console.log(error)
      toast.error(error?.response?.data?.message)

    }
  },

  updateUser: async (formData, userId) => {
    const token = sessionStorage.getItem("user_token");

    console.log('formData', formData)

    try {
      // Optional: log formData entries
      if (formData instanceof FormData) {
        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        // Do NOT set "Content-Type" manually when sending FormData
      };

      const response = await axios.put(
        `${BASE_URL}/create-new-user/update-user/${userId}`,
        formData,
        { headers }
      );

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }
  },

  getsingle: async (id) => {
    const token = sessionStorage.getItem("user_token");
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        // Do NOT set "Content-Type" manually when sending FormData
      };

      const response = await axios.get(`${BASE_URL}/create-new-user/single-user/${id}`, { headers })
      return response.data

    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }

  },
  checkPhone: async (phoneNumber) => {
    const phone = {
      phone: phoneNumber
    }
    const token = sessionStorage.getItem("user_token");
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        // Do NOT set "Content-Type" manually when sending FormData
      };
      const response = await axios.post(`${BASE_URL}/create-new-user/check-phone`, phone, { headers })
      return response.data
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }
  },
  checkEmail: async (data) => {
    const token = sessionStorage.getItem("user_token");
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        // Do NOT set "Content-Type" manually when sending FormData
      };
      const response = await axios.post(`${BASE_URL}/create-new-user/check-email`, data, { headers })
      return response.data
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }
  },
  addAddress: async (userId, data) => {
    const token = sessionStorage.getItem("user_token");
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        // Do NOT set "Content-Type" manually when sending FormData
      };
      const response = await axios.put(`${BASE_URL}/create-new-user/add-address/${userId}`, data, { headers })
      return response.data
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }
  },
  getAddress: async (id) => {
    const token = sessionStorage.getItem("user_token");
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        // Do NOT set "Content-Type" manually when sending FormData
      };
      const response = await axios.get(`${BASE_URL}/create-new-user/get-address/${id}`, { headers })
      return response.data
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }
  },
  setDefault: async (addressId, data) => {
    const token = sessionStorage.getItem("user_token");
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.put(`${BASE_URL}/create-new-user/set-default/${addressId}`, data, { headers })
      return response.data
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }
  },
  deleteAdd: async (addId, userId) => {
    const token = sessionStorage.getItem("user_token");
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.put(`${BASE_URL}/create-new-user/delete-add/${addId}`, userId, { headers })
      return response.data
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }
  },
  editAddress: async (userId, data) => {
    const token = sessionStorage.getItem("user_token")
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.put(`${BASE_URL}/create-new-user/edit-address/${userId}`, data, { headers })
      return response.data
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }
  },
  getFollowedBusiness: async (userId) => {
    const token = sessionStorage.getItem("user_token")
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${BASE_URL}/admin/follows/get-Followed-business/${userId}`, { headers })
      return response.data
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }
  },
  getSavePost:async(userId)=>{
     const token = sessionStorage.getItem("user_token")
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${BASE_URL}/post-data/get-user-save-post/${userId}`, { headers })
      return response.data
    } catch (error) {
      console.log(error)
      // toast.error(error?.response?.data?.message)
    } 
  }
}

export default userRegister
