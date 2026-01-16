'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import { useAuth } from '@/contexts/AuthContext'
import DeleteConfirmationDialog from '../../deleteConfirmation'
import manageBusinessService from '@/services/business/manageBusiness.service'

// Third-party Imports
import classnames from 'classnames'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import tableStyles from '@core/styles/table.module.css'
import { IconButton, Tooltip } from '@mui/material'
import { toast } from 'react-toastify'
import ViewBusinessDetail from '@/components/dialogs/view-business/index.jsx'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const searchValue = value.toLowerCase();

  // Define which fields to search and their accessors
  const searchFields = [
    row.original.vendorId?.toString().toLowerCase() || '',
    row.original?.companyInfo?.companyName?.toLowerCase() || '',
    row.original?.contactInfo?.email?.toLowerCase() || '',
    row.original?.contactInfo?.phoneNo?.toString().toLowerCase() || '',
    row.original?.companyInfo?.businessCategory?.name?.toLowerCase() || '',
    row.original?.locationInfo?.city?.name?.toLowerCase() || '',
    row.original?.status?.toLowerCase() || ''
  ];

  // Check if any field contains the search value
  const passed = searchFields.some(field => field.includes(searchValue));

  addMeta({
    itemRank: passed ? 1 : 0
  });

  return passed;
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Column Definitions
const columnHelper = createColumnHelper()

