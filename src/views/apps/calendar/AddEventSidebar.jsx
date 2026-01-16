'use client'

import { useState, useEffect, forwardRef, useCallback } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Switch from '@mui/material/Switch'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { FiberManualRecord } from '@mui/icons-material'

// Form + Scroll
import { useForm, Controller } from 'react-hook-form'
import PerfectScrollbar from 'react-perfect-scrollbar'

// Custom Components
import CustomTextField from '@core/components/mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// Services
import EmployeeService from '@/services/employee/EmployeeService.js'
import CustomerService from '@/services/customers/createService.js'
import HomeBannerRoute from '@/services/utsav/banner/HomeBannerServices.js'
import calendarService from '@/services/calendar/calendar.service'
import DeleteConfirmationDialog from '../deleteConfirmation'

import { useAuth } from '@/contexts/AuthContext'

const capitalize = str => str && str[0].toUpperCase() + str.slice(1)
const requesterTypes = ['Vendor', 'Customer', 'Employee']

const calendarsColor = {
  Personal: 'error',
  Business: 'primary',
  Family: 'warning',
  ETC: 'info'
}

const defaultState = {
  url: '',
  title: '',
  guests: [],
  allDay: true,
  description: '',
  endDate: new Date(),
  calendar: 'Business',
  startDate: new Date(),
  requester: null
}

