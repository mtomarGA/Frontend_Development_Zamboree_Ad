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
  Settings,
  Mail,
  Language,
  Cached,
  Build,
  Image,
  Brush,
  TableChart,
  Map,
  Email,
  Payment,
  Message,
  PrecisionManufacturing
} from "@mui/icons-material";
import { Grid } from "@mui/system";
import DialogCloseButton from "@/components/dialogs/DialogCloseButton";
import SmsSettings from "@/components/dialogs/settings/commonSettings/SMS_Activation";
import PaymentSettings from "@/components/dialogs/settings/commonSettings/PaymentGateway";
import SystemSupport from "@/components/dialogs/settings/commonSettings/SystemSupport";
import Index from '@/views/apps/invoice_setting/index.jsx'
import { InvoiceSettingProvider } from "@/contexts/invoiceSetting/SettingContextService";


const settingsItems = [
  {
    id: 1,
    title: "SMS Activation",
    description: "Enable and manage SMS activation settings for your account",
    icon: <Message className="text-gray-600" />,
  },

  {
    id: 2,
    title: "Payment Gateway",
    description: "Manage and configure payment gateway settings",
    icon: <Payment className="text-gray-600" />,
  },

  {
    id: 3,
    title: "System Setting",
    description: "Leverage AI-powered solutions to automate processes, enhance decision-making, and deliver smarter, faster customer experiences.",
    icon: <PrecisionManufacturing className="text-gray-600" />,
  },

  {
    id: 4,
    title: "Invoice Settings",
    description: "Company Information",
    icon: <Cached className="text-gray-600" />,
  },
  {
    id: 5,
    title: "Optimize",
    description: "Minify HTML output, inline CSS, remove comments...",
    icon: <Build className="text-gray-600" />,
  }

];

export default function CommonSettings() {
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const handleOpen = (item) => {
    setSelectedSetting(item);
    setSettingsModalOpen(true);
  };

  const handleClose = () => {
    setSelectedSetting(null);
    setSettingsModalOpen(false);
  };

  return (
    <Card className="p-6">

      <Typography className="text-xl font-semibold">
        Common Settings
      </Typography>
      <Divider />
      <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
        {settingsItems.map((item) => (
          <Grid
            key={item.id}
            className="cursor-pointer rounded-xl transition-transform duration-500 delay-100 ease-out hover:scale-[1.01] hover:shadow-lg hover:bg-gray-50"
            onClick={() => handleOpen(item)}
          >
            <CardContent className="flex items-start gap-3 p-4">
              <div className="p-3 bg-gray-100 rounded-lg text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
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

      {/* Settings Modal */}
      <Dialog
        fullWidth
        open={settingsModalOpen}
        maxWidth="lg"
        scroll="body"
        onClose={handleClose}
        sx={{ "& .MuiDialog-paper": { overflow: "visible" } }}
      >
        <DialogCloseButton onClick={handleClose} disableRipple>
          <i className="tabler-x" />
        </DialogCloseButton>
        <DialogTitle className="text-center">
          {selectedSetting?.title}
        </DialogTitle>

        <CardContent>
          {selectedSetting?.id === 1 && <SmsSettings onClose={handleClose} />}
          {selectedSetting?.id === 2 && (
            <PaymentSettings />
          )}
          {selectedSetting?.id === 3 && (
            "ssdsdd"
          )}
          {selectedSetting?.id === 4 && (
            <InvoiceSettingProvider>

              <Index />
            </InvoiceSettingProvider>

          )}
          {selectedSetting?.id === 5 && (
            <Typography>Language Management Settings...</Typography>
          )}
        </CardContent>
      </Dialog>
    </Card>
  );
}
