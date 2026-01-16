"use client";

import { useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { Settings, Mail, Language, Cached, Build, Image, Brush, TableChart, Map, Email, Link, Api, Public } from "@mui/icons-material";
import { Grid } from "@mui/system";
import CommonSettings from "./settingsPages/CommonSettings";
import PremiumListingSettings from "./settingsPages/PremiumListingSetting";
import ApplicationsSetting from "./settingsPages/ApplicationsSetting";
import { useAuth } from "@/contexts/AuthContext";
// import SettingsModal from "@/components/SettingsModal";



export default function SettingsViews() {
    const [selectedSetting, setSelectedSetting] = useState(null);
    const { hasPermission } = useAuth();

    return (
        <Grid className="flex flex-col gap-5">
            <CommonSettings />
            <PremiumListingSettings/>
           { hasPermission("settings_application_settings:view") && <ApplicationsSetting/> }
        </Grid>
    );
}
