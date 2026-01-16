import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const serviceCategoryService = {
    addServiceCategory: async requestBody => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.post(`${BASE_URL}/admin/service-category/`, requestBody, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    getAllServiceCategory: async () => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.get(`${BASE_URL}/admin/service-category/`, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    updateServiceCategory: async (docid, requestBody) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.put(`${BASE_URL}/admin/service-category/${docid}`, requestBody, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    deleteServiceCategory: async docid => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.delete(`${BASE_URL}/admin/service-category/${docid}`, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    searchCategory: async (query) => {
        const token = sessionStorage.getItem('user_token'); // Get token from session storage

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            };

            const response = await axios.get(`${BASE_URL}/admin/service-category/search`, {
                headers,
                params: {
                    name: query
                }
            });

            console.log(response.data, 'response service searchCategory');
            return response.data; // This will return { data: [...categories], message: "..." }
        } catch (error) {
            console.error('Error searching categories:', error);
            throw error; // Re-throw the error for the calling component to handle
        }
    },
    searchParentCategory: async (query) => {
        const token = sessionStorage.getItem("user_token");

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.get(`${BASE_URL}/admin/service-category/get-parent-cat`, {
                headers,
                params: {
                    name: query,
                },
            });

            return response.data;
        } catch (error) {
            console.error("Error searching categories:", error);
            throw error;
        }
    },
    getEmploryeeSagestedCat: async (categories) => {
        // console.log(categories,"categoriescategoriescategories");

        const token = sessionStorage.getItem('user_token'); // Get token from session storage

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            };

            const response = await axios.post(`${BASE_URL}/admin/service-category/get-emp-sugested-cat`, categories, {
                headers,
            });

            console.log(response.data, 'response service searchCategory');
            return response.data; // This will return { data: [...categories], message: "..." }
        } catch (error) {
            console.error('Error searching categories:', error);
            throw error; // Re-throw the error for the calling component to handle
        }
    },

    // GET ATTRIBUTE BY CATEGORY ID
    getAttributeByCatId: async id => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.get(`${BASE_URL}/admin/service-category/getbyCat/${id}`, { headers })
            return response.data
        } catch (error) {
            throw error
        }
    },

    getAttributeBySearch: async (categoryId, search) => {
        const token = sessionStorage.getItem('user_token');

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            };

            const response = await axios.get(`${BASE_URL}/admin/service-category/get-attribute`, {
                headers,
                params: {
                    categoryId: categoryId,
                    keyword: search
                }
            });

            console.log(response.data, 'response service searchAttribute');
            return response.data;
        } catch (error) {
            console.error('Error searching attributes:', error);
            throw error;
        }
    },
    searchAllCat: async (search) => {
        const token = sessionStorage.getItem('user_token');

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            };

            const response = await axios.get(`${BASE_URL}/admin/service-category/search-cat?name=${search}`, {
                headers,
              
            });

            console.log(response.data, 'response service searchAttribute');
            return response.data;
        } catch (error) {
            console.error('Error searching attributes:', error);
            throw error;
        }
    },
    getkeywordSearch: async (search) => {
        const token = sessionStorage.getItem('user_token');
        try {

            const headers = {
                Authorization: `Bearer ${token}`
            };

            const response = await axios.get(`${BASE_URL}/keyword/get-search-keyword/${search}`, { headers, });
            console.log(response.data, 'response service searchAttribute');
            return response.data;
        } catch (error) {
            console.error('Error searching attributes:', error);
            throw error;
        }
    },
    realatedCategoty: async (search) => {
        const token = sessionStorage.getItem('user_token');
        try {

            const headers = {
                Authorization: `Bearer ${token}`
            };
            const response = await axios.get(`${BASE_URL}/admin/service-category/related-cat/${search}`, { headers, });
            console.log(response.data, 'response service searchAttribute');
            return response.data;
        } catch (error) {
            console.error('Error searching attributes:', error);
            throw error;
        }
    }
}

export default serviceCategoryService
