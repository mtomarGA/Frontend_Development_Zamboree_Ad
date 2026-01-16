'use client'

import { useEffect, useState, useMemo } from 'react'
import Grid from '@mui/material/Grid2'
import {
  Button, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography,
  Paper, TextField, CardHeader, TablePagination, Divider, Checkbox
} from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'

import CountryService from '@/services/location/country.services'
import stateService from '@/services/location/state.services'
import CityService from '@/services/location/city.service'
import areaService from '@/services/customers/countryService'
import Keyword from "@/services/keywords/createKeywordService"

const positionList = [1, 2, 3, 4, 5]

const KeywordPricingForms = ({ selectedKeyword, setModalOpen, getKeywords }) => {

  console.log(selectedKeyword, "selectedKeywordselectedKeyword");

  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [city, setCity] = useState('')
  const [errors, setErrors] = useState({})
  const [areaOpen, setAreaOpen] = useState(false)

  const [countryList, setCountryList] = useState([])
  const [statesList, setStatesList] = useState([])
  const [CityList, setCityList] = useState([])
  const [AreaList, setAreaList] = useState([])
  const [pricingData, setPricingData] = useState([])

  const [selectedAreaIds, setSelectedAreaIds] = useState([])

  // Bulk price inputs
  const [bulkListingPrice, setBulkListingPrice] = useState('')
  const [bulkPositionPrices, setBulkPositionPrices] = useState(positionList.map(() => ''))

  const [globalFilter, setGlobalFilter] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // ---------------- FETCHERS ----------------
  const fetchCountries = async () => {
    const response = await CountryService.getCountries()
    setCountryList(response.data || [])
  }

  const fetchStates = async (countryId) => {
    const response = await stateService.getStateById(countryId)
    setStatesList(response.data || [])
  }

  const fetchCity = async (stateId) => {
    const response = await CityService.getCityById(stateId)
    setCityList(response.data || [])
  }

  const fetchArea = async (cityId) => {
    const response = await areaService.getArea(cityId)
    setAreaList(response.data || [])
  }

  useEffect(() => {
    fetchCountries()
  }, [])
  useEffect(() => {
    if (!selectedKeyword?._id) return;

    const prices = selectedKeyword?.prices || [];
    if (prices.length === 0) return;

    // Auto-set first item’s location (assuming same for all)
    const first = prices[0];

    setSelectedCountry(first.country);
    setSelectedState(first.state);
    setCity(first.city);
    setAreaOpen(true);

    // Pre-fill pricing data
    const formatted = prices.map(p => ({
      areaId: p.area,
      area: p.areaName || '', // optional if areaName exists
      latitude: p.latitude,
      longitude: p.longitude,
      listingPrice: p.listingPrice || '00.00',
      positionPrices: p.positionPrices || ['00.00', '00.00', '00.00', '00.00', '00.00']
    }));

    setPricingData(formatted);

    // fetch dependencies to display names in dropdowns
    fetchStates(first.country);
    fetchCity(first.state);
    fetchArea(first.city);
  }, [selectedKeyword]);

  // ---------------- HANDLERS ----------------
  const handleShow = async () => {
    const newErrors = {}
    if (!selectedCountry) newErrors.country = 'Country is required'
    if (!selectedState) newErrors.state = 'State is required'
    if (!city) newErrors.city = 'City is required'
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      const areas = await areaService.getArea(city)
      const generatedPricingData = (areas.data || []).map(area => ({
        areaId: area._id,
        area: area.name,
        latitude: area.latitude,
        longitude: area.longitude,
        listingPrice: '00.00',
        positionPrices: positionList.map(() => '00.00')
      }))
      setPricingData(generatedPricingData)
      setAreaOpen(true)
    } else {
      toast.error('Validation failed')
    }
  }

  const handleSelectArea = (areaId) => {
    setSelectedAreaIds(prev =>
      prev.includes(areaId) ? prev.filter(id => id !== areaId) : [...prev, areaId]
    )
  }

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedAreaIds(filteredData.map(a => a.areaId))
    } else {
      setSelectedAreaIds([])
    }
  }

  const handleBulkApply = () => {
    if (selectedAreaIds.length === 0) {
      toast.error('Please select at least one area')
      return
    }

    setPricingData(prev =>
      prev.map(area => {
        if (selectedAreaIds.includes(area.areaId)) {
          return {
            ...area,
            listingPrice: bulkListingPrice || area.listingPrice,
            positionPrices: bulkPositionPrices.map((val, idx) => val || area.positionPrices[idx])
          }
        }
        return area
      })
    )

    toast.success('Prices applied successfully to selected areas')
  }

  const handleSave = async () => {
    if (pricingData.length === 0) {
      toast.error('No areas to save')
      return
    }

    const keywordId = selectedKeyword?._id

   const formData = pricingData.map(row => ({
  country: selectedCountry,
  state: selectedState,
  city: city,
  areaId: row.areaId?._id ? row.areaId._id : row.areaId,
  latitude: row.latitude,
  longitude: row.longitude,
  areaName: row.area,
  positionPrices: row.positionPrices
}))

    console.log(formData, "formDataformDataformData");

  const result = await Keyword.updatePrice(keywordId, formData)
  toast.success(result?.message || 'Price saved successfully')
  setModalOpen(false)
  getKeywords()
}

// ---------------- FILTER + PAGINATION ----------------
const handleSearch = (event) => setGlobalFilter(event.target.value)

const filteredData = useMemo(() =>
  pricingData.filter((row) =>
    row.area.toLowerCase().includes(globalFilter.toLowerCase())
  ), [pricingData, globalFilter]
)

