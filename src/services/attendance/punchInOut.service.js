import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const punchService = {
  punchIn: async requestBody => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.post(`${BASE_URL}/admin/attendance/punch-in`, requestBody, { headers })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // /today
  getTodayStatus: async () => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      }
      const response = await axios.get(`${BASE_URL}/admin/attendance/today`, { headers })
      return response.data
    } catch (error) {}
  },

 getMyAttendance: async (params = {}) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }

    const response = await axios.get(
      `${BASE_URL}/admin/attendance/myAttendance`,
      {
        headers,
        params   
      }
    )

    return response.data
  } catch (error) {
    console.error('Error fetching attendance:', error)
    throw error
  }
},

  dailyAttendance: async (data) => {
    
    try {
      const headers = {
        'Content-Type': 'application/json'
      }
      const response = await axios.get(`${BASE_URL}/admin/attendance/daily`, { headers , params:data } ,)
      return response.data
    } catch (error) {}
  },

  //  monthAttendance: async () => {
  //   try {
  //     const headers = {
  //       'Content-Type': 'application/json'
  //     }
  //     const response = await axios.get(`${BASE_URL}/admin/attendance/monthly`, { headers })
  //     return response.data
  //   } catch (error) {}
  // },

  monthAttendance: async (query) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }
    const response = await axios.get(`${BASE_URL}/admin/attendance/monthly`, {
      headers,
      params: query  
    })
    return response.data
  } catch (error) {
    console.error("Error fetching monthly attendance:", error)
    throw error
  }
},

  getSinglePunch: async id => {
    const token = sessionStorage.getItem('user_token')
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }
      const response = await axios.get(`${BASE_URL}/attendance/${id}`, { headers })
      return response.data
    } catch (error) {
      throw error
    }
  },

  updatePunch: async (punchId, formData) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.put(`${BASE_URL}/attendance/${punchId}`, formData, { headers })
      return response.data
    } catch (error) {
      throw error
    }
  },

  deletePunch: async id => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.delete(`${BASE_URL}/attendance/${id}`, { headers })
      return response.data
    } catch (error) {
      throw error
    }
  },

  EmployAttendance: async (id, data) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.post(`${BASE_URL}/admin/attendance/myAttendance/${id}`,data, { headers })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Entry Attendance for hr

  addEntry: async requestBody => {
    const token = sessionStorage.getItem('user_token')
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.post(`${BASE_URL}/admin/attendance/createAttendanceEnteries`, requestBody, { headers })
      return response.data
    } catch (error) {
      throw error
    }
  },

getEntry: async (params = {}) => {
  const token = sessionStorage.getItem('user_token')

  if (!token) {
    throw new Error('No authentication token found')
  }

  try {
    const response = await axios.get(`${BASE_URL}/admin/attendance/getAttendanceEntry`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        ...params, 
        global_view: true
      }
    })

    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch attendance data')
  }
},

  updateEntry: async (id, formData) => {
    const token = sessionStorage.getItem('user_token')
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }
      const response = await axios.put(`${BASE_URL}/admin/attendance/updateEntry/${id}`, formData, { headers })
      return response.data
    } catch (error) {
      throw error
    }
  },
  deleteEntry: async id => {
  const token = sessionStorage.getItem('user_token')
  try {
   
    const response = await axios.delete(`${BASE_URL}/admin/attendance/deleteEntry/${id}`)
    return response.data
  } catch (error) {
  
  }
}
}

export default punchService
