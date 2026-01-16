import React, { useState } from 'react'
import {
    TableRow,
    Table,
    TableContainer,
    TableHead,
    TableCell,
    TableSortLabel,
    TableBody,
    Button,
    Avatar,
    Chip
} from '@mui/material'
import { CloudLightning, Pencil, Trash2 } from 'lucide-react'
import tableStyles from '@core/styles/table.module.css'
import EditModal from './EditModal'
import BannerRoute from '@/services/utsav/banner/bannerServices'
import { toast } from 'react-toastify'
import { get } from 'react-hook-form'
import PaginationRounded from '../master/pagination'
import { useAuth } from '@/contexts/AuthContext'



const statusStyles = {
    ACTIVE: 'success',
    PENDING: 'error'
}
function PromotionalTable({ handleClickOpen, getdata, PromotionalData }) {
    const [EditData, setEditData] = useState({
        category: '',
        validity: '',
        BusinessId: '',
        country: '',
        state: '',
        city: '',
        area: '',
        status: 'ACTIVE',
        latitude: null,
        longitude: null
    })
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [selectedId, setSelectedId] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [order, setOrder] = useState('asc')
    const [orderBy, setOrderBy] = useState('bannerId')

    const { hasPermission } = useAuth();
    const itemsPerPage = 10

    // Sorting function
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    // Sort data
    const sortedData = [...PromotionalData].sort((a, b) => {
        // Handle nested properties
        const getValue = (obj, prop) => {
            if (prop.includes('.')) {
                const [first, second] = prop.split('.')
                return obj[first]?.[second] || ''
            }
            return obj[prop] || ''
        }

        const aValue = getValue(a, orderBy)
        const bValue = getValue(b, orderBy)

        if (aValue < bValue) {
            return order === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
            return order === 'asc' ? 1 : -1
        }
        return 0
    })

    // Paginate sorted data
    const paginatedData = sortedData
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const deleteData = async (id) => {
        const response = await BannerRoute.deleteData(id)
        getdata();
        console.log(response, "ss")
        toast.success(response?.message)
    }

    const handleEditOpen = (id) => {
        setEditModalOpen(true)
        setSelectedId(id)
    }

    const handleEditClose = () => {
        setEditModalOpen(false)
    }

    return (
        <>
            <EditModal Editopen={editModalOpen} getdata={getdata} handleEditClose={handleEditClose} selectedId={selectedId} />

            <TableContainer className='shadow p-4 overflow-auto'>
                <div className='flex justify-between m-2 mx-4'>
                    <div>
                        <h3>Promotional Banners</h3>
                    </div>
                    <div>

                        {hasPermission("utsav_promotional_banner:add") && (<Button variant='contained' onClick={handleClickOpen}>Add Promotional Banner</Button>)
                        }

                    </div>
                </div>
                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'bannerId'}
                                    direction={orderBy === 'bannerId' ? order : 'asc'}
                                    onClick={() => handleRequestSort('bannerId')}
                                >
                                    ID
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'mobBanner'}
                                    direction={orderBy === 'mobBanner' ? order : 'asc'}
                                    onClick={() => handleRequestSort('mobBanner')}
                                >
                                    App Banner
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'webBanner'}
                                    direction={orderBy === 'webBanner' ? order : 'asc'}
                                    onClick={() => handleRequestSort('webBanner')}
                                >
                                    Web Banner
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'category'}
                                    direction={orderBy === 'category' ? order : 'asc'}
                                    onClick={() => handleRequestSort('category')}
                                >
                                    Category
                                </TableSortLabel>
                            </TableCell>
                            {/* <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'state.name'}
                                    direction={orderBy === 'state.name' ? order : 'asc'}
                                    onClick={() => handleRequestSort('state.name')}
                                >
                                    State
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'city.name'}
                                    direction={orderBy === 'city.name' ? order : 'asc'}
                                    onClick={() => handleRequestSort('city.name')}
                                >
                                    City
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'area.name'}
                                    direction={orderBy === 'area.name' ? order : 'asc'}
                                    onClick={() => handleRequestSort('area.name')}
                                >
                                    Area
                                </TableSortLabel>
                            </TableCell> */}
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'longitude'}
                                    direction={orderBy === 'longitude' ? order : 'asc'}
                                    onClick={() => handleRequestSort('longitude')}
                                >
                                    Longitude
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'latitude'}
                                    direction={orderBy === 'latitude' ? order : 'asc'}
                                    onClick={() => handleRequestSort('latitude')}
                                >
                                    Latitude
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'status'}
                                    direction={orderBy === 'status' ? order : 'asc'}
                                    onClick={() => handleRequestSort('status')}
                                >
                                    Status
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((item, index) => (

                            <TableRow key={index} className='border-b'>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                    <div className='font-medium'>{item.bannerId}</div>
                                </TableCell>
                                <TableCell className='p-2'>
                                    <Avatar src={item.mobBanner} alt='' />
                                </TableCell>
                                <TableCell className='p-2'>
                                    <Avatar src={item.webBanner} alt='' />
                                </TableCell>
                                <TableCell className='p-2'><div className='font-medium'>{item?.category?.categoryname}</div></TableCell>
                                {/* <TableCell className='p-2'><div className='font-medium'>{item.state?.name}</div></TableCell> */}
                                {/* <TableCell className='p-2'><div className='font-medium'>{item.city?.name}</div></TableCell> */}
                                {/* <TableCell className='p-2'><div className='font-medium'>{item.area?.name}</div></TableCell> */}
                                <TableCell className='p-2'><div className='font-medium'>{item?.longitude}</div></TableCell>
                                <TableCell className='p-2'><div className='font-medium'>{item?.latitude}</div></TableCell>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                                    <Chip label={item.status} color={statusStyles[item.status]} variant='tonal' />
                                </TableCell>
                                <TableCell className='p-2'>
                                    {hasPermission("utsav_promotional_banner:edit") && (
                                        <Pencil
                                            onClick={() => handleEditOpen(item._id)}
                                            className='text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                        />)
                                    }


                                    {hasPermission("utsav_promotional_banner:delete") && (<Trash2
                                        className='text-red-600 size-5 cursor-pointer hover:scale-110 transition'
                                        onClick={() => deleteData(item._id)}
                                    />)}

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className='flex justify-between items-center m-4'>
                    <div className='text-sm text-gray-600'>
                        Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, PromotionalData.length)} of {PromotionalData.length} entries
                    </div>
                    <PaginationRounded
                        count={Math.ceil(PromotionalData.length / itemsPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                    />
                </div>
            </TableContainer>
        </>
    )
}

export default PromotionalTable
