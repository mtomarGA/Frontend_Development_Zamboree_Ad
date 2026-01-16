'use client'
import React, { useEffect, useState } from 'react'
import Image from '@/services/imageService';
import { Avatar, Button } from '@mui/material';
import CustomTextField from '@/@core/components/mui/TextField';
import { useParams } from 'next/navigation';
import TicketSettingService from '@/services/event/event_mgmt/TicketSettingService';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';

function Add() {

    const { id } = useParams();

    const { hasPermission } = useAuth();
    const [formErrors, setFormErrors] = useState({});
    const [Data, setData] = useState({
        Eventid: id,
        image: '',
        icon: '',
        instructions: ''
    });

    const validate = () => {
        let errors = {};
        if (!Data.image) errors.image = 'Ticket image is required';
        if (!Data.icon) errors.icon = 'Logo is required';
        if (!Data.instructions.trim()) errors.instructions = 'Instructions are required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({
            ...prev,
            [name]: value
        }));

        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = async (e) => {
        const { name, files } = e.target;
        const result = await Image.uploadImage({ image: files[0] });

        if (result.data?.url) {
            setData(prev => ({
                ...prev,
                [name]: result.data.url
            }));

            if (formErrors[name]) {
                setFormErrors(prev => ({ ...prev, [name]: '' }));
            }
        }
    };

    const handleSubmit = async () => {
        if (validate()) {
            // console.log("Data submitted:", Data);
            // Perform API call here
            const response = await TicketSettingService.Post(Data);
            // console.log("API Response:", response);
            if (response?.statusCode === 200 || response?.statusCode === 201) {
                toast.success(response?.message || 'Ticket settings updated successfully');
                return;
            }
            if (response?.response?.statusCode !== 200) {
                toast.error(response?.response?.data?.message || 'Error updating ticket settings');
            }

        }
    };


    // handle edit submit

    const handleEditSubmit = async () => {
        if (validate()) {

            const response = await TicketSettingService.putData(Data._id, Data);
            // console.log("API Response:", response);
            if (response?.statusCode === 200 || response?.statusCode === 201) {
                toast.success(response?.message || 'Ticket settings updated successfully');
                return;
            }
            if (response?.response?.statusCode !== 200) {
                toast.error(response?.response?.data?.message || 'Error updating ticket settings');
            }
        }
    }

    const getbyid = async () => {
        const response = await TicketSettingService.getbyid(id);
        if (response?.statusCode === 200) {
            setData({
                _id: response.data._id,
                Eventid: id,
                image: response.data.image || '',
                icon: response.data.icon || '',
                instructions: response.data.instructions || ''
            });
        }
    };

    useEffect(() => {
        if (id) {
            getbyid();
        }
    }, [id]);

    return (
        <div className='shadow-md  rounded-lg p-4 m-4'>
            <div className='m-2'> <h2>
                Ticket Setting Page
            </h2></div>
            <div className='flex flex-col'>


                {/* Image Upload */}
                <div className='m-2 flex flex-row gap-4 items-center'>
                    <div className='border-2 border-gray-400 w-96 p-4 rounded-md'>
                        <label htmlFor="image">Ticket Image</label>
                        <input type="file" name='image' onChange={handleImageChange} className='mx-2' id='image' />
                        {formErrors.image && <div className='text-red-600 text-sm'>{formErrors.image}</div>}
                    </div>
                    {Data.image && <Avatar src={Data.image} alt="ticket image" sx={{ mt: 2, width: 80, height: 80 }} className='rounded-md' />}
                </div>

                {/* Icon Upload */}
                <div className='m-2 flex flex-row gap-4 items-center'>
                    <div className='border-2 border-gray-400 w-96 p-4 rounded-md'>
                        <label htmlFor="icon">Ticket Logo</label>
                        <input type="file" name='icon' onChange={handleImageChange} className='mx-2' id='icon' />
                        {formErrors.icon && <div className='text-red-600 text-sm'>{formErrors.icon}</div>}
                    </div>
                    {Data.icon && <Avatar src={Data.icon} alt="logo" sx={{ mt: 2, width: 80, height: 80 }} className='rounded-md' />}
                </div>
            </div>

            {/* Instructions */}
            <div className='m-4'>
                <CustomTextField
                    fullWidth
                    name='instructions'
                    label='Instructions'
                    value={Data.instructions}
                    onChange={handleTextChange}
                    rows={8}
                    multiline
                    maxRows={Infinity}
                    placeholder='Enter Instructions'
                    variant='outlined'
                    error={!!formErrors.instructions}
                    helperText={formErrors.instructions}
                />
            </div>

            {/* Submit */}
            <div className='m-4 text-center'>
                {hasPermission('event_manageEvents:edit') && (
                    (Data?._id) && <Button variant='contained' color='primary' onClick={handleEditSubmit}>
                        Update
                    </Button>

                )}

                {hasPermission("event_manageEvents:add") && (
                    (!Data?._id) && <Button variant='contained' color='primary' onClick={handleSubmit}>
                        Create
                    </Button>

                )}
            </div>
        </div>
    );
}

export default Add;
