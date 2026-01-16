'use client'

import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { createContext } from "react"
const BASE_URL = process.env.NEXT_PUBLIC_URL;
import Image from "@/services/imageService"




const BannerContext = createContext();

export function BannerProvider({ children }) {
    const [Adddata, setAdddata] = useState({});
    const [data, setdata] = useState([]);

    // Event Search 
    const [event, setevent] = useState([])
    const [inputValueArtist, setInputValueArtist] = useState('');
    const [search, setsearch] = useState('');
    useEffect(() => {
        if (search.length >= 3) {
            const EventFun = async () => {
                const res = await EventSearch(search);
                setevent(res?.data || []);
            }
            EventFun()
        }
        else {
            setevent([])
        }
    }, [search])



    // form Errors
    const [formErrors, setFormErrors] = useState({})
    const validateFields = (data) => {
        let errors = {}
        if (!data.event) errors.event = 'Event is required'
        if (!data.webBanner) errors.webBanner = 'webBanner Image is required'
        if (!data.mobBanner) errors.mobBanner = 'mobBanner Image is required'
        return errors
    }


    // Image Upload and Image Name
    const [imageName, setImageName] = useState({
        webBanner: '',
        mobBanner: ''
    });

    const [imageLoading, setImageLoading] = useState({ webBanner: false, mobBanner: false });
    const onchangeimage = async (e) => {
        const { name, files } = e.target;
        const file = files?.[0];

        if (!file) return;

        setImageName(prev => ({
            ...prev,
            [name]: file.name   // update either webBanner or mobBanner
        }));
        setImageLoading(prev => ({ ...prev, [name]: true }));

        const result = await Image.uploadImage({ image: file });
        if (result.data?.url) {
            setAdddata(prev => ({
                ...prev,
                [name]: result.data.url
            }));
            setImageLoading(prev => ({ ...prev, [name]: false }));
            if (formErrors[name]) {
                setFormErrors(prev => ({ ...prev, [name]: '' }));
            }
        }
    };




    // Api call
    const EventSearch = async (data) => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post(`${BASE_URL}/event-management/Event-search`, { searchinput: data }, { headers });

            return response.data;
        } catch (error) {
            return error;
        }
    }

    const AddBanner = async (data) => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post(`${BASE_URL}/event-management/banner`, data, { headers });

            return response.data;
        } catch (error) {
            return error;
        }
    }

    const GetBanner = async (data) => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.get(`${BASE_URL}/event-management/banner`, { headers });
            return response.data;
        } catch (error) {
            return error;
        }
    }



    const EditBanner = async (id, data) => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.put(`${BASE_URL}/event-management/banner/${id}`, data, { headers });
            return response.data;
        } catch (error) {
            return error;
        }
    }

    const DeleteBanner = async (id) => {
        const token = sessionStorage.getItem("user_token");
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.delete(`${BASE_URL}/event-management/banner/${id}`, { headers });
            return response.data;
        } catch (error) {
            return error;
        }
    }





    const FetchBanner = async () => {
        const res = await GetBanner();
        setdata(res?.data || []);
    }

    useEffect(() => { FetchBanner() }, [])

    const props = {
        // add Banner Api
        AddBanner,

        // search event
        event,
        setevent,
        inputValueArtist,
        setInputValueArtist,
        setsearch,
        search,

        // fromError
        validateFields,
        formErrors,
        setFormErrors,

        // image Name and onchange for image
        imageName,
        setImageName,
        onchangeimage,
        // add state
        Adddata,
        setAdddata,
        // Get Banner fun
        FetchBanner,
        data,
        // Edit Fun Api
        EditBanner,
        DeleteBanner,
        imageLoading

    }

    return (
        <BannerContext.Provider value={props}>
            {children}
        </BannerContext.Provider>
    )
}

export const useBannerContext = () => useContext(BannerContext) 
