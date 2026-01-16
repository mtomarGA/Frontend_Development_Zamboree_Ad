import React, { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";

const InvoicePage = ({ selectedInvoice }) => {
  const [paymentDetails, setPaymentDetails] = useState([]);

  useEffect(() => {
    if (selectedInvoice) {
      const payments = selectedInvoice?.paymentDetails || [];
      // Sort by paymentDate descending (latest first)
      const sortedPayments = payments.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
      setPaymentDetails(sortedPayments);
    }
  }, [selectedInvoice]);




  return (
    <Box className="p-6 min-h-screen">
      {/* Payment Details */}
      <Box className="">
        <Typography variant="h6">Payment Details</Typography>
        {paymentDetails.length === 0 ? (
          <Typography>No payment details available.</Typography>
        ) : (
          paymentDetails.map((payment, index) => (
            <Box key={index} className="mt-4 p-4 border rounded-lg">
              <Typography><strong>Payment #{index + 1}</strong></Typography>
              <Divider className="my-2" />
              <Typography>
                <strong>Mode:</strong> {payment.paymentMode}
              </Typography>
              <Typography>
                <strong>Amount Received:</strong> ₹{payment.amountReceived}
              </Typography>
              <Typography>
                <strong>Payment Date:</strong>{" "}
                {new Date(payment.paymentDate).toLocaleDateString()}
              </Typography>

              <Typography>
                <strong>Payment Taken By:</strong>{" "}
                {payment.paymentTaken?.firstName} {payment.paymentTaken?.lastName} (
                {payment.paymentTaken?.email})
              </Typography>

              {/* Conditionally render based on payment mode */}
              {payment.paymentMode === "CHEQUE" && (
                <>
                  <Typography>
                    <strong>Cheque ID:</strong> {payment.chequeId || "N/A"}
                  </Typography>
                  <Typography>
                    <strong>Cheque Issue Date:</strong>{" "}
                    {payment.chequeIssueDate
                      ? new Date(payment.chequeIssueDate).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                </>
              )}

              {payment.paymentMode === "UPI" && (
                <Typography>
                  <strong>Transaction ID:</strong> {payment.transactionId || "N/A"}
                </Typography>
              )}
              <Typography
                className={`px-2 py-1 rounded ${payment.status === "failed" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                  }`}
              >
                <strong>Status:</strong> {payment.status || "N/A"}
              </Typography>

            </Box>
          ))
        )}

      </Box>
    </Box>
  );
};

export default InvoicePage;
