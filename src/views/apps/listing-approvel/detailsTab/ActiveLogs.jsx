import React from "react";

import { Box, Typography } from "@mui/material";

const ActiveLogs = () => {
  return (
    <Box className="p-6  min-h-screen">
    
      <Box className="mt-4 rounded-lg">
        <Typography variant="h6">Child Invoices</Typography>
        <Typography variant="body2" className="mt-2 ">
          Here you can manage child invoices related to the main invoice.
        </Typography>
      </Box>
    </Box>
  );
};

export default ActiveLogs;
