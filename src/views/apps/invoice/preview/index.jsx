'use client'

// React Imports
import { useRef } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import PreviewActions from './PreviewActions'
import PreviewCard from './PreviewCard'

const Preview = ({ invoiceData, id }) => {
  // Create ref for PDF generation
  const componentRef = useRef()

  // Handle Print Button Click
  const handleButtonClick = () => {
    window.print()
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 9 }}>
        <div ref={componentRef}>
          <PreviewCard invoiceData={invoiceData} id={id} />
        </div>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <PreviewActions
          id={id}
          onButtonClick={handleButtonClick}
          componentRef={componentRef}
        />
      </Grid>
    </Grid>
  )
}

export default Preview
