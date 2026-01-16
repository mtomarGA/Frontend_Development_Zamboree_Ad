import React, { useEffect, useState } from "react";
import CustomTextField from "@/@core/components/mui/TextField";
import { Button, InputAdornment, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { Grid } from "@mui/system";
import AIService from "@/services/ai.service/Artificial.service";
import { toast } from "react-toastify";


const AiSettings = ({ setSettingsModalOpen, run }) => {
  // default active gamini
  const [activeProvider, setActiveProvider] = useState("gamini");

  const [gaminiData, setGaminiData] = useState({ apiAI: "", aiKey: "" });
  const [chatgptData, setChatgptData] = useState({ apiAI: "", aiKey: "" });
  const [isEditable, setIsEditable] = useState(false);
  const [isEditAPI, setIsEditisEditAPI] = useState(false);
  const isEditMode = false;

  const handleSubmit = async () => {
    try {


      const result = await AIService.addAIService({
        gamini: gaminiData,
        chatgpt: chatgptData,
        activeProvider,
      });

      toast.success(result.message || "AI settings saved!");
      await getAIServices();
      setSettingsModalOpen(false);
    } catch (err) {
      toast.error("Failed to save AI settings");
    }
  };
  const getAIServices = async () => {
    const result = await AIService.getAIService();
    const aiData = result?.data?.data?.[0];


    if (aiData) {
      setGaminiData({
        apiAI: aiData?.gamini?.apiAI || "",
        aiKey: aiData?.gamini?.aiKey || "",
      });

      setChatgptData({
        apiAI: aiData?.chatgpt?.apiAI || "",
        aiKey: aiData?.chatgpt?.aiKey || "",
      });

      const activeProvider = aiData?.gamini?.active
        ? "gamini"
        : aiData?.chatgpt?.active
          ? "chatgpt"
          : "gamini"; // fallback
      setActiveProvider(activeProvider);
    }
  };


  useEffect(() => {
    getAIServices();
  }, [run]);

  return (
    <Grid container spacing={3}>
      {/* Toggle to select which one is active */}
      <Grid item xs={12} md={12}>
        <ToggleButtonGroup
          value={activeProvider}
          exclusive
          onChange={(e, newProvider) => {
            if (newProvider !== null) setActiveProvider(newProvider);
          }}
        >
          <ToggleButton
            value="gamini"
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            }}
          >
            Gamini AI Active
          </ToggleButton>

          <ToggleButton
            value="chatgpt"
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            }}
          >
            ChatGPT Active
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>


      {/* Gamini AI Section */}
      <Grid size={{ xs: 12, md: 12 }}>
        <h3>Gamini AI</h3>
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <CustomTextField
          fullWidth
          label="Gamini API AI"
          value={gaminiData.apiAI}
          onChange={(e) =>
            setGaminiData({ ...gaminiData, apiAI: e.target.value })
          }
          disabled={!isEditAPI}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title={isEditAPI ? "Lock" : "Edit"} placement="top">
                  <i className="tabler-edit text-xl cursor-pointer" onClick={() => setIsEditisEditAPI(!isEditAPI)} />
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 12 }}>
        <CustomTextField
          fullWidth
          label="Gamini AI Key"
          value={gaminiData.aiKey}
          onChange={(e) =>
            setGaminiData({ ...gaminiData, aiKey: e.target.value })
          }
          disabled={!isEditable} // controlled by state
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title={isEditable ? "Lock" : "Edit"} placement="top">
                  <i
                    className="tabler-edit text-xl cursor-pointer"
                    onClick={() => setIsEditable(!isEditable)}
                  />
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
      </Grid>


      {/* ChatGPT Section */}
      <Grid size={{ xs: 12, md: 12 }}>
        <h3>ChatGPT</h3>
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <CustomTextField
          fullWidth
          label="ChatGPT API AI"
          value={chatgptData.apiAI}
          onChange={(e) =>
            setChatgptData({ ...chatgptData, apiAI: e.target.value })
          }
          disabled={isEditMode}

        />
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <CustomTextField
          fullWidth
          label="ChatGPT AI Key"
          value={chatgptData.aiKey}
          onChange={(e) =>
            setChatgptData({ ...chatgptData, aiKey: e.target.value })
          }
          disabled={isEditMode}
        />
      </Grid>

      {/* Submit Button */}
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          disabled={isEditMode}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};

export default AiSettings;
