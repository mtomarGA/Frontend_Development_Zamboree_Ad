'use client'

import { useState, useEffect } from 'react'
import { useMediaQuery } from '@mui/material'

// Components
import Calendar from './Calendar'
import SidebarLeft from './SidebarLeft'
import AddEventSidebar from './AddEventSidebar'

// Service
import calendarService from '@/services/calendar/calendar.service'

// Calendar Color Definitions
const calendarsColor = {
  Personal: 'error',
  Business: 'primary',
  Family: 'warning',
  Holiday: 'success',
  ETC: 'info'
}

const STORAGE_KEY = 'selectedCalendars'

const AppCalendar = () => {
  const [calendarApi, setCalendarApi] = useState(null)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)
  const [addEventSidebarOpen, setAddEventSidebarOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [events, setEvents] = useState([])

  // ✅ Load selected calendars from localStorage (or fallback to all)
  const [selectedCalendars, setSelectedCalendars] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : Object.keys(calendarsColor)
    }
    return Object.keys(calendarsColor)
  })

  // ✅ Save to localStorage when selectedCalendars changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedCalendars))
  }, [selectedCalendars])

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

  const handleAddEventSidebarToggle = () => {
    setAddEventSidebarOpen(!addEventSidebarOpen)
    if (addEventSidebarOpen) {
      setSelectedEvent(null)
    }
  }

  const fetchEvents = async () => {
    try {
      const res = await calendarService.getAllEvents()
      const fetchedEvents = Array.isArray(res) ? res : res?.data || []
      setEvents(fetchedEvents)
    } catch (error) {
     
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    if (selectedEvent) {
      setAddEventSidebarOpen(true)
    }
  }, [selectedEvent])

  const mdAbove = useMediaQuery(theme => theme.breakpoints.up('md'))

  return (
    <>
      <SidebarLeft
        mdAbove={mdAbove}
        calendarApi={calendarApi}
        calendarsColor={calendarsColor}
        leftSidebarOpen={leftSidebarOpen}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        handleAddEventSidebarToggle={handleAddEventSidebarToggle}
        selectedCalendars={selectedCalendars}
        setSelectedCalendars={setSelectedCalendars}
        setSelectedEvent={setSelectedEvent}
      />

      <div className='p-6 pbe-0 flex-grow overflow-visible bg-backgroundPaper rounded'>
        <Calendar
          calendarApi={calendarApi}
          setCalendarApi={setCalendarApi}
          selectedCalendars={selectedCalendars}
          calendarsColor={calendarsColor}
          handleLeftSidebarToggle={handleLeftSidebarToggle}
          setSelectedEvent={setSelectedEvent}
          events={events}
          setEvents={setEvents}
          fetchEvents={fetchEvents}
        />
      </div>

      <AddEventSidebar
        selectedEvent={selectedEvent}
        setEvents={setEvents}
        addEventSidebarOpen={addEventSidebarOpen}
        handleAddEventSidebarToggle={handleAddEventSidebarToggle}
      />
    </>
  )
}

export default AppCalendar
