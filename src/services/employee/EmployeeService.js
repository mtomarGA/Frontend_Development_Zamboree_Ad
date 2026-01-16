import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/employee`

// import { toast } from 'react-toastify'

const EmployeeService = {
  createEmployee: async values => {
    try {
      const response = await axios.post(`${BASE_URL}/employee`, values)
      toast.success(response.data.message)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.response?.data.message || 'Failed to create employee')
    }
  },
  getEmployeeById: async id => {
    try {
      const response = await axios.get(`${BASE_URL}/employee/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching employee by ID:', error)
      toast.error(error.response?.data.message || 'Failed to fetch employee details')
    }
  },
  getAll: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/employees`)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.response?.data.message || 'Failed to fetch employees')
      
    }
  },
  getList: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/all`)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  },
  updateEmployee: async (id, values) => {
    try {
      const response = await axios.put(`${BASE_URL}/employee/${id}`, values)
      toast.success(response.data.message)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.response?.data.message || 'Failed to update employee')
    }
  },
  deleteEmployee: async id => {
    try {
      const response = await axios.delete(`${BASE_URL}/employee/${id}`)
      toast.success(response.data.message)
      return response.data
    } catch (error) {
      toast.error(error.response?.data.message || 'Failed to delete employee')
    }
  },
  // Swati sinha work here 
  getEmployeeDetailsByMobile: async (data) => {
    try {
      const response = await axios.get(`${BASE_URL}/search?data=${data}`);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data.message || 'Failed to fetch employee details');
    }
  },

   getSearchEmployee: async (query) => {
    console.log("data",query);
    
    try {
      const response = await axios.get(`${BASE_URL}/search`, {
        params:{...query},
       
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(error.response?.data.message || 'Failed to fetch employee details');
    }
  },
  getAllShift: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/working_shift`)
      return response.data
    } catch (error) {
      toast.error(error.response?.data.message || 'Failed to fetch shifts')
    }
  }

}

export default EmployeeService
