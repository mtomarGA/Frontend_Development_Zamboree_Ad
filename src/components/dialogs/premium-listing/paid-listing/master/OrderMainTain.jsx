"use client";
import React, { useState } from "react";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import PackageService from "@/services/premium-listing/paidPackage.service";
import { toast } from "react-toastify";

const OrderMainTains = ({ setOrderOpen, getPackage, EditSelectedPackage }) => {
    console.log(EditSelectedPackage, 'EditSelectedPackage in OrderMainTains');
    
    const [order, setOrder] = useState(EditSelectedPackage?.order || '');



    const handleChange = async (event) => {
        setOrder(event.target.value);
        console.log(EditSelectedPackage);
        const packageId = EditSelectedPackage._id || EditSelectedPackage._id;
        const SetOrderToPackage = await PackageService.updatePaidPackage(packageId, { order: event.target.value });
        toast.success(SetOrderToPackage?.message || 'Order updated successfully');
        getPackage();
        setOrderOpen(false);
    };


    return (
        <div className="flex items-center justify-center  bg-gray-50">
            <div className="w-full max-w-sm p-4 bg-white rounded-xl ">
                <FormControl fullWidth>
                    <InputLabel>Order</InputLabel>
                    <Select
                        value={order}
                        onChange={handleChange}
                        label="Order"
                        className="rounded-lg text-start"
                    >
                        <MenuItem value="DIAMOND SUPPLIER">Diamond Supplier</MenuItem>
                        <MenuItem value="GOLD SUPPLIER">Gold Supplier</MenuItem>
                        <MenuItem value="PREMIUM SUPPLIER">Premium Supplier</MenuItem>
                        <MenuItem value="STANDARD SUPPLIER">Standard Supplier</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </div>
    );
};

export default OrderMainTains;
