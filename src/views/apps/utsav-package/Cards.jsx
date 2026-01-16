// 'use client'

// import { useState, useEffect } from 'react'
// import Card from '@mui/material/Card'
// import Typography from '@mui/material/Typography'
// import CardContent from '@mui/material/CardContent'
// import CardHeader from '@mui/material/CardHeader'
// import Box from '@mui/material/Box'
// import createUtsavService from '@/services/utsav-packages/createOrder.Service'
// import { toast } from 'react-toastify'

// const TicketStatsCards = () => {
//   const [tickets, setTickets] = useState([])
//   const [loading, setLoading] = useState(false)

//   const fetchOrders = async () => {
//     setLoading(true)
//     try {
//       const res = await createUtsavService.getAllOrder()
//       if (res?.success && Array.isArray(res.data)) {
//         setTickets(res.data)
//       } else {
//         setTickets([])
//         toast.error('Invalid data received from server')
//       }
//     } catch (error) {
//       setTickets([])
//       toast.error(error?.response?.data?.message || 'Failed to fetch orders')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchOrders()
//   }, [])

//   const allCount = tickets.length
//   const activeCount = tickets.filter(t => t.paymentStatus?.toUpperCase() === 'ACTIVE').length
//   const expiredCount = tickets.filter(t => t.paymentStatus?.toUpperCase() === 'EXPIRED').length

//   const stats = [
//     { title: 'ALL', value: allCount, color: '#1976d2' },       // Blue
//     { title: 'ACTIVE', value: activeCount, color: '#2e7d32' }, // Green
//     { title: 'EXPIRED', value: expiredCount, color: '#d32f2f' } // Red
//   ]

//   return (
//     <Box sx={{ p: 2 }}>
//       <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center">
//         {stats.map((stat, index) => (
//           <Box
//             key={index}
//             sx={{
//               flex: '1 1 250px',
//               maxWidth: '300px',
//               display: 'flex',
//               justifyContent: 'center',
//             }}
//           >
//             <Card
//               sx={{
//                 border: '1px solid #ccc',
//                 borderBottom: `4px solid ${stat.color}`,
//                 height: '180px',
//                 width: '100%',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 justifyContent: 'center',
//                 textAlign: 'center',
//                 boxShadow: 'none',
//               }}
//             >
//               <CardHeader title={stat.title} sx={{ textAlign: 'center', pb: 0 }} />
//               <CardContent>
//                 <Typography variant="h4" color="text.primary">
//                   {loading ? 'Loading...' : stat.value}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Box>
//         ))}
//       </Box>
//     </Box>
//   )
// }

// export default TicketStatsCards

import { Card, Grid, Typography } from '@mui/material';

const TicketStatsCards = ({ counts }) => {
  const { all = 0, active = 0, expired = 0 } = counts || {};

  const cards = [
    { label: 'All Members', value: all, color: 'primary' },
    { label: 'Active Members', value: active, color: 'success' },
    { label: 'Expired Members', value: expired, color: 'error' }
  ];

  return (
    <Grid container spacing={3} sx={{ p: 2 }}>
      {cards.map((item, index) => (
        <Grid item xs={12} sm={4} key={index}>
          <Card sx={{ p: 3, textAlign: 'center', bgcolor: `${item.color}.light` }}>
            <Typography variant="h6">{item.label}</Typography>
            <Typography variant="h4">{item.value}</Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TicketStatsCards;
