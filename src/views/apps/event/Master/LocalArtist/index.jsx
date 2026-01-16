'use client'
import React, { useEffect, useState } from 'react'
import LocalArtistTable from './LocalArtistTable'
import ArtistService from '@/services/event/masters/artistService';

function index() {

    const [data, setdata] = useState([]);
    const LocalArtistfun = async () => {
        const res = await ArtistService.getLocalArtist();
        setdata(res?.data || []);
    }

    useEffect(() => {
        LocalArtistfun();
    }, []);

    return (
        <div>
            <LocalArtistTable data={data} LocalArtistfun={LocalArtistfun} />
        </div>
    )
}

export default index
