"use client";
import { useEffect, useState } from "react";
import {
  ToggleButtonGroup,
  ToggleButton,
  CardContent,
  Typography,
} from "@mui/material";
import { Grid } from "@mui/system";
import Gstext from "@/services/premium-listing/gst.service";
import { toast } from "react-toastify";
import GSTS from "@/services/premium-listing/gst.service";

export default function GSTOptions({ setSettingsModalOpen }) {
  const [gst, setGst] = useState("");
  const [data, setData] = useState([]);

  const handleChange = async (event, newValue) => {
    if (!newValue) return; // Prevent deselecting
    const payload = { GST: newValue };
    const result = await Gstext.updateGST(payload);
    await getGSt();
    toast.success(result.message);
    setSettingsModalOpen(false);
  };

  const getGSt = async () => {
    const result = await Gstext.getGSTValue();
    result.data.forEach((gstValus) => {
      setGst(gstValus?.GST?.toString() || "");
    });
  };

  const gstTextService = async () => {
    const res = await GSTS.getAllACTIVEGST();
    setData(res.data || []);
  };

  useEffect(() => {
    getGSt();
    gstTextService();
  }, []);

  // Map GST options properly
  const gstOptions = Array.isArray(data)
    ? data.map((pricePer) => ({
        value: pricePer.gstPrice?.toString(), // string for ToggleButtonGroup
        label: `${pricePer.gstPrice}%`,
        desc: pricePer.message,
      }))
    : [];

  return (
    <div className="flex justify-center items-center">
      <Grid className="w-full max-w-full">
        <Grid className="rounded-2xl transition-shadow duration-300">
          <CardContent className="p-6 w-full">
            <ToggleButtonGroup
              value={gst}
              exclusive
              onChange={handleChange}
              className="flex flex-wrap w-full gap-4"
            >
              {gstOptions.map((option) => (
                <ToggleButton
                  key={option.value}
                  value={option.value}
                  className="flex items-center justify-start px-6 py-4 rounded-xl w-[calc(50%-0.5rem)] text-left transition-transform duration-200"
                  sx={{
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "white",
                      boxShadow: 3,
                      transform: "scale(1.02)",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    },
                    "&:not(.Mui-selected)": {
                      bgcolor: "gray.400",
                      color: "white",
                    },
                  }}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-bold  ">{option.label}</span>
                    <span className="text-sm opacity-80">{option.desc}</span>
                  </div>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <Typography className="mt-6 text-center ">
              Selected GST:{" "}
              <span className="font-bold text-gray-800">{gst}%</span>
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
    </div>
  );
}
