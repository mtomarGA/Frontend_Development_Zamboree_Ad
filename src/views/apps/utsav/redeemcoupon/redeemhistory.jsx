

'use client'

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Button,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Historytable from './historytable';
import CustomTextField from '@/@core/components/mui/TextField';
import CouponRoute from '@/services/utsav/managecoupon/manage';
import { Autocomplete, TextField } from '@mui/material';

import RedeemRoute from '@/services/utsav/managecoupon/redeem.services';
import userRegister from '@/services/customers/createService';
import { toast } from 'react-toastify';

function Redeemhistory() {
    const { id } = useParams();
    const [showcoupon, setshowcoupon] = useState({});
    const [RedeemData, setRedeemData] = useState({});
    const [sendCode, setsendCode] = useState({});
    const [RedeemMsg, setRedeemMsg] = useState({});
    const [AllUser, setAllUser] = useState([]);
    const [ShowUser, setShowUser] = useState({});
    const [openConfirm, setOpenConfirm] = useState(false);
    const [inputValue, setInputValue] = useState('');


    const balance = (showcoupon.user_assigned || 0) - (showcoupon.usedCoupon || 0);

    // Fetch coupon by ID
    const fetchCoupon = async () => {
        const result = await CouponRoute.getdatabyid(id);
        setshowcoupon(result.data);

        const today = new Date();
        const expiryDate = new Date(result.data.expiryDate);
        if (expiryDate < today.setHours(0, 0, 0, 0)) {
            // Redirect if the coupon has expired
            router.push('/apps/utsav/managecoupon');  // Change '/path-to-redirect' to the page where you want to redirect
        }
    };

    useEffect(() => {
        if (id) {
            fetchCoupon();

        }

    }, [id]);

    // Fetch all users
    useEffect(() => {
        const fetchAllUsers = async () => {
            const res = await userRegister.allusers();
            setAllUser(res.data);
        };

        fetchAllUsers();
    }, []);

    // Fetch selected user
    useEffect(() => {
        if (sendCode?.customerId) {
            getUserByid(sendCode.customerId);
        }
    }, [sendCode?.customerId]);

    const getUserByid = async (userId) => {
        const res = await userRegister.getsingle(userId);
        setShowUser(res.data);
        // console.log(res.data, "ddkmk")
    };


    const [getmsg, setgetmsg] = useState([]);

    const postRedeem = async () => {
        const getcode = await RedeemRoute.PostCoupon({
            couponId: id,
            customerId: sendCode.customerId,
        });

        // console.log(getcode, "dkdk")
        if (getcode.data == null) {
            setgetmsg(getcode);
            // console.log(getcode)
            // console.log(getcode.message);
            return;
        }
        setRedeemData(getcode.data);
        console.log(getcode, "existing")
    };


    // console.log(getmsg)
    const getsubmitcode = () => {
        const lastCode =
            Array.isArray(RedeemData?.couponcode) && RedeemData.couponcode.length > 0
                ? RedeemData.couponcode[RedeemData.couponcode.length - 1].code
                : '';

        setsendCode({
            couponcode: lastCode,
            couponId: RedeemData?.couponId,
            customerId: RedeemData?.customerId,
        });
    };



    // redeem
    const SentCodeFun = async () => {
        try {
            const res = await RedeemRoute.sendCodeData(sendCode);
            setRedeemMsg(res?.data);
            console.log(res);
            // GetCode(res?.data.couponcode)

        } catch (error) {
            console.log(error, 'njdjndnj')
        }
    };




    const handleOpenConfirm = () => setOpenConfirm(true);
    const handleCloseConfirm = () => setOpenConfirm(false);
    const handleConfirmRedeem = async () => {
        await SentCodeFun();
        await fetchCoupon(); // Refresh data after redeem
        setRedeemData({}); // Clear code if needed
        setOpenConfirm(false);

    }
    const [loading, setloading] = useState(false);
    const GetClaims = async () => {
        const result = await RedeemRoute.ClaimCoupon({
            couponId: id,
            customerId: sendCode.customerId,
        });

        console.log(result, "getcklaims")
        if (result.data == null) {
            setgetmsg(result);
            return;
        }
        setRedeemData(result?.data || []);
        toast.success(result?.message);
        setloading(true);
    };

    // console.log(AllUser, "sjknks")

    return (
        <>
            {/* Confirm Dialog */}
            <Dialog open={openConfirm} onClose={handleCloseConfirm}>
                <DialogTitle>Confirm Redemption</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to redeem this coupon?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirm} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmRedeem} color="primary" variant="contained">
                        Yes, Redeem
                    </Button>
                </DialogActions>
            </Dialog>

            <div className="flex flex-col mx-2">
                <h2 className="mx-2">Redeem:</h2>
                <div className="m-2">
                    <CustomTextField
                        className="w-96"
                        label="Coupon Name:"
                        value={showcoupon?.title || ''}
                        multiline
                        rows={1}
                        variant="outlined"
                        disabled
                    />
                </div>
            </div>

            <div className="flex flex-row justify-between">
                <div className="flex flex-col m-2">

                    <Autocomplete
                        className="m-2 w-96"
                        options={
                            inputValue.trim().length >= 3
                                ? AllUser.filter((user) => {
                                    const phone = user.phone?.toString().toLowerCase() || ''
                                    const email = user.email?.toString().toLowerCase() || ''
                                    const userId = user.userId?.toString().toLowerCase() || ''
                                    const query = inputValue.toLowerCase().trim()

                                    return (
                                        phone.includes(query) ||
                                        email.includes(query) ||
                                        userId.includes(query)
                                    )
                                })
                                : []
                        }
                        getOptionLabel={(option) => `${option.phone} - ${option.email} - ${option.userId}`}
                        onChange={(event, newValue) => {
                            setsendCode({ ...sendCode, customerId: newValue?._id || '' })
                        }}
                        inputValue={inputValue}
                        onInputChange={(event, newInputValue) => {
                            setInputValue(newInputValue)
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Search User by Mobile, ID or Email" variant="outlined" />
                        )}
                        noOptionsText={inputValue.length < 3 ? 'Type at least 3 characters' : 'No users found'}
                    />


                    {/* <div className='mx-2'>
                        <Button variant="contained" onClick={GetClaims} disabled={!sendCode.customerId}>Claim Coupon</Button>
                    </div> */}



                    {/* Generate Coupon Code */}
                    <div className="flex m-2">
                        <Button variant="contained" onClick={postRedeem} >
                            Generate Code
                        </Button>
                        <div className="mx-2">
                            {/* <CustomTextField
                                // value={RedeemData.couponcode || ''}
                                value={RedeemData?.couponcode || ''}

                                multiline
                                rows={1}
                                variant="outlined"
                                disabled
                            /> */}

                            <CustomTextField
                                value={
                                    Array.isArray(RedeemData?.couponcode) && RedeemData.couponcode.length > 0
                                        ? RedeemData.couponcode[RedeemData.couponcode.length - 1].code
                                        : ''
                                }
                                multiline
                                rows={1}
                                variant="outlined"
                                disabled
                            />

                        </div>
                    </div>

                    {/* Redeem Button */}
                    <div className="mx-2 flex items-center">
                        <Button
                            variant="contained"
                            onClick={() => {
                                getsubmitcode();
                                handleOpenConfirm();
                            }}
                            disabled={!RedeemData.couponcode}
                        >
                            Redeem
                        </Button>

                        {/* {balance <= 0 && (
                            <div className="text-red-500 ml-4">No balance left to redeem</div>
                        )} */}

                        {RedeemMsg?.message ? (
                            <div className='mx-2 text-center border-2 border-gray-500 rounded p-2'>
                                {RedeemMsg?.message}
                            </div>
                        ) : null}

                        {RedeemData?.message ? (
                            <div className='mx-2 text-center border-2 border-gray-500 rounded p-2'>
                                {RedeemData?.message}
                            </div>
                        ) : null}
                        {/* {getmsg ? (
                            <div className='mx-2 text-center border-2 border-gray-500 rounded p-2'>
                                {getmsg}
                            </div>
                        ) : null} */}

                        {getmsg?.message && (
                            <div className="mx-2 text-center border-2 border-gray-500 rounded p-2">
                                {getmsg?.message}
                            </div>
                        )}



                    </div>
                </div>

                {/* User Info & Coupon Info */}
                <div className="flex flex-col">
                    <div className="border-2 border-gray-500 rounded p-2 m-2 w-96">
                        <p>
                            <span className="font-bold m-2">User Email:</span> {ShowUser?.email}
                        </p>
                        <p>
                            <span className="font-bold m-2">Name:</span> {ShowUser?.firstName}
                        </p>
                        <p>
                            <span className="font-bold m-2">City:</span> {ShowUser?.city?.name}
                        </p>
                    </div>
                    <div className="border-2 border-gray-500 rounded p-2 m-2 w-96">
                        <p>
                            <span className="font-bold m-2">Coupon Per User Assigned:</span>
                            {showcoupon.user_assigned}
                        </p>
                        <p>
                            <span className='font-bold m-2'>Used Coupon:</span>
                            {RedeemData?.usedCoupon}
                        </p>

                        <p>
                            <span className="font-bold m-2">Balance Coupon:</span>
                            {RedeemData?.balanceCoupon}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Redeemhistory;
