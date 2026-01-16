import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import BannerListing from "@/services/premium-listing/banner.service";
import PaidListing from "@/services/premium-listing/paidListing.service";
import FixedListing from "@/services/premium-listing/fixedListing.service";
import { toast } from "react-toastify";

const Notes = ({ selectedInvoice }) => {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [data, setData] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    if (!note.trim()) return toast.error("Note cannot be empty!");
    const Id = selectedInvoice?._id;
    const payload = { note };

    try {
      if (selectedInvoice?.type === "BANNER") {
        await BannerListing.addNotes(Id, payload);
      } else if (selectedInvoice?.type === "PAID_LISTING") {
        await PaidListing.addNotes(Id, payload);
      } else {
        await FixedListing.addNotes(Id, payload);
      }
      toast.success("Note added successfully!");
      setNote("");
      handleClose();
      getNotes();
    } catch (error) {
      toast.error("Failed to add note!");
    }
  };

  const getNotes = async () => {
    const Id = selectedInvoice?._id;
    if (!Id) return;

    let result;
    if (selectedInvoice?.type === "BANNER") {
      result = await BannerListing.getNotes(Id);
    } else if (selectedInvoice?.type === "PAID_LISTING") {
      result = await PaidListing.getNotes(Id);
    } else {
      result = await FixedListing.getNotes(Id);
    }
    setData(result?.data?.notes || []);

  };

  useEffect(() => {
    getNotes();
  }, [selectedInvoice]);

  return (
    <Box className="p-6 relative  min-h-screen">
      <Typography variant="h6" className="font-semibold mb-4">
        Notes
      </Typography>

      {/* Notes Section */}
      <Box className="space-y-4">
        {Array.isArray(data) && data.length > 0 ? (
          data.map((item, index) => (
            <Card
              key={index}
              className="rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <CardContent className="flex items-start gap-4">
                <Avatar
                  src={item.noteAddedBy?.image}
                  alt="profile"
                  sx={{ width: 45, height: 45 }}
                />
                <Box className="flex flex-col flex-grow">
                  {/* Header: Name + Employee ID/Admin */}
                  <Box className="flex justify-between items-start">
                    <Box>
                      <Typography variant="subtitle1" fontWeight="600">
                        {item.noteAddedBy?.firstName} {item.noteAddedBy?.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.noteAddedBy?.email}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      {item.noteAddedBy?.employee_id || "Admin"}
                    </Typography>
                  </Box>

                  <Divider className="my-2" />

                  <Box className="px-3 py-2 rounded-lg">
                    <Typography variant="body1" color="text.primary">
                      {item.note}
                    </Typography>
                  </Box>

                  {item.createdAt && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      className="mt-2 self-end"
                    >
                      {new Date(item.createdAt).toLocaleString()}
                    </Typography>
                  )}
                </Box>

              </CardContent>
            </Card>
          ))
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            className="py-8"
          >
            No notes available yet.
          </Typography>
        )}
      </Box>

      {/* Add Note Button */}
      <Box className="fixed bottom-8 right-8">
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          className="rounded-full px-6 py-2 shadow-lg"
        >
          + Add Note
        </Button>
      </Box>

      {/* Modal Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Note</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Write your note"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notes;
