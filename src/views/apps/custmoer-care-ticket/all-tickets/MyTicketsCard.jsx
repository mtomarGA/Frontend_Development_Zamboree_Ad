'use client'

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import { Grid2 } from '@mui/material'
import TicketList from './TicketsList'
// import TicketList from '@/views/apps/custmoer-care-ticket/all-tickets/MyTicket.jsx'

const stats = [
    { title: 'Total Tickets', value: '10', color: '#1976d2' },
    { title: 'Closed Tickets', value: '1', color: '#4caf50' },
    { title: 'Open Tickets', value: '2', color: '#f44336' },
    { title: 'Pending Tickets', value: '7', color: '#ff9800' },
    { title: 'Resolved Tickets', value: '0', color: '#9c27b0' }
]

const TicketStatsCards = () => {
    return (
        <div>
            <Grid2 container spacing={4}>
                {stats.map((stat, index) => (
                    <Grid2 key={index} xs={12} sm={6} md={4} lg={2.4}>
                        <Card
                            sx={{
                                borderBottom: `2px solid ${stat.color}`,
                                boxShadow: 3
                            }}
                        >
                            <CardHeader title={stat.title} />
                            <CardContent>
                                <Typography variant='h4' color='text.primary'>
                                    {stat.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid2>
                ))}


                <TicketList />
            </Grid2>
        </div>
    )
}

export default TicketStatsCards
