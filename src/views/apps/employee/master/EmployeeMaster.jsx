'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { useMediaQuery, useTheme } from '@mui/material'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'
import BranchTab from './tabs/Branch'
import DesignationTab from './tabs/Destination'
import DepartmentTab from './tabs/Department'
import DocumentTypeTab from './tabs/DocumentType'

// Icon Imports
import StoreIcon from '@mui/icons-material/Store'
import BadgeIcon from '@mui/icons-material/Badge'
import ApartmentIcon from '@mui/icons-material/Apartment'
import DescriptionIcon from '@mui/icons-material/Description'

const EmployeeMaster = () => {
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const tabSx = {
    minWidth: 160,
    textTransform: 'none',
    whiteSpace: 'nowrap',
    textAlign: 'left',
    padding: '6px 16px',
    justifyContent: 'flex-start'
  }

  const theme = useTheme()
  const isBelowLg = useMediaQuery(theme.breakpoints.down('lg'))

  return (
    <TabContext value={value}>
      <div className={isBelowLg ? '' : 'flex'}>
        <CustomTabList
          pill='true'
          orientation={isBelowLg ? 'horizontal' : 'vertical'}
          variant='scrollable'
          scrollButtons='auto'
          onChange={handleChange}
          aria-label='customized tabs example'
        >
          <Tab
            value='1'
            label='Branch'
            icon={<StoreIcon fontSize='small' />}
            iconPosition='start'
            sx={tabSx}
          />
          <Tab
            value='2'
            label='Designation'
            icon={<BadgeIcon fontSize='small' />}
            iconPosition='start'
            sx={tabSx}
          />
          <Tab
            value='3'
            label='Department'
            icon={<ApartmentIcon fontSize='small' />}
            iconPosition='start'
            sx={tabSx}
          />
          <Tab
            value='4'
            label='Document Type'
            icon={<DescriptionIcon fontSize='small' />}
            iconPosition='start'
            sx={tabSx}
          />
        </CustomTabList>
        <TabPanel value='1' sx={{ width: '100%' }}>
          <BranchTab />
        </TabPanel>
        <TabPanel value='2' sx={{ width: '100%' }}>
          <DesignationTab />
        </TabPanel>
        <TabPanel value='3' sx={{ width: '100%' }}>
          <DepartmentTab />
        </TabPanel>
        <TabPanel value='4' sx={{ width: '100%' }}>
          <DocumentTypeTab />
        </TabPanel>
      </div>
    </TabContext>
  )
}

export default EmployeeMaster
