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

const AddProductPage = ({ tabContentList }) => {
    const [activeTab, setActiveTab] = useState('pendingProduct')

    const handleChange = (event, value) => {
        setActiveTab(value)
    }

    return (
        <TabContext value={activeTab}>
            <Grid container spacing={6}>
                <Grid size={{ xs: 12 }}>
                    <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
                        <Tab label='Product Group' icon={<i className='tabler-category-plus' />} iconPosition='start' value='pendingProduct' />
                        <Tab label='All Product' icon={<i className='tabler-settings' />} iconPosition='start' value='addProduct' />
                        <Tab label='Rejected Product' icon={<i className="tabler-ban" />} iconPosition='start' value='rejectedProduct' />
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

export default AddProductPage
