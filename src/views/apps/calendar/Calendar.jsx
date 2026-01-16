'use client'

import { useEffect, useRef, useState } from 'react'

// MUI
import { useTheme } from '@mui/material/styles'

// FullCalendar Plugins
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

// Services
import calendarService from '@/services/calendar/calendar.service'
import manageHolidaysServices from '@/services/leave-management/manageHolidays'

const blankEvent = {
  title: '',
  start: '',
  end: '',
  allDay: false,
  url: '',
  extendedProps: {
    calendar: '',
    guests: [],
    description: ''
  }
}

const Calendar = ({
  calendarsColor,
  handleLeftSidebarToggle,
  selectedCalendars,
  setCalendarApi: setParentCalendarApi,
  setSelectedEvent,
  events,
  fetchEvents
}) => {
  const theme = useTheme()
  const calendarRef = useRef()

  const [calendarApi, setCalendarApi] = useState(null)
  const [holidays, setHolidays] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])

  // Initialize FullCalendar API
  useEffect(() => {
    if (!calendarApi) {
      const api = calendarRef.current?.getApi()
      setCalendarApi(api)
      setParentCalendarApi(api)
    }
  }, [calendarApi, setParentCalendarApi])

  // Fetch holidays from API
  const fetchHolidays = async () => {
    try {
      const response = await manageHolidaysServices.getAllHolidays()
      const holidayData = response?.data?.data || response?.data || []

      const holidayEvents = holidayData.map(holiday => ({
        id: holiday._id,
        title: holiday.holidayName,
        start: holiday.startDate,
        end: holiday.endDate,
        allDay: true,
        editable: false, 
        startEditable: false,
        durationEditable: false,
        extendedProps: {
          calendar: 'Holiday',
          status: holiday.status,
          isHoliday: true 
        }
      }))

      setHolidays(holidayEvents)
    } catch (err) {
      console.error('Error fetching holidays:', err)
    }
  }

  useEffect(() => {
    fetchHolidays()
  }, [])

  useEffect(() => {
    const filteredRegularEvents = events.filter(event =>
      selectedCalendars.includes(event.extendedProps?.calendar?.trim())
    )

    const filteredHolidays = holidays.filter(holiday =>
      selectedCalendars.includes(holiday.extendedProps?.calendar)
    )

    setFilteredEvents([...filteredRegularEvents, ...filteredHolidays])
  }, [events, selectedCalendars, holidays])

  const calendarOptions = {
    ref: calendarRef,
    events: filteredEvents,
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    editable: true,
    eventResizableFromStart: true,
    dragScroll: true,
    navLinks: true,
    dayMaxEvents: 2,
    direction: theme.direction,
    headerToolbar: {
      start: 'sidebarToggle, prev, next, title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    views: {
      week: {
        titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
      }
    },
    eventClassNames({ event }) {
      const calendarName = event._def.extendedProps.calendar || 'default'
      const colorName = calendarsColor[calendarName] || 'default'
    
      const classes = [`event-bg-${colorName}`]
      if (event._def.extendedProps.isHoliday) {
        classes.push('holiday-event', 'non-editable')
      }
      
      return classes
    },
    eventClick({ event, jsEvent }) {
      jsEvent.preventDefault()
 
      if (event.extendedProps.calendar === 'Holiday' || event.extendedProps.isHoliday) {

        console.log('Holidays cannot be edited')
        return
      }
      
      setSelectedEvent(event)
      if (event.url) window.open(event.url, '_blank')
    },
    customButtons: {
      sidebarToggle: {
        icon: 'tabler tabler-menu-2',
        click: handleLeftSidebarToggle
      }
    },
    dateClick(info) {
      const newEvent = {
        ...blankEvent,
        start: info.date,
        end: info.date,
        allDay: true
      }
      setSelectedEvent(newEvent)
    },
    eventDrop: async ({ event }) => {
     
      if (event.extendedProps.calendar === 'Holiday' || event.extendedProps.isHoliday) {
        console.log('Holidays cannot be moved')
        return
      }

      try {
        await calendarService.updateEvent(event.id, {
          title: event.title,
          start: event.start,
          end: event.end,
          allDay: event.allDay
        })
        fetchEvents()
      } catch (err) {
        console.error('Error updating event:', err)
      }
    },
    eventResize: async ({ event }) => {
    
      if (event.extendedProps.calendar === 'Holiday' || event.extendedProps.isHoliday) {
        console.log('Holidays cannot be resized')
        return
      }

      try {
        await calendarService.updateEvent(event.id, {
          title: event.title,
          start: event.start,
          end: event.end,
          allDay: event.allDay
        })
        fetchEvents()
      } catch (err) {
        console.error('Error updating event:', err)
      }
    }
  }

  return <FullCalendar {...calendarOptions} />
}

export default Calendar
