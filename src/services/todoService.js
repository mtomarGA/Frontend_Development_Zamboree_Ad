import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL


const TodoService = {
  getTodos: async () => {
    try {
      // Send the GET request to fetch todos
      const response = await axios.get(`${BASE_URL}/todo`)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  },

  addTodo: async data => {
    try {
      // Send the POST request with the request body
      const response = await axios.post(`${BASE_URL}/todo`, data)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  },
  updateTodo: async (id, data) => {
    try {
      const response = await axios.put(`${BASE_URL}/todo/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  },
  deleteTodo: async id => {
    try {
      const response = await axios.delete(`${BASE_URL}/todo/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  }
}

export default TodoService
