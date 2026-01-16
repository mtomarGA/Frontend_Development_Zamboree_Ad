'use client'

import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'
import classnames from 'classnames'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { useAuth } from '@/contexts/AuthContext'

const SidebarLeft = props => {
  const {
    mdAbove,
    leftSidebarOpen,
    calendarsColor,
    calendarApi,
    handleLeftSidebarToggle,
    handleAddEventSidebarToggle,
    setSelectedEvent,
    selectedCalendars,
    setSelectedCalendars 
  } = props

  const colorsArr = calendarsColor ? Object.entries(calendarsColor) : []

  const handleFilterChange = label => {
    if (selectedCalendars.includes(label)) {
      setSelectedCalendars(selectedCalendars.filter(l => l !== label))
    } else {
      setSelectedCalendars([...selectedCalendars, label])
    }
  }
  
     const { hasPermission } = useAuth()

  const handleViewAllChange = checked => {
    if (checked) {
      setSelectedCalendars(colorsArr.map(([key]) => key))
    } else {
      setSelectedCalendars([])
    }
  }

  const handleSidebarToggleSidebar = () => {
    setSelectedEvent(null)
    handleAddEventSidebarToggle()
  }

  const renderFilters = colorsArr.length
    ? colorsArr.map(([key, value]) => (
        <FormControlLabel
          className='mbe-1'
          key={key}
          label={key}
          control={
            <Checkbox
              color={value}
              checked={selectedCalendars.includes(key)}
              onChange={() => handleFilterChange(key)}
            />
          }
        />
      ))
    : null

  if (!renderFilters) return null

  return (
    <Drawer
      open={leftSidebarOpen}
      onClose={handleLeftSidebarToggle}
      variant={mdAbove ? 'permanent' : 'temporary'}
      ModalProps={{
        disablePortal: true,
        disableAutoFocus: true,
        disableScrollLock: true,
        keepMounted: true
      }}
      className={classnames('block', { static: mdAbove, absolute: !mdAbove })}
      PaperProps={{
        className: classnames('items-start is-[280px] shadow-none rounded rounded-se-none rounded-ee-none', {
          static: mdAbove,
          absolute: !mdAbove
        })
      }}
      sx={{
        zIndex: 3,
        '& .MuiDrawer-paper': {
          zIndex: mdAbove ? 2 : 'drawer'
        },
        '& .MuiBackdrop-root': {
          borderRadius: 1,
          position: 'absolute'
        }
      }}
    >
      <div className='is-full p-6'>
       {hasPermission('event_calendar_calendar:add') && <Button
          fullWidth
          variant='contained'
          onClick={handleSidebarToggleSidebar}
          startIcon={<i className='tabler-plus' />}
        >
          Add Calendar
        </Button>}
      </div>

      <Divider className='is-full' />

      <AppReactDatepicker
        inline
        onChange={date => calendarApi.gotoDate(date)}
        boxProps={{
          className: 'flex justify-center is-full',
          sx: { '& .react-datepicker': { boxShadow: 'none !important', border: 'none !important' } }
        }}
      />

      <Divider className='is-full' />

      <div className='flex flex-col p-6 is-full'>
        <Typography variant='h5' className='mbe-4'>
          Filters
        </Typography>

        <FormControlLabel
          className='mbe-1'
          label='View All'
          control={
            <Checkbox
              color='secondary'
              checked={selectedCalendars.length === colorsArr.length}
              onChange={e => handleViewAllChange(e.target.checked)}
            />
          }
        />

        {renderFilters}
      </div>
    </Drawer>
  )
}

export default SidebarLeft
