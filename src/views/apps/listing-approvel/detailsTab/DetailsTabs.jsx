import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { useRouter } from "next/router";

const InvoiceTabs = () => {
  const router = useRouter();

  const tabs = [
    { label: "Invoice", path: "/invoice" },
    { label: "Child Invoices", path: "/invoice/child-invoices" },
    { label: "Tasks", path: "/invoice/tasks" },
    { label: "Activity Log", path: "/invoice/activity-log" },
    { label: "Reminders", path: "/invoice/reminders" },
    { label: "Notes", path: "/invoice/notes" },
  ];

  const currentPath = router.pathname;
  const activeIndex = tabs.findIndex((tab) => tab.path === currentPath);

  const handleChange = (event, newValue) => {
    router.push(tabs[newValue].path);
  };

  return (
    <Box className="bg-white shadow-sm rounded-lg border border-gray-200">
      <Tabs
        value={activeIndex === -1 ? 0 : activeIndex}
        onChange={handleChange}
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          "& .MuiTabs-flexContainer": { flexWrap: "wrap" },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.path}
            label={tab.label}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              fontSize: "14px",
              color: "#555",
              "&.Mui-selected": {
                color: "#1976d2",
                fontWeight: 600,
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default InvoiceTabs;
