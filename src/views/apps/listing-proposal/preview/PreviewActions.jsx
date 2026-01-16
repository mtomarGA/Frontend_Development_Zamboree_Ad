// React Imports
import { useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import BannerInvoice from "@/services/premium-listing/banner.service"
import PaidInvoice from "@/services/premium-listing/paidListing.service"
import FixedInvoice from "@/services/premium-listing/fixedListing.service"
import AddPaymentDrawer from '@views/apps/invoice/shared/AddPaymentDrawer'
import SendInvoiceDrawer from '@views/apps/invoice/shared/SendInvoiceDrawer'


import { Dialog, DialogTitle } from '@mui/material'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import EstimatePage from '@/components/dialogs/premium-listing/InvoiceGanerate/InvoiceGenerate.dialogs'

const PreviewActions = ({ id, onButtonClick, componentRef, invoiceData, Getdatabyid }) => {
  console.log(invoiceData, "invoiceDatainvoiceDatagggggggGGG");

  const [invoiceId, setInvoiceId] = useState('')
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false)
  const [EditModalOpen, setEditModalOpen] = useState(false)
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

  const handleInvoice = async () => {
    setEditModalOpen(true)
    if (invoiceData.type == "Banner") {
      const InvoiceId = await BannerInvoice.getInvoiceId()
      setInvoiceId(InvoiceId?.data)
    }
    else if(invoiceData.type=="PaidListing"){
       const InvoiceId = await PaidInvoice.generateInvoicedId()
      setInvoiceId(InvoiceId?.data)
    }
    else{
      const InvoiceId = await FixedInvoice.getInvoiceId()
      setInvoiceId(InvoiceId?.data)
    }

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
            Send Proposal
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

          </div>
          <Button
            fullWidth
            color='success'
            variant='contained'
            className='capitalize'
            onClick={handleInvoice}
          // startIcon={<i className='tabler-currency-dollar' />}
          >
            Generate To Invoice
          </Button>
        </CardContent>
      </Card>

      <AddPaymentDrawer open={paymentDrawerOpen} handleClose={() => setPaymentDrawerOpen(false)} />
      <SendInvoiceDrawer open={sendDrawerOpen} handleClose={() => setSendDrawerOpen(false)} />
      <Dialog fullWidth open={EditModalOpen} maxWidth='lg' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <DialogCloseButton onClick={() => setEditModalOpen(false)} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center   '>
          <EstimatePage invoiceData={invoiceData} invoiceId={invoiceId} setEditModalOpen={setEditModalOpen} Getdatabyid={Getdatabyid} />
        </DialogTitle>
      </Dialog>
    </>
  )
}

export default PreviewActions
