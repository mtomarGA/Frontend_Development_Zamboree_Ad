'use client'

import EventInvoiceService from '@/services/event/invoice/EventInvoiceService';
import { Button, Card, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { set } from 'date-fns';
import html2canvas from 'html2canvas';
import {jsPDF} from 'jspdf';
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print';

function ShowInvoice() {
    const { id } = useParams();
    const [data, setdata] = useState('');

    useEffect(() => {
        if (id) {
            async function getbyid(id) {
                const response = await EventInvoiceService.getbyid(id);
                console.log(response);
                setdata(response.data || '');
            }
            getbyid(id);
        }
    }, [id]);

    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({
        contentRef,
        bodyClass: 'print-body'
    });


    const handleDownload = () => {
        const element = document.getElementById("invoice");

        // Create a temporary container with forced styles
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'fixed';
        tempContainer.style.left = '-10000px';
        tempContainer.style.top = '0';
        tempContainer.style.zIndex = '10000';
        tempContainer.style.backgroundColor = 'white';
        tempContainer.style.padding = '20px';

        // Clone and force styles
        const clone = element.cloneNode(true);

        // Apply styles to all elements
        const allElements = clone.querySelectorAll('*');
        allElements.forEach(el => {
            el.style.color = '#000000';
            el.style.backgroundColor = '#FFFFFF';
            el.style.borderColor = '#DDDDDD';
            el.style.boxShadow = 'none';
        });

        // Special handling for cards (if they have specific classes)
        const cards = clone.querySelectorAll('.card, [class*="card"], [class*="Card"]');
        cards.forEach(card => {
            card.style.backgroundColor = '#FFFFFF';
            card.style.border = '1px solid #DDDDDD';
            card.style.borderRadius = '4px';
            card.style.padding = '15px';
            card.style.margin = '10px 0';
        });

        // Special handling for tables
        const tables = clone.querySelectorAll('table');
        tables.forEach(table => {
            table.style.backgroundColor = '#FFFFFF';
            table.style.borderCollapse = 'collapse';
            table.style.width = '100%';

            const cells = table.querySelectorAll('th, td');
            cells.forEach(cell => {
                cell.style.backgroundColor = '#FFFFFF';
                cell.style.color = '#000000';
                cell.style.border = '1px solid #DDDDDD';
                cell.style.padding = '8px';
            });
        });

        tempContainer.appendChild(clone);
        document.body.appendChild(tempContainer);

        html2canvas(clone, {
            scale: 3,
            backgroundColor: '#FFFFFF',
            logging: true,
            useCORS: true,
            allowTaint: true,
            onclone: (document, element) => {
                // Final override right before capture
                element.style.backgroundColor = '#FFFFFF';
                element.querySelectorAll('*').forEach(el => {
                    el.style.backgroundColor = '#FFFFFF';
                    el.style.color = '#000000';
                });
            }
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF({
                unit: 'mm',
                format: 'a4',
                compress: false,
            });

            const imgWidth = 190; // Slightly smaller than A4 width
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            pdf.save(data?.invoiceid ? `invoice_${data.invoiceid}.pdf` : 'invoice.pdf');

            // Clean up
            document.body.removeChild(tempContainer);
        }).catch(err => {
            console.error('Error generating PDF:', err);
            document.body.removeChild(tempContainer);
        });
    };
    return (
        <>
            <style>{`
                @media print {
                    .print-body {
                        margin: 0 !important;
                        padding: 20px !important;
                        width: 100% !important;
                    }
                    
                    .print-container {
                        width: 100% !important;
                        max-width: 800px !important;
                        margin: 0 auto !important;
                        padding: 0 !important;
                    }
                    
                    .MuiCard-root {
                        box-shadow: none !important;
                        border: 1px solid #ccc !important;
                    }
                    
                    .MuiPaper-root {
                        box-shadow: none !important;
                        border: 1px solid #ccc !important;
                    }
                    
                    @page {
                        margin: 1cm;
                    }
                }
            `}</style>

            <div ref={contentRef} id='invoice' className="print-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                <Card sx={{ padding: '16px', margin: '16px 0', width: '100%' }}>

                    <h2 style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
                        Invoice Details
                    </h2>

                    {/* <Card sx={{ padding: '16px', margin: '16px 0', width: '100%' }}> */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <p style={{ fontSize: '14px', margin: '0 0 8px 0' }}>Event Name:</p>
                            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{data?.eventid?.event_title}</span>
                        </div>

                        <div>
                            <p style={{ margin: '4px 0' }}>Invoice: {data?.invoiceid}</p>
                            <p style={{ margin: '4px 0' }}>Date Issued: {(data?.updatedAt) ? new Date(data?.updatedAt).toLocaleString() : new Date(data?.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                    {/* </Card> */}

                    <div style={{ margin: '16px 8px' }}>
                        <strong>Invoice to:</strong>
                        <div style={{ margin: '8px 0' }}>
                            <span>{data?.user?.firstName} {data?.user?.lastName}</span>
                            <p style={{ margin: '4px 0' }}>{data?.user?.email}</p>
                        </div>
                    </div>

                    <div style={{ margin: '24px 8px 8px 8px' }}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left"><strong>Item</strong></TableCell>
                                        <TableCell align="right"><strong>Description</strong></TableCell>
                                        <TableCell align="right"><strong>Quantity</strong></TableCell>
                                        <TableCell align="right"><strong>Total</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data?.ticketdetails?.map((item, index) => (
                                        <TableRow
                                            key={item?._id?._id || index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {item?._id?.ticket_name}
                                            </TableCell>
                                            <TableCell align="right">
                                                {item?._id?.description}
                                            </TableCell>
                                            <TableCell align="right">
                                                {item?.quantity}
                                            </TableCell>
                                            <TableCell align="right">
                                                ₹{item?.amount}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* <Card sx={{ margin: '16px 0', padding: '16px' }}> */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', margin: '8px' }}>
                            <p style={{ margin: '4px 0' }}>Amount: ₹{(data?.amount - data?.gst)}</p>
                            {data?.gst > 0 && <p style={{ margin: '4px 0' }}>GST Amount: ₹{data?.gst}</p>}
                            <p style={{ margin: '4px 0', fontWeight: 'bold', fontSize: '16px' }}>Payable Amount: ₹{data?.amount}</p>
                            <p>Amount: {data?.status}</p>
                        </div>
                        {/* </Card> */}
                    </div>
                </Card>
            </div>

            <div style={{ textAlign: 'center', margin: '20px' }}>
                <Button variant="contained" onClick={reactToPrintFn}>
                    Print Invoice
                </Button>
                <Button variant="outlined" className='mx-2' onClick={handleDownload}>
                    Download Invoice
                </Button>
            </div>
        </>
    )
}

export default ShowInvoice
