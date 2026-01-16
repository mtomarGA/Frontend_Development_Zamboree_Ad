import CustomTextField from "@/@core/components/mui/TextField"
import { Button, Card, CardContent, Typography } from "@mui/material"
import Grid from "@mui/material/Grid2" // ✅ Use Grid2 from unstable package
import { useState } from "react"
import { toast } from "react-toastify"
import ReactionService from "@/services/posts/reaction.service"
import EmojiPicker from "emoji-picker-react"
import Box from "@mui/material/Box"

const EditReaction = ({ getData, onsuccess, EditSelectedReaction }) => {
  const [formData, setFormData] = useState({
    name: EditSelectedReaction?.name || "",
    icons: EditSelectedReaction?.icons || "",
    status: "APPROVED",
  })

  const [errors, setErrors] = useState({
    name: "",
    icons: "",
  })

  const validateForm = () => {
    const newErrors = {}
    const { name, icons } = formData

    if (!name) newErrors.name = "Reaction Name is required"
    if (!icons) newErrors.icons = "Reaction Icon is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const reactionId = EditSelectedReaction?._id
        const response = await ReactionService.updatedReaction(reactionId, formData)
        onsuccess(false)
        getData()
        toast.success(response.message)
      } catch (error) {
        console.error("Error updating reaction:", error)
        toast.error("An error occurred while updating.")
      }
    } else {
      toast.error("Please fix the errors.")
    }
  }

  return (
    <Card className="shadow-none">
      <CardContent>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Edit Reaction
        </Typography>

        <Grid container spacing={6}>
          {/* Name Field */}
          <Grid size={{xs:12 ,md:6}}>
            <CustomTextField
              fullWidth
              label="Reaction Name"
              placeholder="Enter Reaction Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          {/* Status Field */}
          <Grid size={{xs:12 ,md:6}}>
            <CustomTextField
              fullWidth
              label="Status"
              value={formData.status}
              disabled
            />
          </Grid>
          {/* Icon Field */}
          <Grid size={{xs:12 ,md:12}}>
            <CustomTextField
              fullWidth
              label="Reaction Icons"
              placeholder="Enter Reaction Icons"
              value={formData.icons}
              onChange={(e) =>
                setFormData({ ...formData, icons: e.target.value })
              }
              error={!!errors.icons}
              helperText={errors.icons}
            />
            <Box mt={2}>
              <EmojiPicker
                width={"100%"}
                onEmojiClick={(emojiData) =>
                  setFormData({
                    ...formData,
                    icons: formData.icons + emojiData.emoji,
                  })
                }
              />
            </Box>
          </Grid>



          {/* Submit Button */}
          <Grid size={{xs:12 ,md:12}} sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="medium"
              fullWidth
              onClick={handleSubmit}
            >
              Update Reaction
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default EditReaction
