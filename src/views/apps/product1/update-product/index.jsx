'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Rating from '@mui/material/Rating'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
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

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { Box, CardContent, IconButton, TextField } from '@mui/material'
import { toast } from 'react-toastify'
import manageBusinessService from '@/services/business/manageBusiness.service'
import { useAuth } from '@/contexts/AuthContext'
import countryService from '@/services/location/country.services'
import stateService from '@/services/location/state.services'
import cityService from '@/services/location/city.service'
import areaService from '@/services/location/area.services'

const fuzzyFilter = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)

    // Store the itemRank info
    addMeta({
        itemRank
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
    // States
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Column Definitions
const columnHelper = createColumnHelper()

const UpdateProductTable = ({ reviewsData }) => {
    const router = useRouter()
    const { hasPermission } = useAuth()
    const [phone, setPhone] = useState("")
    const [rowSelection, setRowSelection] = useState({})
    const [allData, setAllData] = useState([])
    const [data, setData] = useState(allData)
    const [globalFilter, setGlobalFilter] = useState('')
    const [countryList, setCountryList] = useState([])
    const [stateList, setStateList] = useState([])
    const [cityList, setCityList] = useState([])
    const [areaList, setAreaList] = useState([])
    const [textSearch, setTextSearch] = useState('')


    const [selectedCountry, setSelectedCountry] = useState('')
    const [selectedState, setSelectedState] = useState('')
    const [selectedCity, setSelectedCity] = useState('')
    const [selectedArea, setSelectedArea] = useState('')

    const productStatusObj = {
        APPROVED: { title: 'APPROVED', color: 'success' },
        PENDING: { title: 'PENDING', color: 'warning' },
        REJECTED: { title: 'REJECTED', color: 'error' },
    }

    const handleTextSearchChange = async (e) => {
        const value = e.target.value;
        setTextSearch(value);

        if (!value || value == '') {
            setAllData([]);
            setData([]);
            return;
        }

        try {
            const res = await manageBusinessService.getBusinessByLocation(value);
            if (res?.data?.length > 0) {
                setAllData(res.data);
                setData(res.data);
            } else {
                setAllData([]);
                setData([]);
                toast.info("No businesses found for this search");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
            // toast.error(errorMessage);
        }
    };

    const handleEditListing = id => {
        router.push(`/en/apps/product1/add-product/${id}`)
    }

    const columns = useMemo(
        () => [
            columnHelper.accessor('vendorId', {
                header: 'Vendor Id',
                cell: ({ row }) => (
                    <div className='flex items-center gap-4'>
                        <div className='flex flex-col items-start'>
                            <Typography variant='body2'>{row.original.vendorId}</Typography>
                        </div>
                    </div>
                )
            }),
            columnHelper.accessor('businessName', {
                header: 'Business Name',
                cell: ({ row }) => (
                    <div className='flex items-center gap-4'>
                        <div className='flex flex-col items-start'>
                            <Typography variant='body2'>{row.original?.companyInfo?.companyName}</Typography>
                        </div>
                    </div>
                )
            }),
            columnHelper.accessor('phoneNo', {
                header: 'Mobile',
                cell: ({ row }) => (
                    <div className='flex items-center gap-4'>
                        <div className='flex flex-col items-start'>
                            <Typography variant='body2'>{row.original?.contactInfo?.phoneNo}</Typography>
                        </div>
                    </div>
                )
            }),
            columnHelper.accessor('city', {
                header: 'City',
                cell: ({ row }) => (
                    <div className='flex items-center gap-4'>
                        <div className='flex flex-col items-start'>
                            <Typography variant='body2'>{row.original.locationInfo?.city}</Typography>
                        </div>
                    </div>
                )
            }),
            columnHelper.accessor('area', {
                header: 'Area',
                cell: ({ row }) => (
                    <div className='flex items-center gap-4'>
                        <div className='flex flex-col items-start'>
                            <Typography variant='body2'>{row.original.locationInfo?.area} </Typography>
                        </div>
                    </div>
                )
            }),
            columnHelper.accessor('actions', {
                header: 'Actions',
                cell: ({ row }) =>
                    hasPermission("product_add_update:view") ? (
                        <div className='flex items-center'>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={() => handleEditListing(row.original._id)}
                            >
                                Manage Products
                            </Button>
                        </div>
                    ) : null,
                enableSorting: false
            })

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
        enableRowSelection: true,
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

    return (
        <>
            <Card>
                <CardContent>
                    <Typography variant='h4' gutterBottom align='center' className='py-4'>
                        Search Vendors
                    </Typography>

                    <Grid container spacing={2} justifyContent='center'>
                        <Grid item xs={12} md={4}>
                            <CustomTextField
                                fullWidth
                                label='Search business by location OR phone number'
                                value={textSearch}
                                variant='outlined'
                                onChange={handleTextSearchChange}
                                placeholder='Type location or phone number'
                            />
                        </Grid>
                    </Grid>
                </CardContent>

                <div className='overflow-x-auto py-5'>
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
        </>
    )
}

export default UpdateProductTable