const ListingApprovalTable = () => {

  const [status, setStatus] = useState('All')
  const [rowSelection, setRowSelection] = useState({})
  const [allData, setAllData] = useState([])
  const [data, setData] = useState(allData)
  const [globalFilter, setGlobalFilter] = useState('')
  const [showData, setShowData] = useState(null)
  const [open, setOpen] = useState(false)
  const { hasPermission } = useAuth()

  useEffect(() => {
    getAllBusiness();
  }, [])

  const productStatusObj = {
    APPROVED: { title: 'APPROVED', color: 'success' },
    PENDING: { title: 'PENDING', color: 'warning' },
    REJECTED: { title: 'REJECTED', color: 'error' },
  }

  const getAllBusiness = async (req, res) => {
    try {
      const response = await manageBusinessService.getAllBusiness()
      console.log(response.data, "response");
      setData(response.data)
      setAllData(response.data)
      // setGlobalFilter(response.data)

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
      toast.error(errorMessage);
    }
  }

  const handleViewBusiness = data => {
    setShowData(data)
    setOpen(true)
  }

  // Hooks
  const { lang: locale } = useParams()

  const columns = useMemo(
    () => [
      columnHelper.accessor('vendorId', {
        header: 'Partner Id',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {/* <CustomAvatar src={row.original.avatar} size={34} />  */}
            <div className='flex flex-col items-start'>
              <Typography variant='body2'>{row.original.vendorId || "N/A"}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('companyName', {
        header: 'Business Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col items-start'>
              <Typography variant='body2'>{row.original?.companyInfo?.companyName || "N/A"}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col items-start'>
              <Typography variant='body2'>{row.original?.contactInfo?.email || "N/A"}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('phoneNo', {
        header: 'Mobile',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col items-start'>
              <Typography variant='body2'>{row.original?.contactInfo?.phoneNo || "N/A"}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('views', {
        header: 'Views',
        cell: ({ row }) => {
          const views = row.original?.views || [];
          return (
            <div className='flex items-center gap-2'>
              <Typography variant='body2'>{views.length}</Typography>
            </div>
          );
        }
      }),


      columnHelper.accessor('totalCallHits', {
        header: 'Call Hits',
        cell: ({ row }) =>

        (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col items-start'>
              <Typography variant='body2'>{row.original.totalCallHits}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('keywordTotalHist', {
        header: 'Search hits',
        cell: ({ row }) =>

        (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col items-start'>
              <Typography variant='body2'>{row.original.keywordTotalHist}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('enquiryCount', {
        header: 'Enquiry Hits',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col items-start'>
              <Typography variant='body2'>{row.original?.enquiryCount}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('categoryName', {
        header: 'Category Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col items-start'>
              <Typography variant='body2'>{row.original.companyInfo?.businessCategory?.name || "N/A"} </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('city', {
        header: 'City',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col items-start'>
              <Typography variant='body2'>{row.original.locationInfo?.city || "N/A"}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('createDate', {
        header: 'Created Date',
        sortingFn: (rowA, rowB) => {
          const dateA = new Date(rowA.original.date)
          const dateB = new Date(rowB.original.date)

          return dateA.getTime() - dateB.getTime()
        },
        cell: ({ row }) => {
          const date = new Date(row.original.createdAt || "N/A").toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          })

          return <Typography>{date}</Typography>
        }
      }),
      columnHelper.accessor('lastUpdateDate', {
        header: 'Last Update Date',
        sortingFn: (rowA, rowB) => {
          const dateA = new Date(rowA.original.date)
          const dateB = new Date(rowB.original.date)

          return dateA.getTime() - dateB.getTime()
        },
        cell: ({ row }) => {
          const date = new Date(row.original.updatedAt || "N/A").toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          })
          return <Typography>{date}</Typography>
        }
      }),
      columnHelper.accessor('lastUpdateBy', {
        header: 'Last Update By',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col items-start'>
              <Typography variant="body2">
                {row.original?.updatedBy
                  ? row.original?.updatedBy?.userType === "Employee"
                    ? row.original.updatedBy.userId?.employee_id 
                    : "Admin"
                  : row.original?.companyInfo?.companyName }
              </Typography>

            </div>
          </div>
        )
      }),
      columnHelper.accessor('lastActive', {
        header: 'Last Active',
        cell: ({ row }) => {
          const date = new Date(row.original.LastActiveAt).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            // add time aslo
            hour12: true,
            hour: '2-digit',
            minute: '2-digit'
          })

          return <Typography>{row.original.LastActiveAt ? date : "N/A"}</Typography>
        }
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            label={productStatusObj[row.original.status].title}
            variant='tonal'
            color={productStatusObj[row.original.status].color}
            size='small'
          />
        )
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => {
          const [isDeleting, setIsDeleting] = useState(false);

          const deleteBusiness = async () => {
            setIsDeleting(true);
            try {
              const res = await manageBusinessService.deleteBusinss(row.original._id);
              if (res.statusCode == 200 || res.statusCode == 201) {
                toast.success('Business Deleted')
                getAllBusiness()
              } else {
                toast.error('Something Went Wrong')
              }
            } finally {
              setIsDeleting(false);
            }
          };

          return (
            <div className='flex items-center gap-1'>
              {hasPermission("partner_all_partner:edit") &&
                <IconButton onClick={() => handleViewBusiness(row.original)}>
                  <i className='tabler-eye text-blue-500' />
                </IconButton>}

              {hasPermission("partner_all_partner:delete") &&
                <DeleteConfirmationDialog
                  itemName="business"
                  onConfirm={deleteBusiness}
                  isLoading={isDeleting}
                />}
            </div>
          );
        },
        enableSorting: false
      })
      // columnHelper.accessor('actions', {
      //   header: 'Actions',
      //   cell: ({ row }) => (
      //     <div className='flex items-center'>
      //       {hasPermission("listing_all_listing:edit") &&
      //         <IconButton onClick={() => handleViewBusiness(row.original)}>
      //           <i className='tabler-eye text-blue-500' />
      //         </IconButton>}
      //       {hasPermission("listing_all_listing:delete") &&
      //         <IconButton onClick={() => handleDeleteBusiness(row.original._id)}>
      //           <i className='tabler-trash text-red-500' />
      //         </IconButton>}
      //     </div>
      //   ),
      //   enableSorting: false
      // })

    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  )

  const table = useReactTable({
    data: data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  useEffect(() => {
    //   const filteredData = allData?.filter(review => {
    //     if (status !== 'All' && review.status !== status) return false

    //     return true
    //   })

    setData(data)
  }, [status, allData, setData])

  useEffect(() => {
    const filteredData = allData?.filter(business => {
      if (status !== 'All' && business.status !== status) return false;
      return true;
    });
    setData(filteredData);
  }, [status, allData]);


  return (
    <>
      <Card>
        <div className='grid grid-cols-12 gap-4 p-6 items-center'>
          <div className='col-span-2' />  {/* Left spacer */}

          <div className='col-span-3'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search List Here'
              className='w-full'
            />
          </div>

          <div className='col-span-3'>
            <CustomTextField
              select
              fullWidth
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <MenuItem value='All'>All</MenuItem>
              <MenuItem value='PENDING'>Pending</MenuItem>
              <MenuItem value='APPROVED'>Approved</MenuItem>
              <MenuItem value='REJECTED'>Rejected</MenuItem>
            </CustomTextField>
          </div>

          <div className='col-span-2'>
            <CustomTextField
              select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              fullWidth
            >
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='25'>25</MenuItem>
              <MenuItem value='50'>50</MenuItem>
            </CustomTextField>
          </div>

          <div className='col-span-2'>
            <Button
              variant='tonal'
              fullWidth
              startIcon={<i className='tabler-upload' />}
              color='secondary'
            >
              Export
            </Button>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='tabler-chevron-up text-xl' />,
                              desc: <i className='tabler-chevron-down text-xl' />
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>
      <ViewBusinessDetail open={open} setOpen={setOpen} data={showData} />
    </>
  )
}

export default ListingApprovalTable
