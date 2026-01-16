import axios from "axios"
import { toast } from "react-toastify"

const BASE_URL = process.env.NEXT_PUBLIC_URL

const postsStoryService = {
    createStory: async (data) => {

        const formData = new FormData();
        formData.append('description', data?.description || '');
        formData.append('chooseType', data?.chooseType || '');
        formData.append('chooseTypeId', data?.chooseTypeId || '');
        formData.append('locution', data?.locution || '');
        formData.append('locutionkm', data?.locutionkm || '');
        formData.append('status', data?.status || '');
        formData.append('latCoordinate', data?.latCoordinage || '');
        formData.append('langCoordinate', data?.langCoordinagee || '');
        formData.append('chooseTypeModel', data?.chooseTypeModel || '');

        // Append image(s)
        if (Array.isArray(data?.images)) {
            data.images.forEach((image, index) => {
                formData.append('files', image);
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
            const response = await axios.post(`${BASE_URL}/post-data/story`, formData,
                { headers }
            );

            return response.data;
        } catch (error) {
            console.error('Error adding Keyword:', error)
            toast.error(error?.response?.data?.message)
            throw error
        }
    },


    getStory: async () => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/post-data/story`, { headers });
            return response.data;
        } catch (error) {
            console.error('Error fetching stories:', error)
            toast.error(error?.response?.data?.message)
            throw error
        }
    },
    getPenStory: async () => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/post-data/get-pending-exp-story`, { headers });
            return response.data;
        } catch (error) {
            console.error('Error fetching stories:', error)
            toast.error(error?.response?.data?.message)
            throw error
        }
    },
    deleteStory: async (id) => {

        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.delete(`${BASE_URL}/post-data/story/${id}`, { headers });
            return response.data;
        } catch (error) {
            console.error('Error deleting story:', error)
            toast.error(error?.response?.data?.message)
            throw error
        }
    },
    updateStory: async (id, data) => {

        console.log(data, 'data')
        const formData = new FormData();

        // Append all text fields
        formData.append('description', data?.description || '');
        formData.append('chooseType', data?.chooseType || '');
        formData.append('locution', data?.locution || '');
        formData.append('locutionkm', data?.locutionkm || '');
        formData.append('status', data?.status || '');
        formData.append('latCoordinate', data?.latCoordinate || '');
        formData.append('langCoordinate', data?.langCoordinate || '');

        // // Conditionally append business/mandir type
        // if (['Business', 'Mandir'].includes(data?.chooseType)) {
        formData.append('chooseTypeId', data?.chooseTypeId || '');
        // }

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
                `${BASE_URL}/post-data/story/${id}`, // ✅ Remove "story" prefix
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        // Let browser set Content-Type including boundary
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
    approveStoryBy: async (id, data) => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.put(`${BASE_URL}/post-data/story-approve/${id}`,data, { headers });
            return response.data;

        } catch (error) {
            console.error('Error deleting story:', error)
            toast.error(error?.response?.data?.message)
            throw error
        }
    }

}

export default postsStoryService
