"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    Divider,
    Typography,
} from "@mui/material";
import {
    HomeRepairService,
    Build,
    Mail,
    Language,
    Cached,
} from "@mui/icons-material";

import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { TabList } from '@mui/lab'

import InfoIcon from '@mui/icons-material/Info'
import { Grid } from "@mui/system";
import DialogCloseButton from "@/components/dialogs/DialogCloseButton";
import ApplicationEditor from "./components/ApplicationEditor";
import ApplicationDataService from "@/services/applicationData/applicationDataService";

const settingsItems = [
    {
        id: 1,
        title: "Vendor Application",
        name: "vendor",
        description: "Manage and configure vendor application pages.",
        icon: <HomeRepairService className="text-gray-600" />,
    },
    {
        id: 2,
        title: "User Application",
        name: "user",
        description: "Manage and configure user application pages.",
        icon: <Mail className="text-gray-600" />,
    },
    {
        id: 3,
        title: "Event Application",
        name: "event",
        description: "Manage and configure event application pages.",
        icon: <Language className="text-gray-600" />,
    },
    {
        id: 4,
        title: "Scanner Application",
        name: "scanner",
        description: "Manage and configure scanner application pages.",
        icon: <Cached className="text-gray-600" />,
    },
    {
        id: 5,
        title: "Spiritual Application",
        name: "spiritual",
        description: "Manage and configure spiritual application pages.",
        icon: <Build className="text-gray-600" />,
    },

];

export default function ApplicationsSetting() {
    const [selectedSetting, setSelectedSetting] = useState(null);
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);



    const [value, setValue] = useState('1')
    const [propData, setPropData] = useState({
        appName: "", pageName: ""
    })

    const [html, setHtml] = useState("")

    const handleOpen = (item) => {
        setSelectedSetting(item);
        setSettingsModalOpen(true);
        setPropData({ ...propData, pageName: "about_us" })
        setValue('1')

    };

    const handleChange = (event, newValue) => {
        setValue(newValue)
        if (newValue === '1') {
            setPropData({ ...propData, pageName: "about_us" })
        } else if (newValue === '2') {
            setPropData({ ...propData, pageName: "privacy_policy" })
        } else if (newValue === '3') {
            setPropData({ ...propData, pageName: "terms_conditions" })
        } else if (newValue === '4') {
            setPropData({ ...propData, pageName: "licenses" })
        }
    }

    const tabSx = {
        // minWidth: 160,
        // textTransform: 'none',
        // whiteSpace: 'nowrap',
        // textAlign: 'left',
        // padding: '6px 16px',
        // justifyContent: 'flex-start'
    }

    console.log('propData:', propData);

    const handleUpdate = async () => {
        const { appName, pageName } = propData;
        const ress = await ApplicationDataService.updateData(appName, pageName, { content: html });
        console.log('Update response:', ress);

    }



    return (
        <Card className="p-6">
            <Typography className="text-xl font-semibold">
                Application Setting
            </Typography>
            <Divider />
            <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4 ">
                {settingsItems.map((item) => (
                    <Grid
                        key={item.id}
                        className="cursor-pointer rounded-xl transition-transform duration-500 delay-100 ease-out hover:scale-[1.01] hover:shadow-lg hover:bg-gray-50 "
                        onClick={() => { handleOpen(item); setPropData({ ...propData, appName: item.name, pageName: "about_us" }) }}
                    >
                        <CardContent className="flex items-start gap-3 p-4">
                            <div className="p-3  rounded-lg ">
                                {item.icon}
                            </div>
                            <div>
                                <Typography
                                    variant="h6"
                                    className="font-semibold text-base transition-colors duration-300 "
                                    sx={{ color: "primary.main" }}
                                >
                                    {item.title}
                                </Typography>
                                <Typography className="text-sm ">
                                    {item.description}
                                </Typography>
                            </div>
                        </CardContent>
                    </Grid>
                ))}
            </Grid>

            {/* Modal */}
            <Dialog
                fullWidth
                open={settingsModalOpen}
                maxWidth="md"
                scroll="body"
                sx={{ "& .MuiDialog-paper": { overflow: "visible" } }}
            >
                <DialogCloseButton onClick={() => setSettingsModalOpen(false)} disableRipple>
                    <i className='tabler-x' />
                </DialogCloseButton>
                <DialogTitle className="text-center">
                    {selectedSetting?.title}
                </DialogTitle>

                <CardContent>
                    <TabContext value={value}>
                        <TabList
                            variant='fullWidth'
                            scrollButtons='auto'
                            onChange={handleChange}
                            className="mb-4 w-full flex flex-row"
                            aria-label='customized tabs example'
                        >
                            <Tab icon={<InfoIcon />} label='About Us' value='1' sx={tabSx} iconPosition='start' />
                            <Tab icon={<InfoIcon />} label='Privacy Policy' value='2' sx={tabSx} iconPosition='start' />
                            <Tab icon={<InfoIcon />} label='Terms & Conditions' value='3' sx={tabSx} iconPosition='start' />
                            <Tab icon={<InfoIcon />} label='Licenses' value='4' sx={tabSx} iconPosition='start' />
                        </TabList>
                        <TabPanel value='1' sx={{ width: '100%' }}>
                            <ApplicationEditor html={html} setHtml={setHtml} appName={propData.appName} pageName={propData.pageName} handleSubmit={() => handleUpdate()} />
                        </TabPanel>
                        <TabPanel value='2' sx={{ width: '100%' }}>
                            <ApplicationEditor html={html} setHtml={setHtml} appName={propData.appName} pageName={propData.pageName} handleSubmit={() => handleUpdate()} />
                        </TabPanel>
                        <TabPanel value='3' sx={{ width: '100%' }}>
                            <ApplicationEditor html={html} setHtml={setHtml} appName={propData.appName} pageName={propData.pageName} handleSubmit={() => handleUpdate()} />
                        </TabPanel>
                        <TabPanel value='4' sx={{ width: '100%' }}>
                            <ApplicationEditor html={html} setHtml={setHtml} appName={propData.appName} pageName={propData.pageName} handleSubmit={() => handleUpdate()} />
                        </TabPanel>
                    </TabContext>
                </CardContent>
            </Dialog>
        </Card>
    );
}
