'use client'

import { useEffect, useMemo, useState } from 'react'
import {
    Card,
    Divider,
    Button,
    MenuItem,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
    CardHeader,
    Chip,
    Tabs,
    Tab
} from '@mui/material'

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

import { rankItem } from '@tanstack/match-sorter-utils'
import Grid from '@mui/material/Grid2'
import classnames from 'classnames'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import TablePagination from '@mui/material/TablePagination'
import tableStyles from '@core/styles/table.module.css'
import AllBanner from '@/services/premium-listing/banner.service'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import EditPackageListing from '@/components/dialogs/premium-listing/banner-listing/master/Edit-banner-listing'
// import AddPackageListing from '@/components/dialogs/premium-listing/banner-listing/add-banner-listing'
import AddBannerListing from '@/components/dialogs/premium-listing/banner-listing/banner/banner-listings'
import BannerListingDetail from '@/components/dialogs/premium-listing/banner-listing/banner/Banner-listing-Details'
import MultiTabForm from '@/components/dialogs/premium-listing/banner-listing/banner/banner-listings'
import Banner from "@/services/premium-listing/banner.service"
import EditMultiTabForm from '@/components/dialogs/premium-listing/banner-listing/editBanner/banner-listing'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation';


const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)

    addMeta({ itemRank })

    return itemRank.passed
}
const productStatusObj = {
    PROPOSAL: { title: 'PROPOSAL', color: 'secondary' },       // light blue
    INVOICED: { title: 'INVOICED', color: 'primary' },    // blue
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

const ProposalTable = () => {
    const { hasPermission } = useAuth()
    const router = useRouter();
    const [rowSelection, setRowSelection] = useState({})
    const [data, setData] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [modalDetail, setModelDetail] = useState(false)
    const [modalMode, setModalMode] = useState('view')
    const [selectedUser, setSelectedUser] = useState(null)
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [EditModalOpen, setEditModalOpen] = useState(false)
    const [EditModalMode, setEditModalMode] = useState('edit')
    const [EditSelectedPackage, setEditSelectedPackage] = useState("")
    const [bannerId, setBannerId] = useState(null)
    const [bannerData, setBannerData] = useState()


    useEffect(() => {
        getBanner()
    }, [])

    const getBanner = async () => {
        const res = await AllBanner.getPropsal()
        console.log(res, "resssss");

        setData(res.data)
    }
    const handleDownloadInvoice = (id) => {
        router.push(`/en/apps/premium-listing/banner-listing/${id}`);
    }
    const handleDetail = async (packageId) => {


        setModelDetail(true)
        setBannerId(packageId)
    }

    const handleDelete = async (packageId) => {
        const result = await Banner.deleteBanner(packageId)
        toast.success(result.message)
        getBanner()
    }

    const filteredData = useMemo(() => {
        if (statusFilter === 'ALL') return data
        if (statusFilter === 'PROPOSAL') return data.filter(item => item.status === 'PROPOSAL')
        if (statusFilter === 'INVOICED') return data.filter(item => item.status === 'INVOICED')

        return data
    }, [data, statusFilter])



    useEffect(() => {
        setBannerData(EditSelectedPackage?._id)
    }, [EditSelectedPackage])


    const getSingleBanner = async (bannerId) => {
        const result = await Banner.getSingleBanner(bannerId);
        setBannerData(result.data || [])
    }
    useEffect(() => {
        if (EditSelectedPackage?._id) {
            const bannerId = EditSelectedPackage?._id
            getSingleBanner(bannerId);

        }
    }, [EditSelectedPackage?._id])




    const columns = useMemo(() => {
        const columnHelper = createColumnHelper()

        return [
            columnHelper.accessor('PROPOSALId', {
                header: 'PROPOSAL Id',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original?.PROPOSALId}

                    </Typography>
                )
            }),
            columnHelper.accessor('basicDetails', {
                header: 'Business Id',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original?.basicDetails?.vendorId}

                    </Typography>
                )
            }),

            columnHelper.accessor('basicDetails', {
                header: 'Business Name',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original?.basicDetails?.companyName}

                    </Typography>
                )
            }),
            columnHelper.accessor('basicDetails', {
                header: 'PACKAGE NAME',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original?.basicDetails?.bannerPackage ||
                            row.original?.basicDetails?.FixedListing || row.original?.basicDetails?.paidListingPackage}
                    </Typography>
                )
            }),


            columnHelper.accessor('basicDetails', {
                header: 'Create Date',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>

                        {dayjs(row.original?.basicDetails?.publishDate).format('DD MMM YYYY, hh:mm A')}
                    </Typography>
                )
            }),
            columnHelper.accessor('createdBy', {
                header: 'Create By',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original?.createdBy?.firstName} {row.original?.createdBy?.lastName}
                    </Typography>
                )
            }),
            columnHelper.accessor('status', {
                header: 'Status',
                cell: ({ row }) => {
                    const statusValue = row.original.status;
                    const status = statusValue ? productStatusObj[statusValue] : null;
                    if (!status) return null; // or return some default component
                    return (
                        <Chip
                            label={status.title}
                            variant='tonal'
                            color={status.color}
                            size='small'
                        />
                    )
                }
            }),

            columnHelper.accessor('actions', {
                header: 'Actions',
                cell: ({ row }) => (
                    <div className='flex items-center gap-2' >
                        <IconButton onClick={() => handleDownloadInvoice(row.original._id)}>
                            <Tooltip title="Download" placement="top-end" >
                                <i className='tabler-download gray-900 text-2xl cursor-pointer' />
                            </Tooltip>

                        </IconButton>
                        {hasPermission("premium_listing_banner_listings:view") && <IconButton onClick={() => handleDetail(row.original)}>
                            <Tooltip title="View" placement="top-end">
                                <i className='tabler-eye text-green-500 text-2xl cursor-pointer' />
                            </Tooltip>
                        </IconButton>}
                        {/* {hasPermission("premium_listing_banner_listings:edit") && <IconButton
                            onClick={() => {
                                setEditModalMode('edit')
                                setEditSelectedPackage(row.original)
                                setEditModalOpen(true)
                            }}
                            disabled={row.original.status === 'INVOICED'}
                        >
                            <Tooltip title="Edit" placement="top-end" >
                                <i className='tabler-edit text-blue-600 text-2xl cursor-pointer' />
                            </Tooltip>

                        </IconButton>} */}
                        {hasPermission("premium_listing_banner_listings:delete") && <IconButton onClick={() => handleDelete(row.original._id)}>
                            <Tooltip title="Delete" placement="top-end">
                                <i className='tabler-trash text-red-500 text-2xl cursor-pointer' />
                            </Tooltip>
                        </IconButton>}
                    </div>
                ),
                enableSorting: false
            })
        ]
    }, [])

    const table = useReactTable({
        data: filteredData,
        columns,
        filterFns: { fuzzy: fuzzyFilter },
        state: { rowSelection, globalFilter },
        initialState: { pagination: { pageSize: 10 } },
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

    const exportSelectedRows = () => {
        const selectedRows = table.getSelectedRowModel().rows

        if (selectedRows.length === 0) {
            toast.warning('No rows selected for export')
            return
        }

        const csvRows = [
            ['Id', 'Name', 'Email', 'Mobile', 'Source', 'Created At', 'Updated At', 'Status'],
            ...selectedRows.map(row => [
                row.original.id,
                `${row.original.firstName} ${row.original.lastName}`,
                row.original.email,
                row.original.phone,
                'Website',
                dayjs(row.original.createdAt).format('DD MMM YYYY, hh:mm A'),
                dayjs(row.original.updatedAt).format('DD MMM YYYY, hh:mm A'),
                row.original.status
            ])
        ]

        const csvContent = csvRows.map(e => e.join(',')).join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'selected-users.csv')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Card className='shadow-none '>

            <div className='flex flex-wrap justify-between gap-4 p-6'>
                <div className='flex flex-wrap items-center max-sm:flex-col gap-4 max-sm:is-full is-auto'>
                    <CardHeader title='Proposal' />


                </div>
                <div className='flex flex-wrap items-center max-sm:flex-col gap-4 max-sm:is-full is-auto'>
                    <DebouncedInput
                        value={globalFilter ?? ''}
                        onChange={value => setGlobalFilter(String(value))}
                        placeholder='Search User'
                        className='max-sm:is-full'
                    />
                    {/* <CardContent> */}

                    <CustomTextField
                        select
                        value={table.getState().pagination.pageSize}
                        onChange={e => table.setPageSize(Number(e.target.value))}
                        className='flex-auto is-[70px] max-sm:is-full'
                    >
                        <MenuItem value='10'>10</MenuItem>
                        <MenuItem value='25'>25</MenuItem>
                        <MenuItem value='50'>50</MenuItem>
                    </CustomTextField>
                </div>
            </div>


            <div className='overflow-x-auto'>
                <Tabs
                    value={statusFilter}
                    onChange={(event, newValue) => setStatusFilter(newValue)}
                    // className="px-6 mb-4"
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab label="All" value="ALL" />
                    <Tab label="Proposal" value="PROPOSAL" />
                    <Tab label="Invoice" value="INVOICED" />

                </Tabs>
                <table className={tableStyles.table}>

                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup._id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header._id}>
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={classnames({
                                                    'flex items-center': header.column.getIsSorted(),
                                                    'cursor-pointer select-none': header.column.getCanSort(),
                                                })}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getIsSorted() === 'asc' && (
                                                    <i className="tabler-chevron-up text-xl" />
                                                )}
                                                {header.column.getIsSorted() === 'desc' && (
                                                    <i className="tabler-chevron-down text-xl" />
                                                )}
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}

                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map(row => (
                                <tr key={row._id} className={classnames({ selected: row.getIsSelected() })}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell._id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className='text-center'>
                                    No data available
                                </td>
                            </tr>
                        )}

                    </tbody>
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

            <Dialog fullWidth open={modalDetail} maxWidth='lg' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
                <DialogCloseButton onClick={() => setModelDetail(false)} disableRipple>
                    <i className='tabler-x' />
                </DialogCloseButton >
                <DialogTitle variant='h4' className='flex gap-2 flex-col text-center '>
                    <BannerListingDetail banner={bannerId} closeModel={setModelDetail} getBanner={getBanner} />
                </DialogTitle>
            </Dialog>




            <Dialog fullWidth open={EditModalOpen} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
                <DialogCloseButton onClick={() => setEditModalOpen(false)} disableRipple>
                    <i className='tabler-x' />
                </DialogCloseButton>
                <DialogTitle variant='h4' className='flex gap-2 flex-col text-center  sm:pbe-6 sm:pli-16'>
                    <EditMultiTabForm banner={EditSelectedPackage} setModalOpen={setEditModalOpen} getBanner={getBanner} />
                </DialogTitle>
            </Dialog>
        </Card>
    )
}

export default ProposalTable

