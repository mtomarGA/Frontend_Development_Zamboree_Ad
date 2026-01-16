"use client"

import { useState } from "react"

// MUI Imports
import Tab from "@mui/material/Tab"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"
import TabContext from "@mui/lab/TabContext"
import Typography from "@mui/material/Typography"
import PlanBenefitsList from "../PlanBenifitsList"
import Faqs from "../Faqs"



const Master = () => {
  const [value, setValue] = useState("1")

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>


      <TabList
        variant="fullWidth"
        onChange={handleChange}
        aria-label="full width tabs example"
      >
        <Tab value="1" label="Terms & Conditions" />
        <Tab value="2" label="How To Redeem" />
      </TabList>

      <TabPanel value="1">
        <Faqs />
      </TabPanel>

      <TabPanel value="2">
        <PlanBenefitsList />
      </TabPanel>

      <TabPanel value="3">
        <Typography>
          Danish tiramisu jujubes cupcake chocolate bar cake cheesecake chupa
          chups. Macaroon ice cream tootsie roll carrot cake gummi bears.
        </Typography>
      </TabPanel>
    </TabContext>
  )
}

export default Master
