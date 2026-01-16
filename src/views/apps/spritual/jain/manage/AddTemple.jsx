'use client'
// React Imports

import { useState } from 'react'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

// Component Imports
import { useMediaQuery, useTheme } from '@mui/material'
import { TabList } from '@mui/lab'
import Timing from './tabs/Timing'
import SocialMedia from './tabs/SocialMedia'
import Overview from './tabs/Overview'
import Gallery from './tabs/Gallery'
import DonationList from './tabs/DonationList'
import Security from './tabs/Security'
// import BasicEmployeeForm from './BasicEmployeeForm'

// MUI Icons
import InfoIcon from '@mui/icons-material/Info'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ShareIcon from '@mui/icons-material/Share'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'
import SecurityIcon from '@mui/icons-material/Security'
import { useJainism } from '@/contexts/JainFormContext'
import { useRouter } from 'next/navigation'

const AddJainTemple = ({ handleAddView }) => {
    // States
    const [value, setValue] = useState('1')

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }
    const { templeTabManager, setTempleTabManager } = useJainism()
    console.log('templeTabManager:', templeTabManager);



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
    const router = useRouter()
    const handleCancel = () => router.push(`/en/apps/spritual/jain/manage`)

    return (
        <TabContext value={value}>
            <TabList
                variant='scrollable'
                scrollButtons='auto'
                onChange={handleChange}
                aria-label='customized tabs example'
            >
                <Tab icon={<InfoIcon />} label='Overview' value='1' sx={tabSx} iconPosition='start' disabled={!templeTabManager.overview} />
                <Tab icon={<AccessTimeIcon />} label='Timings' value='2' sx={tabSx} iconPosition='start' disabled={!templeTabManager.timing} />
                <Tab icon={<ShareIcon />} label='Social Media' value='3' sx={tabSx} iconPosition='start' disabled={!templeTabManager.socialmedia} />
                <Tab icon={<PhotoLibraryIcon />} label='Gallery' value='4' sx={tabSx} iconPosition='start' disabled={!templeTabManager.gallery} />
                <Tab icon={<VolunteerActivismIcon />} label='Donation' value='5' sx={tabSx} iconPosition='start' disabled={!templeTabManager.donation} />
                <Tab icon={<SecurityIcon />} label='Security' value='6' sx={tabSx} iconPosition='start' disabled={!templeTabManager.security} />
            </TabList>
            <TabPanel value='1' sx={{ width: '100%' }}>
                <Overview handleCancel={handleCancel} nextHandle={() => setValue('2')} />
            </TabPanel>
            <TabPanel value='2' sx={{ width: '100%' }}>
                <Timing handleCancel={handleCancel} nextHandle={() => setValue('3')} />
            </TabPanel>
            <TabPanel value='3' sx={{ width: '100%' }}>
                <SocialMedia handleCancel={handleCancel} nextHandle={() => setValue('4')} />
            </TabPanel>
            <TabPanel value='4' sx={{ width: '100%' }}>
                <Gallery handleCancel={handleCancel} nextHandle={() => setValue('5')} />
            </TabPanel>
            <TabPanel value='5' sx={{ width: '100%' }}>
                <DonationList handleCancel={handleCancel} nextHandle={() => setValue('6')} />
            </TabPanel>
            <TabPanel value='6' sx={{ width: '100%' }}>
                <Security handleCancel={handleCancel} nextHandle={() => setValue('7')} />
            </TabPanel>
        </TabContext>

    )
}

export default AddJainTemple
