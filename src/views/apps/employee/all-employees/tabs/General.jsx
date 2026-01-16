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
import BasicEmployeeForm from './sections/BasicEmployeeForm'
import SecurityForm from './sections/SecurityForm'
import DocumentTypeForm from './sections/DocumentTypeForm'
import { useEmployeeFormContext } from '@/contexts/EmployeeFormContext'
import BankFormData from './sections/BankFormData'
import EmailConfigForm from './sections/EmailConfig'
import AllowLeaveType from './sections/AllowLeaveType'

// MUI Icons
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import EmailIcon from '@mui/icons-material/Email'
import SecurityIcon from '@mui/icons-material/Security'
import DescriptionIcon from '@mui/icons-material/Description'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import TodayIcon from '@mui/icons-material/Today';

const GeneralTab = ({ handleAddView }) => {
    // States
    const [value, setValue] = useState('1')

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }
    const { handleSubmit, isEditMode, tabManagement, setTabManagement } = useEmployeeFormContext();




    // Common styles for tabs
    const tabSx = {
        minWidth: 160,
        textTransform: 'none',
        whiteSpace: 'nowrap',
        textAlign: 'left',
        padding: '6px 16px',
        justifyContent: 'flex-start'
    }

    // ** Hooks
    const theme = useTheme()
    const isBelowLg = useMediaQuery(theme.breakpoints.down('lg'))

    return (
        <Box sx={{ p: 4 }}>

            <TabContext value={value}>
                <div className={isBelowLg ? '' : 'flex'}>
                    <CustomTabList
                        pill='true'
                        orientation={isBelowLg ? 'horizontal' : 'vertical'}
                        variant='scrollable'
                        scrollButtons='auto'
                        onChange={handleChange}
                        aria-label='customized tabs example'
                        sx={{ borderBottom: isBelowLg ? 1 : 0, borderRight: isBelowLg ? 0 : 1, borderColor: 'divider' }}
                    >
                        <Tab icon={<AssignmentIndIcon />} label='Basic' value='1' sx={tabSx} iconPosition='start' disabled={!tabManagement.General.basic} />
                        <Tab icon={<SecurityIcon />} label='Security' value='2' sx={tabSx} iconPosition='start' disabled={!tabManagement.General.security} />
                        <Tab icon={<DescriptionIcon />} label='Document' value='3' sx={tabSx} iconPosition='start' disabled={!tabManagement.General.document} />
                        <Tab icon={<AccountBalanceIcon />} label='Bank Account' value='4' sx={tabSx} iconPosition='start' disabled={!tabManagement.General.bank} />
                        <Tab icon={<EmailIcon />} label='Email Config' value='5' sx={tabSx} iconPosition='start' disabled={!tabManagement.General.email_configuration} />
                        <Tab icon={<TodayIcon />} label='Provide Leave' value='6' sx={tabSx} iconPosition='start' disabled={!tabManagement.General.leave} />
                    </CustomTabList>
                    <TabPanel value='1' sx={{ width: '100%' }}>
                        <BasicEmployeeForm handleCancel={handleAddView} nextHandle={() => setValue('2')} />
                    </TabPanel>
                    <TabPanel value='2' sx={{ width: '100%' }}>
                        <SecurityForm handleCancel={handleAddView} nextHandle={() => setValue('3')} />
                    </TabPanel>
                    <TabPanel value='3' sx={{ width: '100%' }}>
                        <DocumentTypeForm handleCancel={handleAddView} nextHandle={() => setValue('4')} />
                    </TabPanel>
                    <TabPanel value='4' sx={{ width: '100%' }}>
                        <BankFormData handleCancel={handleAddView} nextHandle={() => setValue('5')} />
                    </TabPanel>
                    <TabPanel value='5' sx={{ width: '100%' }}>
                        <EmailConfigForm handleCancel={handleAddView} nextHandle={() => setValue('6')} />
                    </TabPanel>
                    <TabPanel value='6' sx={{ width: '100%' }}>
                        <AllowLeaveType handleCancel={handleAddView} nextHandle={() => setValue('7')} />
                    </TabPanel>
                </div>
                {value == '6' && <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
                    <Button className='flex justify-end' variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 5 }} >{isEditMode ? 'Update Employee' : 'Create Employee'}</Button>
                </Box>}
            </TabContext>
        </Box>
    )
}

export default GeneralTab
