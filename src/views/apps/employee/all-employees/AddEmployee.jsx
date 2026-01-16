'use client'
// React Imports

import { useState } from 'react'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'
import { Box, Button, useMediaQuery, useTheme } from '@mui/material'
import { TabList } from '@mui/lab'
import GeneralTab from './tabs/General'
import { EmployeeFormProvider, useEmployeeFormContext } from '@/contexts/EmployeeFormContext'
// import BasicEmployeeForm from './BasicEmployeeForm'

// MUI Icons
import PersonIcon from '@mui/icons-material/Person'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import BeachAccessIcon from '@mui/icons-material/BeachAccess'
import GroupWorkIcon from '@mui/icons-material/GroupWork'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import EventBusyIcon from '@mui/icons-material/EventBusy'

const AddEmployee = ({ handleAddView }) => {
    // States
    const [value, setValue] = useState('1')

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    // Common styles for tabs
    const tabSx = {
        // minWidth: 160,
        // textTransform: 'none',
        // whiteSpace: 'nowrap',
        // textAlign: 'left',
        // padding: '6px 16px',
        // justifyContent: 'flex-start'
    }

    // ** Hooks
    const theme = useTheme()
    const isBelowLg = useMediaQuery(theme.breakpoints.down('lg'))

    return (
        // <EmployeeFormProvider onSuccess={handleAddView} >
        <TabContext value={value}>
            {/* <div className={isBelowLg ? '' : 'flex'}> */}
            <TabList
                //   pill='true'
                //   orientation={isBelowLg ? 'horizontal' : 'vertical'}
                variant='scrollable'
                scrollButtons='auto'
                onChange={handleChange}
                aria-label='customized tabs example'
            // sx={{ borderBottom: isBelowLg ? 1 : 0, borderRight: isBelowLg ? 0 : 1, borderColor: 'divider' }}
            >
                <Tab icon={<PersonIcon />} label='General' value='1' sx={tabSx}  iconPosition='start'/>
                <Tab icon={<AccountBoxIcon />} label='Profile' value='2' sx={tabSx}  iconPosition='start'/>
                <Tab icon={<MonetizationOnIcon />} label='Set Salary' value='3' sx={tabSx}  iconPosition='start'/>
                <Tab icon={<BeachAccessIcon />} label='Leave' value='4' sx={tabSx}  iconPosition='start'/>
                <Tab icon={<GroupWorkIcon />} label='Core HR' value='5' sx={tabSx}  iconPosition='start'/>
                <Tab icon={<ReceiptLongIcon />} label='Pay Slip' value='6' sx={tabSx}  iconPosition='start'/>
                <Tab icon={<EventBusyIcon />} label='Remaining Leave' value='7' sx={tabSx}  iconPosition='start'/>
            </TabList>
            <TabPanel value='1' sx={{ width: '100%' }}>
                <GeneralTab handleAddView={handleAddView} />
            </TabPanel>
            <TabPanel value='2' sx={{ width: '100%' }}>
                <h1>tab 1</h1>
            </TabPanel>
            <TabPanel value='3' sx={{ width: '100%' }}>
                <h1>tab 2</h1>
            </TabPanel>
            <TabPanel value='4' sx={{ width: '100%' }}>
                <h1>tab 3</h1>
            </TabPanel>
            <TabPanel value='5' sx={{ width: '100%' }}>
                <h1>tab 4</h1>
            </TabPanel>
            <TabPanel value='6' sx={{ width: '100%' }}>
                <h1>tab 5</h1>
            </TabPanel>
            <TabPanel value='7' sx={{ width: '100%' }}>
                <h1>tab 6</h1>
            </TabPanel>
            {/* </div> */}
        </TabContext>

    )
}

export default AddEmployee
