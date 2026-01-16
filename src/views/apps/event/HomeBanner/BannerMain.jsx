'use client'
import React, { useEffect, useState } from 'react'
import BannerTable from './BannerTable'
import AddModal from './AddModal'
import { useBannerContext } from '@/services/event/Banner/BannerService'




function BannerMain() {

    const {
        AddBanner,

        // event search

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
        // fetch banner , data is the state where Banner stores
        FetchBanner,
        data,
        // Edit Api
        EditBanner,
        DeleteBanner,
        imageLoading
    } = useBannerContext();

    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)






    // useEffect(() => { EventSearch() }, [])
    return (
        <div>
            {/* <button onClick={EventSearch}>click</button> */}
            <AddModal
                open={open} handleClose={handleClose}
                handleClickOpen={handleClickOpen}
                // Add Api
                AddBanner={AddBanner}

                // search event
                event={event} setevent={setevent}
                inputValueArtist={inputValueArtist}
                setInputValueArtist={setInputValueArtist}
                setsearch={setsearch} search={search}
                // fromError
                validateFields={validateFields}
                formErrors={formErrors}
                setFormErrors={setFormErrors}

                // image Name and onchange for image
                imageName={imageName}
                setImageName={setImageName}
                onchangeimage={onchangeimage}
                // add state
                Adddata={Adddata}
                setAdddata={setAdddata}

                // fetch banner 
                FetchBanner={FetchBanner}
                data={data}
                imageLoading={imageLoading}
            />


            <BannerTable handleClickOpen={handleClickOpen}
                // Event search
                event={event}
                setevent={event}
                inputValueArtist={inputValueArtist}
                setInputValueArtist={setInputValueArtist}
                setsearch={setsearch}
                search={search}

                // fromError
                validateFields={validateFields}
                formErrors={formErrors}
                setFormErrors={setFormErrors}

                // image Name and onchange for image
                imageName={imageName}
                setImageName={setImageName}
                onchangeimage={onchangeimage}
                // add state
                Adddata={Adddata}
                setAdddata={setAdddata}
                // fetch banner 
                FetchBanner={FetchBanner}
                data={data}
                // Edit Api fun
                EditBanner={EditBanner}
                DeleteBanner={DeleteBanner}
                imageLoading={imageLoading}

            />
        </div>
    )
}

export default BannerMain