const paginatedData = useMemo(() =>
  filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
  [filteredData, page, rowsPerPage]
)

const handleInputChange = (idx, field, value) => {
  setPricingData(prev => {
    const updated = [...prev]
    updated[idx][field] = value
    return updated
  })
}

const handlePositionPriceChange = (idx, posIdx, value) => {
  setPricingData(prev => {
    const updated = [...prev]
    updated[idx].positionPrices[posIdx] = value
    return updated
  })
}

return (
  <Grid container spacing={7} sx={{ maxWidth: '1200px' }}>
    <Grid size={{ xs: 12, md: 12 }}>
      <CardHeader title='Add Price on Keyword' />
    </Grid>

    <Grid size={{ xs: 12 }}>
      <Typography><strong>Keyword:</strong> <span style={{ color: 'orange' }}>{selectedKeyword?.name}</span></Typography>
    </Grid>

    {/* Country */}
    <Grid size={{ xs: 12, md: 3 }}>
      <CustomTextField
        select fullWidth label="Country"
        value={selectedCountry}
        onChange={e => {
          setSelectedCountry(e.target.value)
          fetchStates(e.target.value)
          setSelectedState('')
          setCity('')
          setAreaList([])
        }}
        error={!!errors.country} helperText={errors.country}
      >
        <MenuItem value="">Select Country</MenuItem>
        {countryList.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
      </CustomTextField>
    </Grid>

    {/* State */}
    <Grid size={{ xs: 12, md: 3 }}>
      <CustomTextField
        select fullWidth label="State"
        value={selectedState}
        onChange={e => {
          setSelectedState(e.target.value)
          fetchCity(e.target.value)
          setCity('')
          setAreaList([])
        }}
        error={!!errors.state} helperText={errors.state}
      >
        <MenuItem value="">Select State</MenuItem>
        {statesList.map(s => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
      </CustomTextField>
    </Grid>

    {/* City */}
    <Grid size={{ xs: 12, md: 3 }}>
      <CustomTextField
        select fullWidth label="City"
        value={city}
        onChange={e => {
          setCity(e.target.value)
        }}
        error={!!errors.city} helperText={errors.city}
      >
        <MenuItem value="">Select City</MenuItem>
        {CityList.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
      </CustomTextField>
    </Grid>

    {/* Show */}
    <Grid size={{ xs: 12, md: 3 }} className='mt-4'>
      <Button fullWidth variant='contained' onClick={handleShow}>Show Areas</Button>
    </Grid>

    {areaOpen && (
      <>
        <Grid xs={12}><Divider /></Grid>

        {/* Bulk Price Section */}
        <Grid size={{ xs: 12, md: 12 }} className='flex flex-wrap gap-4 items-end border p-3 rounded-md mt-3'>
          <Grid size={{ xs: 12, md: 12 }}>
            <Typography variant='subtitle1'><strong>Apply Bulk Price:</strong></Typography>
          </Grid>
          <TextField
            label='Listing Price'
            size='small'
            value={bulkListingPrice}
            onChange={(e) => setBulkListingPrice(e.target.value)}
          />
          {positionList.map((pos, idx) => (
            <TextField
              key={idx}
              label={`Pos ${pos}`}
              size='small'
              value={bulkPositionPrices[idx]}
              onChange={e => {
                const newPrices = [...bulkPositionPrices]
                newPrices[idx] = e.target.value
                setBulkPositionPrices(newPrices)
              }}
            />
          ))}
          <Button variant='contained' color='success' onClick={handleBulkApply}>
            Apply to Selected Areas
          </Button>
        </Grid>

        {/* Search */}
        <Grid size={{ xs: 12, md: 12 }} className='mt-3'>
          <TextField
            value={globalFilter}
            onChange={handleSearch}
            placeholder='Search area'
            size='small'
            fullWidth
          />
        </Grid>

        {/* Price Table */}
        <Grid xs={12}>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding='checkbox'>
                    <Checkbox
                      checked={selectedAreaIds.length === filteredData.length && filteredData.length > 0}
                      indeterminate={selectedAreaIds.length > 0 && selectedAreaIds.length < filteredData.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Area</TableCell>
                  <TableCell>Listing Price</TableCell>
                  {positionList.map(pos => (
                    <TableCell key={pos}>{pos} Position</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row, i) =>
                // console.log(row?.areaId,"asasasasasas")
                (
                  <TableRow key={row.areaId}>
                    <TableCell padding='checkbox'>
                      <Checkbox
                        checked={selectedAreaIds.includes(row.areaId)}
                        onChange={() => handleSelectArea(row.areaId)}
                      />
                    </TableCell>
                    <TableCell>{row.area || row?.areaId?.name}</TableCell>
                    <TableCell>
                      <TextField
                        size='small' fullWidth
                        value={row.listingPrice}
                        onChange={e => handleInputChange(i, 'listingPrice', e.target.value)}
                      />
                    </TableCell>
                    {positionList.map((_, posIdx) => (
                      <TableCell key={posIdx}>
                        <TextField
                          size='small' fullWidth
                          value={row.positionPrices[posIdx]}
                          onChange={e => handlePositionPriceChange(i, posIdx, e.target.value)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                )
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component='div'
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={e => {
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }}
          />
        </Grid>

        <Grid xs={12}>
          <Button variant='contained' color='primary' size='large' onClick={handleSave}>
            Save All Prices
          </Button>
        </Grid>
      </>
    )}
  </Grid>
)
}

export default KeywordPricingForms
