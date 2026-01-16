'use client'

import { useEffect, useState, useCallback } from 'react'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'


import TicketLists from '@/views/apps/custmoer-care-ticket/all-tickets/TicketsList'
import allTicketService from '@/services/custmore-care-ticket/allTicketService'

const TicketStatsCards = () => {
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchTickets = useCallback(async () => {
        setLoading(true)
        try {
            const response = await allTicketService.getAllTickets()
            const data = response?.data

            if (Array.isArray(data)) {
                setTickets(data)
            } else if (Array.isArray(data?.tickets)) {
                setTickets(data.tickets)
            } else {
                console.warn('Unexpected tickets data format:', data)
                setTickets([])
            }
        } catch (error) {
            console.error('Failed to fetch tickets:', error)
            setTickets([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchTickets()
    }, [fetchTickets])

    const ticketArray = Array.isArray(tickets) ? tickets : []

   const stats = [
  { title: 'Total Tickets', value: ticketArray.length, color: '#1976d2' },
  { title: 'Closed Tickets', value: ticketArray.filter(t => t.status?.toUpperCase() === 'CLOSE').length, color: '#f44336' },
  { title: 'Open Tickets', value: ticketArray.filter(t => t.status?.toUpperCase() === 'OPEN').length, color:'#4caf50'  },
  { title: 'Pending Tickets', value: ticketArray.filter(t => t.status?.toUpperCase() === 'PENDING').length, color: '#ff9800' }
]


    return (
        <Box>
            <Box display='flex' flexWrap='wrap' gap={2} justifyContent='space-between'>
                {stats.map((stat, index) => (
                    <Box key={index} flex='1 1 19%' minWidth='200px'>
                        <Card
                            sx={{
                                borderBottom: `4px solid ${stat.color}`,
                                boxShadow: 3,
                                height: '100%',
                                textAlign: 'center'
                            }}
                        >
                            <CardHeader title={stat.title} sx={{ textAlign: 'center', pb: 0 }} />
                            <CardContent>
                                <Typography variant='h4' color='text.primary'>
                                    {loading ? 'Loading...' : stat.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>

            <Box mt={4}>
                <TicketLists tickets={tickets} onTicketChange={fetchTickets} loading={loading} />
            </Box>
        </Box>
    )
}

export default TicketStatsCards
