'use client'
import React, { useEffect, useState } from 'react'
import PackageTable from './packageTable'
import AddModal from './AddModel'
import ListingPackage from '@/services/listingPackage/PackageService'

function index() {
    const [open, setOpen] = useState(false)


    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)



    const [packages, setPackages] = useState([]);
    const GetPackageFun = async () => {
        const data = await ListingPackage.get();
        setPackages(data.data);
    }

    useEffect(() => {
        GetPackageFun();
    }, []);

    return (
        <div>
            <AddModal open={open} handleClose={handleClose} GetPackageFun={GetPackageFun} />
            <PackageTable handleClickOpen={handleClickOpen} GetPackageFun={GetPackageFun} packages={packages} />
        </div>
    )
}

export default index

// import React from 'react'
// import PackageTable from './packageTable'

// function index() {
//     return (
//         <div>index


//             <PackageTable />
//         </div>
//     )
// }

// export default index
