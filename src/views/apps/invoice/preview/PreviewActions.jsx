// React Imports
import { useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'

// Component Imports
import AddPaymentDrawer from '@views/apps/invoice/shared/AddPaymentDrawer'
import SendInvoiceDrawer from '@views/apps/invoice/shared/SendInvoiceDrawer'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

const PreviewActions = ({ id, onButtonClick, componentRef }) => {
  // States
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false)
  const [sendDrawerOpen, setSendDrawerOpen] = useState(false)

  // Hooks
  const { lang: locale } = useParams()

  // Handle PDF Download
  const handleDownloadPdf = async () => {
    const element = componentRef.current
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`invoice_${id}.pdf`)
  }

  return (
    <>
      <Card>
        <CardContent className='flex flex-col gap-4'>
          <Button
            fullWidth
            variant='contained'
            className='capitalize'
            startIcon={<i className='tabler-send' />}
            onClick={() => setSendDrawerOpen(true)}
          >
            Send Invoice
          </Button>
          <Button 
            fullWidth 
            color='secondary' 
            variant='tonal' 
            className='capitalize'
            onClick={handleDownloadPdf}
            startIcon={<i className='tabler-download' />}
          >
            Download PDF
          </Button>
          <div className='flex items-center gap-4'>
            <Button fullWidth color='secondary' variant='tonal' className='capitalize' onClick={onButtonClick}>
              Print
            </Button>
            <Button
              fullWidth
              component={Link}
              color='secondary'
              variant='tonal'
              className='capitalize'
              href={getLocalizedUrl(`/apps/invoice/edit/${id}`, locale)}
            >
              Edit
            </Button>
          </div>
          <Button
            fullWidth
            color='success'
            variant='contained'
            className='capitalize'
            onClick={() => setPaymentDrawerOpen(true)}
            startIcon={<i className='tabler-currency-dollar' />}
          >
            Add Payment
          </Button>
        </CardContent>
      </Card>
      <AddPaymentDrawer open={paymentDrawerOpen} handleClose={() => setPaymentDrawerOpen(false)} />
      <SendInvoiceDrawer open={sendDrawerOpen} handleClose={() => setSendDrawerOpen(false)} />
    </>
  )
}

export default PreviewActions
