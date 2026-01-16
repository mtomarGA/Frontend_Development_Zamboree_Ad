

'use client'
import React, { useEffect, useState } from 'react'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import { useParams } from 'next/navigation'
import VendorWiseCouponRoute from '@/services/utsav/managecoupon/vendor.services'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Chip, Button } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../master/pagination'
import Link from '@/components/Link'
import { Pencil } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const statusStyles = {
    ACTIVE: 'success',
    // EXPIRED: 'error',
    PENDING: 'warning',
    REJECTED: 'error'

}

function Allcoupon() {
    const [Activecoupondata, setActivecoupondata] = useState([]);
    const [Pendingcoupondata, setPendingcoupondata] = useState([]);
    const [Expiredcoupondata, setExpiredcoupondata] = useState([]);
    const [Rejectedcoupondata, setRejectedcoupondata] = useState([]);
    const [value, setValue] = useState('1');



    // Sorting states for each tab
    const [sortConfig, setSortConfig] = useState({
        active: { field: 'title', direction: 'asc' },
        pending: { field: 'title', direction: 'asc' },
        expired: { field: 'title', direction: 'asc' },
        rejected: { field: 'title', direction: 'asc' }
    });

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setValue(newValue);
    }

    // Pagination states
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPage1, setCurrentPage1] = useState(1);
    const [currentPage2, setCurrentPage2] = useState(1);
    const [currentPage3, setCurrentPage3] = useState(1);
    const itemsPerPage = 10;


    const BusinessId = useParams();

    // Sort function
    const sortData = (data, field, direction) => {
        return [...data].sort((a, b) => {
            if (a[field] < b[field]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[field] > b[field]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    // Handle sort request
    const handleSort = (tab, field) => {
        setSortConfig(prev => {
            const current = prev[tab];
            return {
                ...prev,
                [tab]: {
                    field,
                    direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
                }
            };
        });
    };

    // Get sorted and paginated data for each tab
    const getProcessedData = (data, tab) => {
        const { field, direction } = sortConfig[tab];
        const sorted = sortData(data, field, direction);
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sorted.slice(startIndex, startIndex + itemsPerPage);
    };

    // Active tab data
    const activeData = getProcessedData(Activecoupondata, 'active');
    // Pending tab data
    const pendingData = getProcessedData(Pendingcoupondata, 'pending');
    // Expired tab data
    const expiredData = getProcessedData(Expiredcoupondata, 'expired');
    // Rejected tab data
    const rejectedData = getProcessedData(Rejectedcoupondata, 'rejected');



    const { hasPermission } = useAuth();




    // Fetch data functions
    const getActive = async () => {
        const ActiveCoupons = await VendorWiseCouponRoute.getActiveCoupons(BusinessId.id);

        setActivecoupondata(ActiveCoupons.data);
    }

    const getPending = async () => {
        const pendingcoupon = await VendorWiseCouponRoute.getPendingCoupons(BusinessId.id);

        setPendingcoupondata(pendingcoupon.data);
    }

    const getExpireCoupon = async () => {
        const expired = await VendorWiseCouponRoute.getExpiredCoupons(BusinessId.id);
        setExpiredcoupondata(expired.data);
    }

    const getRejectCoupon = async () => {
        const rejected = await VendorWiseCouponRoute.getRejectedCoupons(BusinessId.id);
        setRejectedcoupondata(rejected.data);
    }

    useEffect(() => {
        getActive();
    }, []);

    return (
        <>

            {/* vendor wise all coupons table */}
            <div>
                <h2 className='text-center'>Vendor Wise All Coupons</h2>
            </div>

            <TabContext value={value}>
                <TabList onChange={handleChange} aria-label='nav tabs example'>
                    <Tab value='1' component='a' label='Active' href='/drafts' onClick={e => e.preventDefault()} />
                    <Tab value='2' component='a' label='Pending' href='/trash' onClick={e => { e.preventDefault(); getPending(); }} />
                    <Tab value='3' component='a' label='Expired' onClick={e => { e.preventDefault(); getExpireCoupon(); }} href='/spam' />
                    <Tab value='4' component='a' label='Rejected' onClick={e => { e.preventDefault(); getRejectCoupon(); }} href='/spam' />
                </TabList>

                {/* Active Tab */}

                {/* Active Tab */}
                <TabPanel value='1'>

                    <TableContainer className='shadow p-4'>
                        <Table className={tableStyles.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell className='p-2'>
                                        <TableSortLabel
                                            active={sortConfig.active.field === 'title'}
                                            direction={sortConfig.active.direction}
                                            onClick={() => handleSort('active', 'title')}
                                        >
                                            Title
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='p-2'>
                                        <TableSortLabel
                                            active={sortConfig.active.field === 'category'}
                                            direction={sortConfig.active.direction}
                                            onClick={() => handleSort('active', 'category')}
                                        >
                                            Category
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='p-2'>
                                        <TableSortLabel
                                            active={sortConfig.active.field === 'couponId'}
                                            direction={sortConfig.active.direction}
                                            onClick={() => handleSort('active', 'couponId')}
                                        >
                                            Coupon ID
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='p-2'>
                                        <TableSortLabel
                                            active={sortConfig.active.field === 'totaluserAvail'}
                                            direction={sortConfig.active.direction}
                                            onClick={() => handleSort('active', 'totaluserAvail')}
                                        >
                                            Total Coupons
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='p-2'>
                                        <TableSortLabel
                                            active={sortConfig.active.field === 'usedCoupon'}
                                            direction={sortConfig.active.direction}
                                            onClick={() => handleSort('active', 'usedCoupon')}
                                        >
                                            Total Redeem
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='p-2'>Status</TableCell>
                                    <TableCell className='p-2'>Redeem</TableCell>
                                    <TableCell className='p-2'>History</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {activeData.map((item, index) => (
                                    <TableRow key={index} className='border-b'>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <div className='font-medium'>{item?.title}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <div className='font-medium'>{item?.category?.categoryname}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <div className='font-medium'>{item?.couponId}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <div className='font-medium'>{item?.totaluserAvail}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <div className='font-medium'>{item?.usedCoupon}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <Chip label={item.status} color={statusStyles[item?.status]} variant='tonal' />
                                        </TableCell>
                                        <TableCell className='p-2'>

                                            <Link href={`/apps/utsav/managecoupon/redeemhistory/${item._id}`} passHref>
                                                <Button size='small' variant='tonal'>Redeem</Button>
                                            </Link>

                                        </TableCell>
                                        <TableCell className='p-2'>
                                            {hasPermission('utsav_vendor_wise_utsav:view') &&
                                                <Link href={`/apps/utsav/managecoupon/couponhistory/${item._id}`} passHref>
                                                    <Button variant='contained' size='small'>History</Button>
                                                </Link>
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className='flex justify-between items-center m-4'>
                            <div className='text-sm text-gray-600'>
                                Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, Activecoupondata.length)} of {Activecoupondata.length} entries
                            </div>
                            <PaginationRounded
                                count={Math.ceil(Activecoupondata.length / itemsPerPage)}
                                page={currentPage}
                                onChange={(event, value) => setCurrentPage(value)}
                            />
                        </div>
                    </TableContainer>


                </TabPanel>


                {/* Pending Tab */}
                <TabPanel value='2'>

                    <TableContainer className='shadow p-4'>
                        <Table className={tableStyles.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell className='p-2'>
                                        <TableSortLabel
                                            active={sortConfig.pending.field === 'title'}
                                            direction={sortConfig.pending.direction}
                                            onClick={() => handleSort('pending', 'title')}
                                        >
                                            Title
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='p-2'>
                                        <TableSortLabel
                                            active={sortConfig.pending.field === 'category'}
                                            direction={sortConfig.pending.direction}
                                            onClick={() => handleSort('pending', 'category')}
                                        >
                                            Category
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='p-2'>
                                        <TableSortLabel
                                            active={sortConfig.pending.field === 'couponId'}
                                            direction={sortConfig.pending.direction}
                                            onClick={() => handleSort('pending', 'couponId')}
                                        >
                                            Coupon ID
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='p-2'>
                                        <TableSortLabel
                                            active={sortConfig.pending.field === 'totaluserAvail'}
                                            direction={sortConfig.pending.direction}
                                            onClick={() => handleSort('pending', 'totaluserAvail')}
                                        >
                                            Total Coupons
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='p-2'>
                                        <TableSortLabel
                                            active={sortConfig.pending.field === 'usedCoupon'}
                                            direction={sortConfig.pending.direction}
                                            onClick={() => handleSort('pending', 'usedCoupon')}
                                        >
                                            Total Redeem
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='p-2'>Status</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {pendingData.map((item, index) => (
                                    <TableRow key={index} className='border-b'>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <div className='font-medium'>{item?.title}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <div className='font-medium'>{item?.category?.categoryname}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <div className='font-medium'>{item?.couponId}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <div className='font-medium'>{item?.totaluserAvail}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <div className='font-medium'>{item?.usedCoupon}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <Chip label={item.status} color={statusStyles[item?.status]} variant='tonal' />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className='flex justify-between items-center m-4'>
                            <div className='text-sm text-gray-600'>
                                Showing {(currentPage1 - 1) * itemsPerPage + 1}–
                                {Math.min(currentPage1 * itemsPerPage, pendingData.length)} of {pendingData.length} entries
                            </div>
                            <PaginationRounded
                                count={Math.ceil(pendingData.length / itemsPerPage)}
                                page={currentPage1}
                                onChange={(event, value) => setCurrentPage1(value)}
                            />
                        </div>
                    </TableContainer>


                </TabPanel>



                {/* Expired Tab */}
                <TabPanel value='3'>

                    <TableContainer className='shadow p-4'>
                        <Table className={tableStyles.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell className='p-2'>
                                        <TableSortLabel
                                            active={sortConfig.expired.field === 'title'}
                                            direction={sortConfig.expired.direction}
                                            onClick={() => handleSort('expired', 'title')}
                                        >
                                            Title
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='p-2'>
                                        <TableSortLabel
                                            active={sortConfig.expired.field === 'category'}
                                            direction={sortConfig.expired.direction}
                                            onClick={() => handleSort('expired', 'category')}
                                        >
                                            Category
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='p-2'>
                                        <TableSortLabel
                                            active={sortConfig.expired.field === 'couponId'}
                                            direction={sortConfig.expired.direction}
                                            onClick={() => handleSort('expired', 'couponId')}
                                        >
                                            Coupon ID
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='p-2'>
                                        <TableSortLabel
                                            active={sortConfig.expired.field === 'totaluserAvail'}
                                            direction={sortConfig.expired.direction}
                                            onClick={() => handleSort('expired', 'totaluserAvail')}
                                        >
                                            Total Coupons
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='p-2'>
                                        <TableSortLabel
                                            active={sortConfig.expired.field === 'usedCoupon'}
                                            direction={sortConfig.expired.direction}
                                            onClick={() => handleSort('expired', 'usedCoupon')}
                                        >
                                            Total Redeem
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='p-2'>History</TableCell>
                                    <TableCell className='p-2'>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {expiredData.map((item, index) => (
                                    <TableRow key={index} className='border-b'>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <div className='font-medium'>{item?.title}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <div className='font-medium'>{item?.category?.categoryname}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <div className='font-medium'>{item?.couponId}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <div className='font-medium'>{item?.totaluserAvail}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <div className='font-medium'>{item?.usedCoupon}</div>
                                        </TableCell>
                                        <TableCell className='p-2'>
                                            {hasPermission('utsav_vendor_wise_utsav:view') &&
                                                <Link href={`/en/apps/utsav/managecoupon/couponhistory/${item._id}`} passHref>
                                                    <Button variant='contained' size='small'>History</Button>
                                                </Link>
                                            }
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <Chip label={item.status} color={statusStyles[item.status]} variant='tonal' />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className='flex justify-between items-center m-4'>
                            <div className='text-sm text-gray-600'>
                                Showing {(currentPage2 - 1) * itemsPerPage + 1}–{Math.min(currentPage2 * itemsPerPage, Expiredcoupondata.length)} of {Expiredcoupondata.length} entries
                            </div>
                            <PaginationRounded
                                count={Math.ceil(Expiredcoupondata.length / itemsPerPage)}
                                page={currentPage2}
                                onChange={(event, value) => setCurrentPage2(value)}
                            />
                        </div>
                    </TableContainer>


                </TabPanel>


                {/* Rejected Tab */}
                <TabPanel value='4'>

                    <TableContainer className='shadow p-4'>
                        <Table className={tableStyles.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell className='p-2'>
                                        <TableSortLabel
                                            active={sortConfig.rejected.field === 'title'}
                                            direction={sortConfig.rejected.direction}
                                            onClick={() => handleSort('rejected', 'title')}
                                        >
                                            Title
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='p-2'>
                                        <TableSortLabel
                                            active={sortConfig.rejected.field === 'category'}
                                            direction={sortConfig.rejected.direction}
                                            onClick={() => handleSort('rejected', 'category')}
                                        >
                                            Category
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='p-2'>
                                        <TableSortLabel
                                            active={sortConfig.rejected.field === 'couponId'}
                                            direction={sortConfig.rejected.direction}
                                            onClick={() => handleSort('rejected', 'couponId')}
                                        >
                                            Coupon ID
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='p-2'>
                                        <TableSortLabel
                                            active={sortConfig.rejected.field === 'totaluserAvail'}
                                            direction={sortConfig.rejected.direction}
                                            onClick={() => handleSort('rejected', 'totaluserAvail')}
                                        >
                                            Total Coupons
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='p-2'>
                                        <TableSortLabel
                                            active={sortConfig.rejected.field === 'usedCoupon'}
                                            direction={sortConfig.rejected.direction}
                                            onClick={() => handleSort('rejected', 'usedCoupon')}
                                        >
                                            Total Redeem
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell className='p-2'>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rejectedData.map((item, index) => (
                                    <TableRow key={index} className='border-b'>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <div className='font-medium'>{item?.title}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <div className='font-medium'>{item?.category?.categoryname}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <div className='font-medium'>{item?.couponId}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <div className='font-medium'>{item?.totaluserAvail}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <div className='font-medium'>{item?.usedCoupon}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <Chip label={item.status} color={statusStyles[item.status]} variant='tonal' />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className='flex justify-between items-center m-4'>
                            <div className='text-sm text-gray-600'>
                                Showing {(currentPage3 - 1) * itemsPerPage + 1}–{Math.min(currentPage3 * itemsPerPage, Rejectedcoupondata.length)} of {Rejectedcoupondata.length} entries
                            </div>
                            <PaginationRounded
                                count={Math.ceil(Rejectedcoupondata.length / itemsPerPage)}
                                page={currentPage3}
                                onChange={(event, value) => setCurrentPage3(value)}
                            />
                        </div>
                    </TableContainer>

                </TabPanel>
            </TabContext>
        </>
    )
}

export default Allcoupon
