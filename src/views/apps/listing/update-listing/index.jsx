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
import { useAuth } from '@/contexts/AuthContext'

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

const UpdateListingTable = ({ reviewsData }) => {
  const router = useRouter()
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
  const { hasPermission } = useAuth()


  // Fetch country data on mount
  // useEffect(() => {
  //   const fetchCountries = async () => {
  //     try {
  //       const res = await countryService.getCountries()
  //       if (res?.data) {
  //         setCountryList(res.data)
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch countries:', error)
  //     }
  //   }

  //   fetchCountries()
  // }, [])

  // Fetch states when country changes
  // useEffect(() => {
  //   const fetchStates = async () => {
  //     if (!selectedCountry) {
  //       setStateList([])
  //       setSelectedState('')
  //       return
  //     }

  //     try {
  //       const res = await stateService.getStateById(selectedCountry)
  //       if (res?.data) {
  //         setStateList(res.data)
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch states:', error)
  //     }
  //   }

  //   fetchStates()
  // }, [selectedCountry])

  // Fetch cities when state changes
  // useEffect(() => {
  //   const fetchCities = async () => {
  //     if (!selectedState) {
  //       setCityList([])
  //       setSelectedCity('')
  //       return
  //     }

  //     try {
  //       const res = await cityService.getCityById(selectedState)
  //       if (res?.data) {
  //         setCityList(res.data)
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch cities:', error)
  //     }
  //   }

  //   fetchCities()
  // }, [selectedState])

  // Fetch areas when city changes
  // useEffect(() => {
  //   const fetchAreas = async () => {
  //     if (!selectedCity) {
  //       setAreaList([])
  //       setSelectedArea('')
  //       return
  //     }

  //     try {
  //       const res = await areaService.getAreaById(selectedCity)
  //       if (res?.data) {
  //         setAreaList(res.data)
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch areas:', error)
  //     }
  //   }

  //   fetchAreas()
  // }, [selectedCity])

  // const handleCountryChange = (e) => {
  //   setSelectedCountry(e.target.value)
  //   setSelectedState('')
  //   setSelectedCity('')
  //   setSelectedArea('')
  // }

  // const handleStateChange = (e) => {
  //   setSelectedState(e.target.value)
  //   setSelectedCity('')
  //   setSelectedArea('')
  // }

  // const handleCityChange = (e) => {
  //   setSelectedCity(e.target.value)
  //   setSelectedArea('')
  // }

  // const handleAreaChange = (e) => {
  //   setSelectedArea(e.target.value)
  // }

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

  const handlePhoneSearch = async () => {
    if (!phone) {
      toast.error("Please Enter Phone")
      return
    }

    try {
      const res = await manageBusinessService.getBusinessByNumber(phone)
      if (res?.data) {
        const businessArray = [res.data]
        setAllData(businessArray)
        setData(businessArray)
      } else {
        setAllData([])
        setData([])
        toast.info(res?.data?.message || "No business found with this phone number")
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong"
      // toast.error(errorMessage)
    }
  }

  // const handleLocationSearch = async () => {
  //   try {
  //     let queryParams = {}

  //     if (selectedCountry) queryParams.country = selectedCountry
  //     if (selectedState) queryParams.state = selectedState
  //     if (selectedCity) queryParams.city = selectedCity
  //     if (selectedArea) queryParams.area = selectedArea

  //     if (Object.keys(queryParams).length === 0) {
  //       toast.error("Please select at least one location filter")
  //       return
  //     }

  //     const res = await manageBusinessService.getBusinessByLocation(queryParams)
  //     if (res?.data?.length > 0) {
  //       setAllData(res.data)
  //       setData(res.data)
  //     } else {
  //       setAllData([])
  //       setData([])
  //       toast.info("No businesses found in the selected location")
  //     }
  //   } catch (error) {
  //     const errorMessage = error.response?.data?.message || error.message || "Something went wrong"
  //     toast.error(errorMessage)
  //   }
  // }

  const productStatusObj = {
    APPROVED: { title: 'APPROVED', color: 'success' },
    PENDING: { title: 'PENDING', color: 'warning' },
    REJECTED: { title: 'REJECTED', color: 'error' },
  }

  const handleEditListing = id => {
    router.push(`/en/apps/listing/masters/edit-listing/${id}`)
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
      columnHelper.accessor('emailStatus', {
        header: 'Email',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col items-start'>
              <Typography variant='body2'>{row.original?.contactInfo?.email}</Typography>
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
              <Typography variant='body2'>{row.original.companyInfo?.businessCategory?.name} </Typography>
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
      columnHelper.accessor('createDate', {
        header: 'Create Date',
        sortingFn: (rowA, rowB) => {
          const dateA = new Date(rowA.original.date)
          const dateB = new Date(rowB.original.date)

          return dateA.getTime() - dateB.getTime()
        },
        cell: ({ row }) => {
          const date = new Date(row.original.createdAt).toLocaleDateString('en-US', {
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
              <Typography variant='body2'>{'update by'}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('lastUpdateDate', {
        header: 'Last Update Date',
        sortingFn: (rowA, rowB) => {
          const dateA = new Date(rowA.original.date)
          const dateB = new Date(rowB.original.date)

          return dateA.getTime() - dateB.getTime()
        },
        cell: ({ row }) => {
          const date = new Date(row.original.updatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          })

          return <Typography>{date}</Typography>
        }
      }),
      columnHelper.accessor('lastActive', {
        header: 'Last Active',
        sortingFn: (rowA, rowB) => {
          const dateA = new Date(rowA.original.date)
          const dateB = new Date(rowB.original.date)

          return dateA.getTime() - dateB.getTime()
        },
        cell: ({ row }) => {
          const date = new Date(row.original.date).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          })

          return <Typography>{date}</Typography>
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
        cell: ({ row }) => (

          <div className='flex items-center'>
            {hasPermission("partner_update_partner:edit") &&
              <Button fullWidth variant='contained' color='primary' onClick={() => handleEditListing(row.original._id)}>
                Manage Listing
              </Button>
            }
          </div>
        ),
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
            Update Partner
          </Typography>
          {/* <Grid container spacing={4} sx={{ my: 5 }}>
            <Grid size={{ xs: 12, md: 1 }}></Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <CustomTextField
                select
                fullWidth
                id='country'
                value={selectedCountry}
                onChange={handleCountryChange}
                slotProps={{ select: { displayEmpty: true } }}
              >
                <MenuItem value=''>Select Country</MenuItem>
                {countryList.map(country => (
                  <MenuItem key={country._id} value={country._id}>
                    {country.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            <Grid size={{ xs: 12, md: 2 }}>
              <CustomTextField
                select
                fullWidth
                id='state'
                value={selectedState}
                onChange={handleStateChange}
                disabled={!selectedCountry}
                slotProps={{
                  select: { displayEmpty: true }
                }}
              >
                <MenuItem value=''>Select State</MenuItem>
                {stateList.map(state => (
                  <MenuItem key={state._id} value={state._id}>
                    {state.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <CustomTextField
                select
                fullWidth
                id='city'
                value={selectedCity}
                onChange={handleCityChange}
                disabled={!selectedState}
                slotProps={{
                  select: { displayEmpty: true }
                }}
              >
                <MenuItem value=''>Select City</MenuItem>
                {cityList.map(city => (
                  <MenuItem key={city._id} value={city._id}>
                    {city.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <CustomTextField
                select
                fullWidth
                id='area'
                value={selectedArea}
                onChange={handleAreaChange}
                disabled={!selectedCity}
                slotProps={{
                  select: { displayEmpty: true }
                }}
              >
                <MenuItem value=''>Select Area</MenuItem>
                {areaList.map(area => (
                  <MenuItem key={area.name} value={area.name}>
                    {area.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }} display='flex' alignItems='center'>
              <Button
                fullWidth
                variant='contained'
                color='primary'
                onClick={handleLocationSearch}
                disabled={!selectedCountry && !selectedState && !selectedCity && !selectedArea}
              >
                Search Business
              </Button>
            </Grid>
          </Grid> */}
          {/* <Typography align='center' sx={{ my: 5 }}>
            OR
          </Typography> */}
          {/* <Grid container spacing={2} justifyContent='center'>
            <Grid size={{ xs: 12, md: 3 }}>
              <CustomTextField
                fullWidth
                label='Mobile Number'
                value={phone}
                variant='outlined'
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }} display='flex' alignItems='center' className='pt-4'>
              <Button
                fullWidth
                variant='contained'
                color='primary'
                onClick={handlePhoneSearch}
                disabled={!phone}
              >
                Search Business
              </Button>
            </Grid>
          </Grid> */}
          <Grid container spacing={2} justifyContent='center'>
            <Grid item xs={12} md={4}>
              <CustomTextField
                fullWidth
                label='Search business by name, location OR phone number'
                value={textSearch}
                variant='outlined'
                onChange={handleTextSearchChange}
                placeholder='Type location or phone number'
              />
            </Grid>

            {/* <Grid item xs={12} md={3}>
              <CustomTextField
                fullWidth
                label='Mobile Number'
                value={phone}
                variant='outlined'
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={2} display='flex' alignItems='center' className='pt-4'>
              <Button
                fullWidth
                variant='contained'
                color='primary'
                onClick={handlePhoneSearch}
                disabled={!phone}
              >
                Search Business
              </Button>
            </Grid> */}
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

export default UpdateListingTable
