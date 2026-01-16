'use client'
// MUI Imports
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

// Component Imports
import InvoiceListTable from './InvoiceListTable'
import InvoiceCard from './InvoiceCard'
import EventInvoiceService from '@/services/event/invoice/EventInvoiceService'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const InvoiceList = () => {
  const [invoiceData, setInvoiceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchInvoiceData = async () => {
    try {
      setLoading(true)
      const response = await EventInvoiceService.Get()
      if (response?.data) {
        setInvoiceData(response.data)
      } else {
        setError('No data received')
      }
    } catch (err) {
      console.error('Error fetching invoices:', err)
      setError('Failed to load invoices')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoiceData()
  }, [])

  // Calculate stats for InvoiceCard
  const totalInvoices = invoiceData.length
  const paidInvoices = invoiceData.filter(invoice => invoice.status === 'COMPLETED').length
  const unpaidInvoices = invoiceData.filter(invoice => invoice.status === 'PENDING').length

  const statsData = [
    {
      title: totalInvoices,
      subtitle: 'Total Invoices',
      icon: 'tabler-file-invoice'
    },
    {
      title: paidInvoices,
      subtitle: 'Paid Invoices',
      icon: 'tabler-checks'
    },
    {
      title: unpaidInvoices,
      subtitle: 'Unpaid Invoices',
      icon: 'tabler-circle-off'
    }
  ]

  // delete Invoice

  const deleteInvoice = async (id) => {
    try {
      const res = await EventInvoiceService.deleteData(id);
      if (res?.success === true) {
        toast.success(res?.message);
        fetchInvoiceData();
      }
    } catch (err) {
      console.error('Error deleting invoice:', err)
      setError('Failed to delete invoice')
    }
  }

  if (loading) {
    return (
      <Grid container spacing={6} justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    )
  }

  if (error) {
    return (
      <Grid container spacing={6} justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
        <Grid item>
          <Typography color="error">{error}</Typography>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12}> */}
        {/* <InvoiceCard data={statsData} /> */}
       
      {/* </Grid> */}
      <Grid item xs={12}>
        <InvoiceListTable invoiceData={invoiceData} deleteInvoice={deleteInvoice} />
      </Grid>
    </Grid>
  )
}

export default InvoiceList
