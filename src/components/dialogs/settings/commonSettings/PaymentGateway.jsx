// "use client";
// import { useState } from "react";
// import { Switch, Card, CardContent, TextField, Button } from "@mui/material";
// import { Grid } from "@mui/system";

// export default function PaymentSettings() {
//   const [paypalEnabled, setPaypalEnabled] = useState(true);
//   const [stripeEnabled, setStripeEnabled] = useState(true);
//   const [razorEnabled, setRazorEnabled] = useState(false);
//   const [cashfreeEnabled, setCashfreeEnabled] = useState(false);

//   return (
//     <div className="p-6">
//       <Grid container spacing={3}>
//         {/* Razorpay */}
//         <Grid size={{ xs: 12, md: 6 }}>
//           <Card className="shadow rounded-2xl">
//             <CardContent className="p-5">
//               <div className="flex justify-between items-center mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-white p-2 rounded-lg shadow-sm border">
//                     <img
//                       src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Razorpay_logo.svg/1200px-Razorpay_logo.svg.png?20171127075036"
//                       alt="Razorpay"
//                       className="w-14 h-10 object-contain"
//                     />
//                   </div>
//                   <h2 className="font-semibold text-lg">Razorpay</h2>
//                 </div>
//                 <Switch
//                   checked={razorEnabled}
//                   onChange={() => setRazorEnabled(!razorEnabled)}
//                   color="primary"
//                 />
//               </div>

//               <div className="space-y-3">
//                 <TextField fullWidth label="RAZOR KEY" variant="outlined" />
//                 <TextField fullWidth label="RAZOR SECRET" variant="outlined" />

//                 <Button variant="contained" color="primary">
//                   Save
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Stripe */}
//         <Grid size={{ xs: 12, md: 6 }}>
//           <Card className="shadow rounded-2xl">
//             <CardContent className="p-5">
//               <div className="flex justify-between items-center mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-white p-2 rounded-lg shadow-sm border">
//                     <img
//                       src="https://easydigitaldownloads.com/wp-content/uploads/edd/2019/03/stripe-product-image.png"
//                       alt="Stripe"
//                       className="w-14 h-10 object-contain"
//                     />
//                   </div>
//                   <h2 className="font-semibold text-lg">Stripe</h2>
//                 </div>
//                 <Switch
//                   checked={stripeEnabled}
//                   onChange={() => setStripeEnabled(!stripeEnabled)}
//                   color="primary"
//                 />
//               </div>

//               <div className="space-y-3">
//                 <TextField fullWidth label="Stripe Key" variant="outlined" />
//                 <TextField fullWidth label="Stripe Secret" variant="outlined" />

//                 <Button variant="contained" color="primary">
//                   Save
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Paypal */}
//         <Grid size={{ xs: 12, md: 6 }}>
//           <Card className="shadow rounded-2xl">
//             <CardContent className="p-5">
//               <div className="flex justify-between items-center mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-white p-2 rounded-lg shadow-sm border">
//                     <img
//                       src="https://imagedelivery.net/6Fk5TIReezmxFLHacB1A6g/07cca6d5-772f-470e-066c-9f2340c96800/public"
//                       alt="Paypal"
//                       className="w-14 h-10 object-contain"
//                     />
//                   </div>
//                   <h2 className="font-semibold text-lg">Paypal</h2>
//                 </div>
//                 <Switch
//                   checked={paypalEnabled}
//                   onChange={() => setPaypalEnabled(!paypalEnabled)}
//                   color="primary"
//                 />
//               </div>

//               <div className="space-y-3">
//                 <TextField
//                   fullWidth
//                   label="Paypal Client Id"
//                   variant="outlined"
//                 />
//                 <TextField
//                   fullWidth
//                   label="Paypal Client Secret"
//                   variant="outlined"
//                 />

//                 <div className="flex items-center gap-2">
//                   <Switch color="primary" defaultChecked />
//                   <span className="text-sm font-medium">Paypal Sandbox Mode</span>
//                 </div>

//                 <Button variant="contained" color="primary">
//                   Save
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Cashfree */}
//         <Grid size={{ xs: 12, md: 6 }}>
//           <Card className="shadow rounded-2xl">
//             <CardContent className="p-5">
//               <div className="flex justify-between items-center mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-white p-2 rounded-lg shadow-sm border">
//                     <img
//                       src="https://images.seeklogo.com/logo-png/47/1/cashfree-payments-logo-png_seeklogo-479373.png"
//                       alt="Cashfree"
//                       className="w-14 h-10 object-contain"
//                     />
//                   </div>
//                   <h2 className="font-semibold text-lg">Cashfree</h2>
//                 </div>
//                 <Switch
//                   checked={cashfreeEnabled}
//                   onChange={() => setCashfreeEnabled(!cashfreeEnabled)}
//                   color="primary"
//                 />
//               </div>

