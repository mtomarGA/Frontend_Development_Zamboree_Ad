'use client'

// React + MUI imports
import { useState } from 'react'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import Grid from '@mui/material/Grid2'

import GetBusiness from './GetBusiness'
import GetProduct from "./GetProduct"
import SendBusiness from "./SendBusiness"
import SendProduct from "./SendProduct"

const FollowUpsTab = () => {
  const [subTab, setSubTab] = useState('getBusiness')

  const handleChange = (event, newValue) => {
    setSubTab(newValue)
  }

  return (
    <TabContext value={subTab}>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <TabList onChange={handleChange} aria-label="Follow Ups Sub Tabs" variant="scrollable">
            <Tab label='Get Business Enquiry' icon={<i className='tabler-building-skyscraper' />} iconPosition='start' value="getBusiness" />
            <Tab label="Get Product Enquiry" icon={<i className='tabler-package' />} iconPosition='start' value="getProduct" />
            {/* <Tab label="Send Business Enquiry" icon={<i className='tabler-briefcase' />} iconPosition='start' value="sendBusiness" />
            <Tab label="Send Product Enquiry" icon={<i className='tabler-box' />} iconPosition='start' value="sendProduct" /> */}
          </TabList>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TabPanel value="getBusiness">
            <GetBusiness />
          </TabPanel>
          <TabPanel value="getProduct">
            <GetProduct />
          </TabPanel>
          {/* <TabPanel value="sendBusiness">
            <SendBusiness />
          </TabPanel>
          <TabPanel value="sendProduct">
            <SendProduct />
          </TabPanel> */}
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default FollowUpsTab
