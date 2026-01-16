'use client'

// React + MUI imports
import { useState } from 'react'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import Grid from '@mui/material/Grid2'

import Vendor from "./Vendor"

const FollowUpsTab = () => {
  const [subTab, setSubTab] = useState('meeting')

  const handleChange = (event, newValue) => {
    setSubTab(newValue)
  }

  return (
    <TabContext value={subTab}>
      <Grid container spacing={6}>
        {/* <Grid size={{ xs: 12 }}>
          <TabList onChange={handleChange} aria-label="Follow Ups Sub Tabs" variant="scrollable">
            <Tab label='Vendor' icon={<i className='tabler-calendar' />} iconPosition='start' value="vendor" />
          </TabList>
        </Grid> */}
        <Grid size={{ xs: 12 }}>
          <TabPanel value="meeting">
            <Vendor />
          </TabPanel>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default FollowUpsTab
