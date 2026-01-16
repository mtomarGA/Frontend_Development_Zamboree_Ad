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
    Construction,
    Handyman,
    Mail,
    Language,
    Cached,
    Image,
    Brush,
    TableChart,
    PrecisionManufacturing,
    Email,
} from "@mui/icons-material";
import { Grid } from "@mui/system";
import DialogCloseButton from "@/components/dialogs/DialogCloseButton";
import GSTForm from "@/components/dialogs/settings/premiumSettings/GstSettings_dialogs";
import GSTToggle from "@/components/dialogs/settings/premiumSettings/GstSettings_dialogs";
import SystemSupport from "@/components/dialogs/settings/commonSettings/SystemSupport";
import AiSettings from "@/components/dialogs/settings/premiumSettings/AISetting";

const settingsItems = [
    {
        id: 1,
        title: "Good Service Text (GST)",
        description: "Control and update all Good Service Text (GST) options in one place.",
        icon: <HomeRepairService className="text-gray-600" />,
    },
    {
        id: 2,
        title: "Email rules",
        description: "Configure email rules for validation",
        icon: <Mail className="text-gray-600" />,
    },
    {
        id: 3,
        title: "Artificial Intelligence",
        description: "Leverage AI-powered solutions to automate processes, enhance decision-making, and deliver smarter, faster customer experiences.",
        icon: <PrecisionManufacturing className="text-gray-600" />,
    },
    {
        id: 4,
        title: "Cache",
        description: "Configure caching for optimized speed",
        icon: <Cached className="text-gray-600" />,
    }
   
];

export default function PremiumListingSettings() {
    const [selectedSetting, setSelectedSetting] = useState(null);
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);

    const handleOpen = (item) => {
        setSelectedSetting(item);
        setSettingsModalOpen(true);
    };

    return (
        <Card className="p-6">

            <Typography className="text-xl font-semibold">
                Premium Listing Settings
            </Typography>
            <Divider />
            <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4 ">
                {settingsItems.map((item) => (
                    <Grid
                        key={item.id}
                        className="cursor-pointer rounded-xl transition-transform duration-500 delay-100 ease-out hover:scale-[1.01] hover:shadow-lg hover:bg-gray-50"
                        onClick={() => handleOpen(item)}
                    >
                        <CardContent className="flex items-start gap-3 p-4">
                            <div className="p-3 bg-gray-100 rounded-lg text-gray-600">
                                {item.icon}
                            </div>
                            <div>
                                <Typography
                                    variant="h6"
                                    className="font-semibold text-base transition-colors duration-300"
                                    sx={{ color: "primary.main" }}
                                >
                                    {item.title}
                                </Typography>
                                <Typography className="text-sm text-gray-500">
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
                    {selectedSetting?.id === 1 && (
                        <GSTToggle setSettingsModalOpen={setSettingsModalOpen} />
                    )}
                    {selectedSetting?.id === 2 && (
                        <Typography>Email Rules Configurations...</Typography>
                    )}
                    {selectedSetting?.id === 3 && (
                        <AiSettings setSettingsModalOpen={setSettingsModalOpen} run={true} />
                    )}
                </CardContent>
            </Dialog>
        </Card>
    );
}
