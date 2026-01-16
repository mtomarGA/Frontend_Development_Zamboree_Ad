import axios from "axios"
import { toast } from "react-toastify"

const BASE_URL = process.env.NEXT_PUBLIC_URL

const reimbursementServices = {
  
  createReimbursement: async (data) => {
    const token = sessionStorage.getItem("user_token")
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      }
      const response = await axios.post(
        `${BASE_URL}/admin/payroll/createReimbursement`,
        data,
        { headers }
      )
      toast.success(response.data.message)
      return response.data
    } catch (error) {
      console.error("Error creating reimbursement:", error)
      toast.error(error?.response?.data?.message || "Failed to create reimbursement")
      throw error
    }
  },

  
  getAllReimbursement: async () => {
    const token = sessionStorage.getItem("user_token")
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      }
      const response = await axios.get(
        `${BASE_URL}/admin/payroll/getAllReimbursement`,
        { headers }
      )
      return response.data
    } catch (error) {
      console.error("Error fetching reimbursements:", error)
      toast.error(error?.response?.data?.message || "Failed to fetch reimbursements")
      throw error
    }
  },

  updateReimbursement: async (id, data) => {
    const token = sessionStorage.getItem("user_token")
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      }
      const response = await axios.put(
        `${BASE_URL}/admin/payroll/updateReimbursement/${id}`,
        data,
        { headers }
      )
      toast.success(response.data.message)
      return response.data
    } catch (error) {
      console.error("Error updating reimbursement:", error)
      toast.error(error?.response?.data?.message || "Failed to update reimbursement")
      throw error
    }
  },

  deleteReimbursement: async (id) => {
    const token = sessionStorage.getItem("user_token")
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      }
      const response = await axios.delete(
        `${BASE_URL}/admin/payroll/deleteReimbursement/${id}`,
        { headers }
      )
      toast.success(response.data.message)
      return response.data
    } catch (error) {
      console.error("Error deleting reimbursement:", error)
      toast.error(error?.response?.data?.message || "Failed to delete reimbursement")
      throw error
    }
  },
}

export default reimbursementServices
