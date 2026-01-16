import React, { useState, useEffect } from 'react';
import { MenuItem, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Select, FormControl, InputLabel } from '@mui/material';
import PaginationRounded from './pagination';
import tableStyles from '@core/styles/table.module.css'
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AnnouncementTable = ({ currentItems, GetData, itemsPerPage, setItemsPerPage, currentPage, setCurrentPage, handleShowOpen, handleEditOpen, editid, deleteAnnounce, statusStyles }) => {
  const [sortedData, setSortedData] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc'); // Default sort order is descending
  const [sortBy, setSortBy] = useState('createdAt'); // Default sort by 'createdAt'

  const { hasPermission } = useAuth();
  // console.log(GetData, "hey")
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const sortData = (data, sortBy, order) => {
    return data.sort((a, b) => {
      const dateA = new Date(a[sortBy]);
      const dateB = new Date(b[sortBy]);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  useEffect(() => {
    const sorted = sortData([...currentItems], sortBy, sortOrder);
    setSortedData(sorted);
  }, [currentItems, sortBy, sortOrder]);

  const handleSort = (column) => {
    const isAsc = sortBy === column && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(column);
  };



  // Calculate showing range for footer
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, GetData?.length);

  return (
    <div className='overflow-x-auto'>

      {/* Header with Items per Page Dropdown */}


      {/* Table */}
      <TableContainer>
        <Table className={tableStyles.table}>
          <TableHead>
            <TableRow>
              <TableCell className='p-2'>
                <TableSortLabel
                  active={sortBy === 'title'}
                  direction={sortBy === 'title' ? sortOrder : 'asc'}
                  onClick={() => handleSort('title')}
                >
                  Title
                </TableSortLabel>
              </TableCell>

              <TableCell className='p-2'>Message</TableCell>
              <TableCell className='p-2'>
                <TableSortLabel
                  active={sortBy === 'expiryDatetime'}
                  direction={sortBy === 'expiryDatetime' ? sortOrder : 'asc'}
                  onClick={() => handleSort('expiryDatetime')}
                >
                  Expiry Date
                </TableSortLabel>
              </TableCell>
              <TableCell className='p-2'>Announced By</TableCell>

              <TableCell className='p-2'>
                <TableSortLabel
                  active={sortBy === 'createdAt'}
                  direction={sortBy === 'createdAt' ? sortOrder : 'asc'}
                  onClick={() => handleSort('createdAt')}
                >
                  Announce Date
                </TableSortLabel>
              </TableCell>

              <TableCell className='p-2'>Status</TableCell>
              <TableCell className='p-2'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map(item => (
              <TableRow key={item._id} className='border-b'>
                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                  <div className='font-medium'>{item.title}</div>
                </TableCell>

                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                  <div className='font-medium'>{item.message}</div>
                </TableCell>
                <TableCell className='p-2'>
                  <div className='font-medium'>{item.expiryDatetime ? formatDate(item.expiryDatetime) : ''}</div>
                </TableCell>
                <TableCell className='p-2'>
                  <div className='font-medium'>{item?.announceBy?.firstName} {item?.announceBy?.lastName}</div>
                </TableCell>
                <TableCell className='p-2'>
                  <div className='font-medium'>{item.createdAt ? formatDate(item.createdAt) : ''}</div>
                </TableCell>
                <TableCell className='p-2'>
                  <Chip label={item.status} color={statusStyles[item.status]} variant='tonal' />
                </TableCell>
                <TableCell className='px-4 py-2 flex items-center gap-3'>
                  {hasPermission('announce:view') &&
                    <Eye className='text-gray-600 cursor-pointer hover:scale-110 transition' onClick={() => handleShowOpen(item._id)} />
                  }
                  {hasPermission('announce:edit') &&
                    <Pencil className='text-blue-500 cursor-pointer hover:scale-110 transition' onClick={() => { editid(item._id); handleEditOpen(); }} />
                  }
                  {/* <Pencil className='text-blue-500 cursor-pointer hover:scale-110 transition' onClick={() => { editid(item._id); handleEditOpen(); }} /> */}

                  {hasPermission('announce:delete') &&
                    <Trash2 className='text-red-500 cursor-pointer hover:scale-110 transition' onClick={() => deleteAnnounce(item._id)} />
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer: Pagination and Showing Info */}
      <div className='flex justify-between items-center my-4'>
        <div className='text-gray-600 text-sm ml-2'>
          Showing {startIndex} to {endIndex} of {GetData?.length} entries
        </div>
        <div className='flex justify-end'>
          <PaginationRounded
            count={Math.ceil(GetData?.length / itemsPerPage)}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
          />
        </div>
      </div>

    </div>
  );
};

export default AnnouncementTable;


