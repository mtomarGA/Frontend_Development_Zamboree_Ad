'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'

const EnquiryPage = ({ tabContentList }) => {
    // States
    const [activeTab, setActiveTab] = useState('allEnquiry')

    const handleChange = (event, value) => {
        setActiveTab(value)
    }

    return (
        <TabContext value={activeTab}>
            <Grid container spacing={6}>
                <Grid size={{ xs: 12 }}>
                    <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
                        <Tab label='All Enquiries' icon={<i className='tabler-message-2-question' />} iconPosition='start' value='allEnquiry' />
                        <Tab label='Pending Enquiries' icon={<i className='tabler-parking-circle' />} iconPosition='start' value='pendingEnquiry' />
                        <Tab label='Done Enquiries' icon={<i className="tabler-rosette-discount-check" />} iconPosition='start' value='doneEnquiry'
                        />
                    </CustomTabList>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TabPanel value={activeTab} className='p-0'>
                        {tabContentList[activeTab]}
                    </TabPanel>
                </Grid>
            </Grid>
        </TabContext>
    )
}

export default EnquiryPage