const AddEventSidebar = ({ selectedEvent, setEvents, addEventSidebarOpen, handleAddEventSidebarToggle }) => {
  const [values, setValues] = useState(defaultState)
  const isBelowSmScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const [requesterType, setRequesterType] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [searchData, setSearchData] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  

  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      requesterType: '',
      requester: null
    }
  })

  const watchedRequesterType = watch('requesterType')
  const watchedRequester = watch('requester')

  const PickersComponent = forwardRef((props, ref) => (
    <CustomTextField inputRef={ref} fullWidth {...props} label={props.label || ''} error={props.error} />
  ))

  const { hasPermission } = useAuth()

  const getOptionLabel = option => {
    if (!option) return ''
    if (typeof option === 'string') return option

    const type = option.type || requesterType

    if (type === 'Vendor') {
      const name = option?.contactInfo?.name?.trim() || option?.name?.trim() || ''
      const phone = option?.contactInfo?.phoneNo?.trim() || option?.mobile?.trim() || ''
      const id = option?.vendorId || option?.id || ''
      return [name, phone, id].filter(Boolean).join(' - ')
    }

    if (type === 'Customer') {
      const name =
        option?.firstName || option?.lastName
          ? `${option?.firstName || ''} ${option?.lastName || ''}`.trim()
          : option?.name?.trim() || ''
      const phone = option?.phone || option?.mobile || ''
      const id = option?.userId || option?.id || ''
      return [name, phone, id].filter(Boolean).join(' - ')
    }

    if (type === 'Employee') {
      const name = option?.name?.trim() || ''
      const phone = option?.phone || option?.mobile || ''
      const id = option?.employee_id || option?.id || ''
      return [name, phone, id].filter(Boolean).join(' - ')
    }

    return option?.label || option?.name || ''
  }

  const clearRequesterStates = useCallback(() => {
    setInputValue('')
    setSearchData([])
    setSelectedUser(null)
    setValue('requester', null)
    setValues(prev => ({ ...prev, requester: null }))
  }, [setValue])

  const resetToStoredValues = useCallback(() => {
    if (!selectedEvent) return

    const ext = selectedEvent.extendedProps || {}

    const type = ext.requesterModel || ''

    let requester = null
    if (ext.requesterId && ext.requesterModel) {
      requester = {
        id: ext.requesterId,
        type,
        name: ext.requester || '',
        mobile: ext.requesterMobile || '',
        email: ext.requesterEmail || ''
      }
    } else if (ext.requester) {
      requester = {
        id: '',
        type,
        name: ext.requester,
        mobile: '',
        email: ''
      }
    }

    reset({
      title: selectedEvent.title || '',
      requesterType: type,
      requester: requester
    })

    setValues({
      url: selectedEvent.url || '',
      title: selectedEvent.title || '',
      allDay: !!selectedEvent.allDay,
      guests: ext.guests || [],
      description: ext.description || '',
      calendar: ext.calendar || 'Business',
      endDate: selectedEvent.end ? new Date(selectedEvent.end) : new Date(selectedEvent.start),
      startDate: selectedEvent.start ? new Date(selectedEvent.start) : new Date(),
      requester
    })

    if (requester) {
      setRequesterType(type)
      setSelectedUser(requester)
      setSearchData([requester])
      setValue('requesterType', type)
      setValue('requester', requester)

      setTimeout(() => {
        setInputValue(getOptionLabel(requester))
      }, 100)
    } else {
      setRequesterType('')
      setValue('requesterType', '')
      clearRequesterStates()
    }
  }, [selectedEvent, reset, clearRequesterStates, setValue])

  const resetToEmptyValues = useCallback(() => {
    reset({ title: '', requesterType: '', requester: null })
    setValues(defaultState)
    setRequesterType('')
    clearRequesterStates()
  }, [reset, clearRequesterStates])

  const handleSidebarClose = () => {
    resetToEmptyValues()
    clearErrors()
    handleAddEventSidebarToggle()
  }

  const fetchEvents = async () => {
    try {
      const res = await calendarService.getAllEvents()
      const events = res?.data?.data || res?.data || []
      setEvents(events)
    } catch (err) {}
  }



  const handleCreateEvent = async eventData => {
    try {
      setIsLoading(true)
      const res = await calendarService.createEvent(eventData)
      if (res?.data) await fetchEvents()
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateEvent = async eventData => {
    const id = selectedEvent?._def?.extendedProps?._id
    if (!id) return
    try {
      const res = await calendarService.updateEvent(id, eventData)
      const updated = res?.data
      if (updated) {
        setEvents(prev => prev.map(e => (e._id === updated._id ? { ...e, ...updated } : e)))
      }
    } catch {}
  }

  const handleDelete = async () => {
    const id = selectedEvent?._def?.extendedProps?._id
    if (!id) return
    try {
      await calendarService.deleteEvent(id)
      await fetchEvents()
      handleSidebarClose()
    } catch {}
  }

  const handleSearch = async searchValue => {
    if (!searchValue || searchValue.length < 3) {
      setSearchData(selectedUser ? [selectedUser] : [])
      return
    }
    try {
      let response
      if (requesterType === 'Vendor') response = await HomeBannerRoute.getsearch({ search: searchValue })
      else if (requesterType === 'Customer') response = await CustomerService.getSerchUser(searchValue)
      else if (requesterType === 'Employee') response = await EmployeeService.getEmployeeDetailsByMobile(searchValue)

      const raw = response?.data || response
      const result = Array.isArray(raw) ? raw : raw ? [raw] : []
      const filteredResults = result.filter(Boolean)

      const normalized = filteredResults.map(item => ({
        ...item,
        type: item.type || requesterType,
        id: item.vendorId || item.userId || item.employee_id || item.id
      }))

      if (selectedUser && selectedUser.type === requesterType) {
        const isSelectedUserInResults = normalized.some(
          item => (item.id || item.vendorId || item.userId || item.employee_id) === selectedUser.id
        )
        if (!isSelectedUserInResults) {
          normalized.unshift(selectedUser)
        }
      }

      setSearchData(normalized)
    } catch (err) {
      setSearchData(selectedUser ? [selectedUser] : [])
    }
  }

  const handleSelect = (e, newValue) => {
    setSelectedUser(newValue)
    if (!newValue) {
      setValues(prev => ({ ...prev, requester: null }))
      setValue('requester', null)
      return
    }

    let selected = { name: '', mobile: '', email: '', id: '', type: requesterType }
    if (requesterType === 'Vendor') {
      selected = {
        name: newValue?.contactInfo?.name || newValue?.name || newValue?.label || '',
        mobile: newValue?.contactInfo?.phoneNo || newValue?.mobile || newValue?.phone || '',
        email: newValue?.contactInfo?.email || newValue?.email || '',
        id: newValue?.vendorId || newValue?.id || newValue?.userId || '',
        type: 'Vendor'
      }
    } else if (requesterType === 'Customer') {
      selected = {
        name: `${newValue?.firstName || ''} ${newValue?.lastName || ''}`.trim() || newValue?.name || '',
        mobile: newValue?.phone || newValue?.mobile || '',
        email: newValue?.email || '',
        id: newValue?.userId || newValue?.id || '',
        type: 'Customer'
      }
    } else if (requesterType === 'Employee') {
      selected = {
        name: newValue?.name || '',
        mobile: newValue?.phone || newValue?.mobile || '',
        email: newValue?.email || '',
        id: newValue?.employee_id || newValue?.id || '',
        type: 'Employee'
      }
    }

    setValues(prev => ({ ...prev, requester: selected }))
    setValue('requester', selected)
  }

  const onSubmit = async data => {
    const eventPayload = {
      display: 'block',
      title: data.title,
      end: values.endDate,
      allDay: values.allDay,
      start: values.startDate,
      extendedProps: {
        calendar: capitalize(values.calendar),
        description: values.description,
        requester: values.requester?.name || '',
        requesterId: values.requester?.id || '',
        requesterModel: values.requester?.type || '',
        requesterMobile: values.requester?.mobile || '',
        requesterEmail: values.requester?.email || ''
      }
    }

    if (selectedEvent && selectedEvent.title?.length) {
      await handleUpdateEvent(eventPayload)
    } else {
      await handleCreateEvent(eventPayload)
    }

    handleSidebarClose()
  }

  const ScrollWrapper = isBelowSmScreen ? 'div' : PerfectScrollbar

  useEffect(() => {
    if (watchedRequesterType !== requesterType) {
      setRequesterType(watchedRequesterType)

      if (watchedRequesterType) {
        clearRequesterStates()
      }
    }
  }, [watchedRequesterType])

  useEffect(() => {
    if (addEventSidebarOpen) {
      if (selectedEvent) {
        resetToStoredValues()
      } else {
        resetToEmptyValues()
      }
    }
  }, [addEventSidebarOpen, selectedEvent, resetToStoredValues, resetToEmptyValues])

  useEffect(() => {
    if (watchedRequester && JSON.stringify(watchedRequester) !== JSON.stringify(selectedUser)) {
      setSelectedUser(watchedRequester)
      setValues(prev => ({ ...prev, requester: watchedRequester }))

      const displayValue = getOptionLabel(watchedRequester)
      if (displayValue !== inputValue) setInputValue(displayValue)
    }
  }, [watchedRequester])

  return (
    <Drawer
      anchor='right'
      open={addEventSidebarOpen}
      onClose={handleSidebarClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: ['100%', 400] } }}
    >
      <Box className='flex justify-between items-center sidebar-header plb-5 pli-6 border-be'>
        <Typography variant='h5'>{selectedEvent?.title?.length ? 'Update Calendar' : 'Add Calendar'}</Typography>
        <Box className='flex items-center gap-2'>
          {selectedEvent?.title?.length > 0 && hasPermission('event_calendar_calendar:delete') && (
            <DeleteConfirmationDialog
              itemName='calendar event'
              onConfirm={handleDelete}
              icon={<i className='tabler-trash text-2xl text-error' />}
              disabled={isLoading}
            />
          )}
          <IconButton size='small' onClick={handleSidebarClose} disabled={isLoading}>
            <i className='tabler-x text-2xl text-textPrimary' />
          </IconButton>
        </Box>
      </Box>

      <ScrollWrapper>
        <Box className='sidebar-body plb-5 pli-6'>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' className='flex flex-col gap-6'>
            <Controller
              name='title'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  fullWidth
                  label='Title'
                  value={value}
                  onChange={onChange}
                  disabled={isLoading}
                  {...(errors.title && { error: true, helperText: 'This field is required' })}
                />
              )}
            />

            {/* Calendar Select */}
            <CustomTextField
              select
              fullWidth
              label='Calendar'
              value={values.calendar}
              onChange={e => setValues({ ...values, calendar: e.target.value })}
              disabled={isLoading}
            >
              {['Personal', 'Business', 'Family', 'ETC'].map(cal => (
                <MenuItem key={cal} value={cal}>
                  <Box display='flex' alignItems='center' gap={1}>
                    <FiberManualRecord fontSize='small' color={calendarsColor[cal] || 'primary'} />
                    {cal}
                  </Box>
                </MenuItem>
              ))}
            </CustomTextField>

            {/* Start & End Date */}
            <AppReactDatepicker
              selectsStart
              id='event-start-date'
              endDate={values.endDate}
              selected={values.startDate}
              startDate={values.startDate}
              showTimeSelect={!values.allDay}
              dateFormat={!values.allDay ? 'yyyy-MM-dd hh:mm' : 'yyyy-MM-dd'}
              customInput={<PickersComponent label='Start Date' />}
              onChange={date => {
                if (!date) return
                const newStart = new Date(date)

                setValues(prev => ({
                  ...prev,
                  startDate: newStart,

                  endDate: !prev.endDate || prev.endDate < newStart ? newStart : prev.endDate
                }))
              }}
            />

            <AppReactDatepicker
              selectsEnd
              id='event-end-date'
              endDate={values.endDate}
              selected={values.endDate}
              minDate={values.startDate}
              startDate={values.startDate}
              showTimeSelect={!values.allDay}
              dateFormat={!values.allDay ? 'yyyy-MM-dd hh:mm' : 'yyyy-MM-dd'}
              customInput={<PickersComponent label='End Date' />}
              onChange={date => date && setValues({ ...values, endDate: new Date(date) })}
            />

            <FormControl>
              <FormControlLabel
                label='All Day'
                control={
                  <Switch
                    checked={values.allDay}
                    onChange={e => setValues({ ...values, allDay: e.target.checked })}
                    disabled={isLoading}
                  />
                }
              />
            </FormControl>
            <Box display='flex' flexDirection='column' gap={2}>
              <Controller
                name='requesterType'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Requester Type'
                    value={value}
                    onChange={e => {
                      const newType = e.target.value
                      onChange(newType)
                      setValue('requester')
                      clearRequesterStates()
                    }}
                    error={!!errors.requesterType}
                    helperText={errors.requesterType ? 'This field is required' : ''}
                    disabled={isLoading}
                  >
                    {requesterTypes.map(type => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />

              <Controller
                name='requester'
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Autocomplete
                    fullWidth
                    disabled={!requesterType || isLoading}
                    freeSolo
                    options={searchData}
                    inputValue={inputValue}
                    value={value || null}
                    getOptionLabel={getOptionLabel}
                    isOptionEqualToValue={(option, value) => {
                      if (!option || !value) return false
                      const optionId = option.id || option.vendorId || option.userId || option.employee_id
                      const valueId = value.id
                      return optionId && valueId
                        ? optionId === valueId && (option.type || requesterType) === (value.type || requesterType)
                        : false
                    }}
                    onInputChange={(e, newInputValue, reason) => {
                      setInputValue(newInputValue)
                      if (reason === 'input') {
                        if (newInputValue.length >= 3) {
                          handleSearch(newInputValue)
                        } else if (newInputValue.length === 0) {
                          setSearchData(selectedUser && selectedUser.type === requesterType ? [selectedUser] : [])
                        }
                      }
                    }}
                    onChange={(e, newValue) => {
                      // inform react-hook-form
                      onChange(newValue)
                      handleSelect(e, newValue)
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label={`Search ${requesterType || ''} (Name / ID / Mobile)`}
                        placeholder={!requesterType ? 'Please select requester type first' : ''}
                        error={!!error}
                        helperText={error ? 'This field is required' : ''}
                      />
                    )}
                    noOptionsText={
                      !requesterType
                        ? 'Please select requester type first'
                        : inputValue.length < 3
                          ? 'Type at least 3 characters to search'
                          : 'No options found'
                    }
                  />
                )}
              />
            </Box>

            <CustomTextField
              multiline
              fullWidth
              rows={4}
              label='Description'
              value={values.description}
              onChange={e => setValues({ ...values, description: e.target.value })}
              disabled={isLoading}
            />

            <div className='flex gap-4'>
              {hasPermission('event_calendar_calendar:edit') && (
                <Button type='submit' variant='contained' disabled={isLoading}>
                  {isLoading ? 'Processing...' : selectedEvent?.title?.length ? 'Update' : 'Add'}
                </Button>
              )}
            </div>
          </form>
        </Box>
      </ScrollWrapper>
    </Drawer>
  )
}

export default AddEventSidebar
