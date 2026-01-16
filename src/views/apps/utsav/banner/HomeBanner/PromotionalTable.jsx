import React, { useState } from 'react';
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
} from '@mui/material';
import { Pencil, Trash2 } from 'lucide-react';
import tableStyles from '@core/styles/table.module.css';
import EditModal from './EditModal';
import { toast } from 'react-toastify';
import PaginationRounded from '../../master/pagination';
import HomeBannerRoute from '@/services/utsav/banner/HomeBannerServices';
import { useAuth } from '@/contexts/AuthContext';


const statusStyles = {
    ACTIVE: 'success',
    PENDING: 'error'
}

function PromotionalTable({ handleClickOpen, getdata, PromotionalData }) {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const { hasPermission } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [orderBy, setOrderBy] = useState('bannerId');
    const [order, setOrder] = useState('asc');

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortComparator = (a, b) => {
        const aValue = a?.[orderBy]?.name || a?.[orderBy];
        const bValue = b?.[orderBy]?.name || b?.[orderBy];

        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
    };

    const sortedData = [...PromotionalData].sort(sortComparator);

    const paginatedData = sortedData
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const deleteData = async (id) => {
        const response = await HomeBannerRoute.deleteData(id);
        getdata();
        toast.success("Home Banner Deleted Successfully");
    };

    const handleEditOpen = (item) => {
        setEditModalOpen(true);
        setSelectedId(item);
    };

    const handleEditClose = () => setEditModalOpen(false);

    const headers = [
        { id: 'bannerId', label: 'ID' },
        { id: 'mobBanner', label: 'App Banner' },
        { id: 'webBanner', label: 'Web Banner' },

        // { id: 'state', label: 'State' },
        { id: 'city', label: 'City' },
        // { id: 'area', label: 'Area' },
        { id: 'status', label: 'Status' }
    ];

    return (
        <>
            <EditModal Editopen={editModalOpen} getdata={getdata} handleEditClose={handleEditClose} selectedId={selectedId} />

            <TableContainer className='shadow p-4 overflow-auto'>
                <div className='flex justify-between my-2'>
                    <h3>Home Banners</h3>

                    {hasPermission("utsav_banner:add") &&
                        <Button variant='contained' onClick={handleClickOpen}>Add Home Banner</Button>
                    }
                </div>
                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            {headers.map((header) => (
                                <TableCell key={header.id} className='p-2'>
                                    <TableSortLabel
                                        active={orderBy === header.id}
                                        direction={orderBy === header.id ? order : 'asc'}
                                        onClick={() => handleRequestSort(header.id)}
                                    >
                                        {header.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            <TableCell className='p-2'>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((item, index) => (
                            <TableRow key={index} className='border-b'>
                                <TableCell className='p-2'>{item.bannerId}</TableCell>
                                <TableCell className='p-2'>
                                    <Avatar src={item?.mobBanner} alt='' />
                                </TableCell>
                                <TableCell className='p-2'>
                                    <Avatar src={item?.webBanner} alt='' />
                                </TableCell>

                               
                                <TableCell className='p-2'>{item?.city}</TableCell>
                                {/* <TableCell className='p-2'>{item.area?.name}</TableCell> */}
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                                    <Chip label={item.status} color={statusStyles[item.status]} variant='tonal' />
                                </TableCell>
                                <TableCell className='p-2'>
                                    {hasPermission("utsav_banner:edit") &&
                                        <Pencil
                                            onClick={() => handleEditOpen(item)}
                                            className='text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                        />
                                    }


                                    {hasPermission("utsav_banner:delete") &&
                                        <Trash2
                                            onClick={() => deleteData(item._id)}
                                            className='text-red-600 size-5 cursor-pointer hover:scale-110 transition'
                                        />
                                    }
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
    );
}

export default PromotionalTable;
