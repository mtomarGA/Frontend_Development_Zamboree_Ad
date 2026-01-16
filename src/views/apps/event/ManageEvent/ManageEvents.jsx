'use client'
import React, { useEffect, useState } from 'react'
import EventTable from './EventTable'
import EventService from '@/services/event/event_mgmt/event'

function ManageEvents() {

  const [getEvent, setGetEvent] = useState([])

  const getEventData = async () => {
    const response = await EventService.Get()
    setGetEvent(response.data || []);
    // console.log(response.data);
  }

  useEffect(() => {
    getEventData()
  }, [])


  return (
    <div>

      <EventTable getEventData={getEventData} quizType={getEvent} setQuizType={setGetEvent} />
    </div>
  )
}

export default ManageEvents
