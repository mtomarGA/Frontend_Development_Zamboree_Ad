import React from "react";
// import InvoiceTabs from "@/components/InvoiceTabs";
import { Box, Typography } from "@mui/material";

const Reminders = () => {
  return (
    <Box className="p-6  min-h-screen">
      {/* <InvoiceTabs /> */}
      <Box className=" p-6 mt-4 rounded-lg shadow-sm border border-gray-200">
        <Typography variant="h6">Tasks</Typography>
        <Typography variant="body2" className="mt-2 ">
          Tasks related to this invoice are shown here.
        </Typography>
      </Box>
    </Box>
  );
};

export default Reminders;