//               <div className="space-y-3">
//                 <TextField fullWidth label="Cashfree App ID" variant="outlined" />
//                 <TextField
//                   fullWidth
//                   label="Cashfree Secret Key"
//                   variant="outlined"
//                 />

//                 <div className="flex items-center gap-2">
//                   <Switch color="primary" />
//                   <span className="text-sm font-medium">Sandbox Mode</span>
//                 </div>

//                 <Button variant="contained" color="primary">
//                   Save
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  Grid,
  Modal,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import paymentApiService from "@/services/paymentApi/paymentApiService";
import { toast } from "react-toastify";

export default function PaymentSettings() {
  const [paymentApis, setPaymentApis] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, apiId: null });

  useEffect(() => {
    fetchApis();
  }, []);

  const fetchApis = async () => {
    const res = await paymentApiService.get();
    setPaymentApis(res?.data || []);
  };

  const handleToggle = async (item) => {
    const updatedItem = { ...item, active: !item.active };
    const res = await paymentApiService.putData(item._id, updatedItem);
    if (res?.success) toast.success("Status Updated Successfully");
    fetchApis();
  };

  const handleSubmit = async () => {
    if (!editData) return;

    if (editData._id) {
      const res = await paymentApiService.putData(editData._id, editData);
      if (res?.success) toast.success(res.message || "API updated successfully");
      else toast.error(res.message || "Failed to update API");
    } else {
      const res = await paymentApiService.Post(editData);
      if (res?.success) toast.success(res.message || "API added successfully");
      else toast.error(res.message || "Failed to add API");
    }

    fetchApis();
    setOpenModal(false);
    setEditData(null);
  };

  const handleOpenAddModal = () => {
    setEditData(null);
    setOpenModal(true);
  };

  const handleOpenEditModal = (item) => {
    setEditData(item);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    const res = await paymentApiService.deleteData(id);
    toast.success("API deleted successfully");
    fetchApis();
    setDeleteDialog({ open: false, apiId: null });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="font-semibold">
          Payment API Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAddModal}
        >
          Add API
        </Button>
      </div>

      {/* API Cards */}
      <Grid container spacing={3}>
        {paymentApis.map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item._id}>
            <Card className="shadow rounded-2xl">
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    {item.logo && (
                      <img
                        src={item.logo}
                        alt={item.name}
                        className="w-12 h-12 object-contain rounded-lg border p-1"
                      />
                    )}
                    <Typography variant="h6" className="font-semibold">
                      {item.name}
                    </Typography>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.active}
                      onChange={() => handleToggle(item)}
                      color="primary"
                    />
                    <IconButton
                      color="error"
                      onClick={() => setDeleteDialog({ open: true, apiId: item._id })}
                    >
                      <Delete />
                    </IconButton>
                  </div>
                </div>

                <div className="space-y-2">
                  <Typography variant="body2">
                    <strong>API Key:</strong> {item.apiKey}
                  </Typography>
                  <Typography variant="body2">
                    <strong>API Secret:</strong> {item.apiSecret}
                  </Typography>
                  <div className="flex justify-end">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleOpenEditModal(item)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div className="bg-backgroundPaper p-6 rounded-xl shadow-lg w-[450px] mx-auto mt-40">
          <Typography variant="h6" className="font-bold mb-4 text-center">
            {editData?._id ? "Edit Payment API" : "Add Payment API"}
          </Typography>

          <div className="space-y-3">
            <TextField
              fullWidth
              label="Name"
              value={editData?.name || ""}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="API Key"
              value={editData?.apiKey || ""}
              onChange={(e) => setEditData({ ...editData, apiKey: e.target.value })}
            />
            <TextField
              fullWidth
              label="API Secret"
              value={editData?.apiSecret || ""}
              onChange={(e) => setEditData({ ...editData, apiSecret: e.target.value })}
            />
            <TextField
              fullWidth
              label="Logo URL"
              value={editData?.logo || ""}
              onChange={(e) => setEditData({ ...editData, logo: e.target.value })}
            />

            <div className="flex items-center gap-2">
              <Switch
                checked={editData?.active || false}
                onChange={() =>
                  setEditData({ ...editData, active: !editData.active })
                }
                color="primary"
              />
              <span className="text-sm font-medium">Active</span>
            </div>

            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, apiId: null })}
      >
        <DialogTitle>Are you sure you want to delete this API?</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, apiId: null })}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(deleteDialog.apiId)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
