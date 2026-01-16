"use client";

import { useState } from "react";
import { Card, CardContent, Switch, TextField, Button, Typography, MenuItem, Grid } from "@mui/material";

export default function SmsSettings() {
  // State for enabling providers
  const [nexmoEnabled, setNexmoEnabled] = useState(false);
  const [twilioEnabled, setTwilioEnabled] = useState(true);
  const [msg91Enabled, setMsg91Enabled] = useState(false);
  const [fast2smsEnabled, setFast2smsEnabled] = useState(false);

  // State for provider fields
  const [nexmo, setNexmo] = useState({ key: "", secret: "", senderId: "" });
  const [msg91, setMsg91] = useState({ apiToken: "", sid: "", url: "" });
  const [twilio, setTwilio] = useState({ sid: "", authToken: "", number: "", type: "WhatsApp" });
  const [fast2sms, setFast2sms] = useState({ authKey: "", entityId: "", route: "DLT Manual", language: "English", senderId: "" });

  // Helper to handle field changes
  const handleChange = (setter, field) => (e) => {
    setter(prev => ({ ...prev, [field]: e.target.value }));
  };

  // Save handler (demo)
  const handleSave = (provider, data) => {
    // Basic validation: all fields non-empty
    const emptyField = Object.values(data).some(val => val === "");
    if (emptyField) return alert("All fields are required!");
    console.log(`Saved ${provider}:`, data);
  };

  return (
    <div className="p-6">
      <Grid container spacing={3}>
        {/* Nexmo */}
        <Grid item xs={12} md={6}>
          <Card className="shadow-lg rounded-2xl">
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-bold">Nexmo</Typography>
                <Switch checked={nexmoEnabled} onChange={() => setNexmoEnabled(!nexmoEnabled)} />
              </div>
              <TextField
                fullWidth
                label="Nexmo Key"
                value={nexmo.key}
                onChange={handleChange(setNexmo, "key")}
                className="mb-3"
              />
              <TextField
                fullWidth
                label="Nexmo Secret"
                value={nexmo.secret}
                onChange={handleChange(setNexmo, "secret")}
                className="mb-3"
              />
              <TextField
                fullWidth
                label="Nexmo Sender ID"
                value={nexmo.senderId}
                onChange={handleChange(setNexmo, "senderId")}
                className="mb-3"
              />
              <Button
                variant="contained"
                color="primary"
                className="rounded-xl"
                onClick={() => handleSave("Nexmo", nexmo)}
              >
                Save
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Msg91 / SSL Wireless */}
        <Grid item xs={12} md={6}>
          <Card className="shadow-lg rounded-2xl">
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-bold">Msg91</Typography>
                <Switch checked={msg91Enabled} onChange={() => setMsg91Enabled(!msg91Enabled)} />
              </div>
              <TextField
                fullWidth
                label="API Token"
                value={msg91.apiToken}
                onChange={handleChange(setMsg91, "apiToken")}
                className="mb-3"
                required
              />
              <TextField
                fullWidth
                label="SID"
                value={msg91.sid}
                onChange={handleChange(setMsg91, "sid")}
                className="mb-3"
                required
              />
              <TextField
                fullWidth
                label="URL"
                value={msg91.url}
                onChange={handleChange(setMsg91, "url")}
                className="mb-3"
                required
              />
              <Button
                variant="contained"
                color="primary"
                className="rounded-xl"
                onClick={() => handleSave("Msg91", msg91)}
              >
                Save
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Twilio */}
        <Grid item xs={12} md={6}>
          <Card className="shadow-lg rounded-2xl">
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-bold">Twilio</Typography>
                <Switch checked={twilioEnabled} onChange={() => setTwilioEnabled(!twilioEnabled)} />
              </div>
              <TextField
                fullWidth
                label="Twilio SID"
                value={twilio.sid}
                onChange={handleChange(setTwilio, "sid")}
                className="mb-3"
              />
              <TextField
                fullWidth
                label="Auth Token"
                value={twilio.authToken}
                onChange={handleChange(setTwilio, "authToken")}
                className="mb-3"
              />
              <TextField
                fullWidth
                label="Valid Number"
                value={twilio.number}
                onChange={handleChange(setTwilio, "number")}
                className="mb-3"
              />
              <TextField
                select
                fullWidth
                label="Type"
                value={twilio.type}
                onChange={handleChange(setTwilio, "type")}
                className="mb-3"
              >
                <MenuItem value="WhatsApp">WhatsApp</MenuItem>
                <MenuItem value="SMS">SMS</MenuItem>
              </TextField>
              <Button
                variant="contained"
                color="primary"
                className="rounded-xl"
                onClick={() => handleSave("Twilio", twilio)}
              >
                Save
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Fast2SMS */}
        <Grid item xs={12} md={6}>
          <Card className="shadow-lg rounded-2xl">
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-bold">Fast2SMS</Typography>
                <Switch checked={fast2smsEnabled} onChange={() => setFast2smsEnabled(!fast2smsEnabled)} />
              </div>
              <TextField
                fullWidth
                label="Auth Key"
                value={fast2sms.authKey}
                onChange={handleChange(setFast2sms, "authKey")}
                className="mb-3"
              />
              <TextField
                fullWidth
                label="Entity ID"
                value={fast2sms.entityId}
                onChange={handleChange(setFast2sms, "entityId")}
                className="mb-3"
              />
              <TextField
                select
                fullWidth
                label="Route"
                value={fast2sms.route}
                onChange={handleChange(setFast2sms, "route")}
                className="mb-3"
              >
                <MenuItem value="DLT Manual">DLT Manual</MenuItem>
                <MenuItem value="Transactional Use">Transactional Use</MenuItem>
                <MenuItem value="Promotional Use">Promotional Use</MenuItem>
              </TextField>
              <TextField
                select
                fullWidth
                label="Language"
                value={fast2sms.language}
                onChange={handleChange(setFast2sms, "language")}
                className="mb-3"
              >
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Hindi">Hindi</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Sender ID"
                value={fast2sms.senderId}
                onChange={handleChange(setFast2sms, "senderId")}
                className="mb-3"
              />
              <Button
                variant="contained"
                color="primary"
                className="rounded-xl"
                onClick={() => handleSave("Fast2SMS", fast2sms)}
              >
                Save
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
