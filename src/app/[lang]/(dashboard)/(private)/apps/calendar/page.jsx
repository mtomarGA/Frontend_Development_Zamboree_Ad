// MUI Imports
import Card from '@mui/material/Card'

// Component Imports
import CalendarWrapper from '@views/apps/calendar/CalendarWrapper'
import { ProtectedRoute } from "@/utils/ProtectedRoute"

// Styled Component Imports
import AppFullCalendar from '@/libs/styles/AppFullCalendar'

const CalendarApp = () => {
  return (
    <ProtectedRoute permission={"event_calendar_calendar:view"}>
      <Card className='overflow-visible'>
        <AppFullCalendar className='app-calendar'>
          <CalendarWrapper />
        </AppFullCalendar>
      </Card>
    </ProtectedRoute>
  )
}

export default CalendarApp

