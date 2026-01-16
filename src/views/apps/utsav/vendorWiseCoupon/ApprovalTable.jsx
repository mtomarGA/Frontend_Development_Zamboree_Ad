'use client'
import React, { useEffect, useState } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Chip, Button } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'


// MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import CouponRoute from '@/services/utsav/managecoupon/manage'
import PaginationRounded from '../master/pagination'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import Link from '@/components/Link'

import AllTableAprovaldata from './AllTable'
import AllActive from './AllActive'
import PendingTable from './PendingTable'
import ExpiredTable from './ExpiredTable'
import RejectedTable from './RejectedTable'

import Grid from '@mui/material/Grid2'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
const statusStyles = {
    ACTIVE: 'success',
    PENDING: 'warning',
    REJECTED: 'error'
}


function ApprovalTable() {
    // States
    const [value, setValue] = useState('1')

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const [coupondata, setcoupondata] = useState([]);


    // fetch coupon

    const getcoupon = async () => {

        const response = await CouponRoute.getCoupon();
        // console.log(response.data);
        setcoupondata(response.data);

    }

    useEffect(() => {
        getcoupon()
    }, []);


    const ActiveCoupon = coupondata.filter(coupon => coupon.status === 'ACTIVE');
    const PendingCoupon = coupondata.filter(coupon => coupon.status === 'PENDING');
    const ExpiredCoupon = coupondata.filter(coupon => coupon.status === 'EXPIRED');
    const RejectedCoupon = coupondata.filter(coupon => coupon.status === 'REJECTED');


    return (
        <>



            <TabContext value={value}>
                <TabList onChange={handleChange} aria-label='nav tabs example'>
                    <Tab value='1' component='a' label='All' href='/drafts' onClick={e => e.preventDefault()} />
                    <Tab value='2' component='a' label='Active' href='/trash' onClick={e => e.preventDefault()} />
                    <Tab value='3' component='a' label='Pending' href='/spam' onClick={e => e.preventDefault()} />
                    <Tab value='4' component='a' label='Expired' href='/spam' onClick={e => e.preventDefault()} />
                    <Tab value='5' component='a' label='Rejected' href='/spam' onClick={e => e.preventDefault()} />
                </TabList>
                <TabPanel value='1'>


                    <AllTableAprovaldata statusStyles={statusStyles} coupondata={coupondata} setcoupondata={setcoupondata} getcoupon={getcoupon} />

                </TabPanel>
                <TabPanel value='2'>

                    <AllActive statusStyles={statusStyles} coupondata={ActiveCoupon} />

                </TabPanel>
                <TabPanel value='3'>

                    <PendingTable statusStyles={statusStyles} coupondata={PendingCoupon} />

                </TabPanel>
                <TabPanel value='4'>
                    <ExpiredTable statusStyles={statusStyles} coupondata={ExpiredCoupon} />

                </TabPanel>
                <TabPanel value='5'>

                    <RejectedTable statusStyles={statusStyles} coupondata={RejectedCoupon} />

                </TabPanel>
            </TabContext>



        </>
    )
}

export default ApprovalTable
