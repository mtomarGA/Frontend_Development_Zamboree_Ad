import axios from "axios"
import { toast } from "react-toastify"

const BASE_URL = process.env.NEXT_PUBLIC_URL

const postsService = {
    getVendarId: async (id) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.get(`${BASE_URL}/admin-business/`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding Keyword:', error)
            toast.error(error?.response?.data?.message)
            throw error
        }
    },
    getVendarDetails: async (id) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.get(`${BASE_URL}/admin-business/get-vendor-detail/${id}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding Keyword:', error)
            toast.error(error?.response?.data?.message)
            throw error
        }
    },
    addData: async (data) => {
        console.log(data, 'data to submit');

        const formData = new FormData();
        formData.append('description', data?.description || '');
        formData.append('chooseType', data?.chooseType || '');
        formData.append('chooseTypeId', data?.chooseTypeId || '');
        formData.append('locution', data?.locution || '');
        formData.append('locutionkm', data?.locutionkm || '');
        formData.append('status', data?.status || '');
        formData.append('latCoordinage', data?.latCoordinage || '');
        formData.append('langCoordinagee', data?.langCoordinagee || '');
        formData.append('chooseTypeModel', data?.chooseTypeModel)

        // Append image(s)
        if (Array.isArray(data?.images)) {
            data.images.forEach((image, index) => {
                formData.append('files', image); // use `'images[]'` if backend expects array
            });
        } else if (data?.images) {
            formData.append('files', data.images);
        }

        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
                // Don't set Content-Type manually; Axios handles it for FormData
            };
            const response = await axios.post(
                `${BASE_URL}/post-data/`,
                formData,
                { headers }
            );

            return response.data;
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },

    getAllPostedData: async () => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
                // Don't set Content-Type manually; Axios handles it for FormData
            };

            const response = await axios.get(`${BASE_URL}/post-data/`, { headers })
            return response.data

        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },

    getPostById: async (id) => {
        console.log(id, 'iiiiiii')
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
                // Don't set Content-Type manually; Axios handles it for FormData
            };

            const response = await axios.get(`${BASE_URL}/post-data/${id}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },

    deletePost: async (id) => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
                // Don't set Content-Type manually; Axios handles it for FormData
            };
            const response = await axios.delete(`${BASE_URL}/post-data/${id}`, { headers })
            return response.data

        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    updatePost: async (id, data) => {
        console.log(id, data);

        const formData = new FormData();

        // Append all text fields
        formData.append('description', data?.description || '');
        formData.append('chooseType', data?.chooseType || '');
        formData.append('locution', data?.locution || '');
        formData.append('locutionkm', data?.locutionkm || '');
        formData.append('status', data?.status || '');
        formData.append('latCoordinage', data?.latCoordinage || '');
        formData.append('langCoordinagee', data?.langCoordinagee || '');

        if (data?.chooseType === 'Business' || data?.chooseType === 'Mandir') {
            formData.append('chooseTypeId', data?.chooseTypeId || '');
        }

        // Handle images - separate existing from new files
        if (Array.isArray(data?.images)) {
            data.images.forEach((image) => {
                if (image instanceof File) {
                    formData.append('files', image); // New files
                } else {
                    // Existing image paths (as string)
                    formData.append('existingImages', typeof image === 'string' ? image : image.url);
                }
            });
        } else if (data?.images) {
            if (data.images instanceof File) {
                formData.append('files', data.images);
            } else {
                formData.append('existingImages', typeof data.images === 'string' ? data.images : data.images.url);
            }
        }

        const token = sessionStorage.getItem('user_token');

        try {
            const response = await axios.put(
                `${BASE_URL}/post-data/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        // Don't set Content-Type - let the browser set it with boundary
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating post:', error);
            toast.error(error?.response?.data?.message || 'Failed to update post');
            throw error;
        }
    },
    getPending: async () => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.get(`${BASE_URL}/post-data/get-post-approvel`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },

    approveBy: async (id, status) => {
        // console.log(id, 'ddeee')
        const data = {
            status: status.status
        }
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.put(`${BASE_URL}/post-data/approve-post/${id}`, data, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },

    postInActive: async (postId) => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.delete(`${BASE_URL}/post-data/reject-post/${postId}`, { headers })
            return response.data

        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    }




}
export default postsService
