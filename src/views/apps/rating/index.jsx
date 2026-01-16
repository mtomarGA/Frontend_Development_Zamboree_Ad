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

const RatingPage = ({ tabContentList }) => {
    // States
    const [activeTab, setActiveTab] = useState('allRating')

    const handleChange = (event, value) => {
        setActiveTab(value)
    }

    return (
        <TabContext value={activeTab}>
            <Grid container spacing={6}>
                <Grid size={{ xs: 12 }}>
                    <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
                        <Tab label='All Ratings' icon={<i className='tabler-message-2-question' />} iconPosition='start' value='allRating' />
                        <Tab label='Pending Ratings' icon={<i className='tabler-parking-circle' />} iconPosition='start' value='pendingRating' />
                        <Tab label='Approved Ratings' icon={<i className="tabler-rosette-discount-check" />} iconPosition='start' value='doneRating'
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

export default RatingPage
