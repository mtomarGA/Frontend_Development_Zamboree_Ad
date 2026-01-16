import axios from 'axios'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/upload`


const ImageService = {

    uploadImage: async (formData, params = {}) => {
        console.log(params, 'ssssssss')
        try {
            const response = await axios.post(`${BASE_URL}/buffer`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                params: {
                    ...params 
                }
            })
            return response.data
        } catch (error) {
            console.error('Error uploading image:', error)
            throw error
        }
    },
    uploadMultipleImage: async (formData, params = {}) => {
        console.log(params, 'ssssssss')
        try {
            const response = await axios.post(`${BASE_URL}/buffer-multiple`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                params: {
                    ...params
                }
            })
            return response.data
        } catch (error) {
            console.error('Error uploading image:', error)
            throw error
        }
    },
    deleteImage: async (imageId) => {
        console.log(imageId)
        try {
            const response = await axios.delete(`${BASE_URL}/delete`, { params: { url: imageId } })
            return response.data
        } catch (error) {
            console.error('Error deleting image:', error)
            throw error
        }
    },

    markUsed: async (imageId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/mark/${imageId}`)
            return response.data
        } catch (error) {
            console.error('Error marking image:', error)
            throw error
        }
    },
    uploadMultipleImage: async (files , params = {}) => {
        const formData = new FormData();
        // Append each file to the FormData object
        files.forEach((file, index) => {
            formData.append('images', file); // 'files' must match the field name in multer
        });

        try {
            const response = await axios.post(`${BASE_URL}/buffer-multiple`, formData, {
                // headers: {
                //     'Content-Type': 'multipart/form-data', // If using JWT
                // },
                params: params // Additional params if needed
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading images:', error);
            throw error;
        }
    }
}

export default ImageService;
