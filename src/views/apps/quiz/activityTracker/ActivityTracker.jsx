'use client'
import React, { useEffect, useState } from 'react'
import ActivityTable from './ActivityTable'
import ActivityService from '@/services/quiz/activity/ActivityServices'

function ActivityTracker() {

    const [quizType, setQuizType] = useState([])
    const fetchActivity = async () => {
        const response = await ActivityService.Get()
        setQuizType(response.data)

    }

    useEffect(() => {
        fetchActivity()
    }, [])

    return (
        <div>

            <ActivityTable quizType={quizType} />
        </div>
    )
}

export default ActivityTracker
