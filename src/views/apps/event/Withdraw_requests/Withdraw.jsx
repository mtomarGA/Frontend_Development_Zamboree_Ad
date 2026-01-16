'use client'
import React, { useEffect, useState } from 'react'
import WithdrawTable from './WithdrawTable'
import AddModal from './AddModal'
import WithdrawService from '@/services/event/event_mgmt/WithdrawService'
import bankService from '@/services/business/bank.service'

function Withdraw() {
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const [data, setdata] = useState([]);
    const [Editopen, setEditOpen] = useState(false)
    const getdata = async () => {
        const response = await WithdrawService.Get();
        setdata(response.data || []);
    }

    useEffect(() => {
        getdata()
    }, []);

    // bank

    const [getbank, setGetbank] = useState([])
    const getBankFun = async () => {
        if (open || Editopen) {
            const response = await bankService.getAllBanks();

            setGetbank(response.data || []);
        }
    }

    useEffect(() => { getBankFun() }, [open, Editopen]);
    return (
        <div>

            <AddModal open={open} getbank={getbank} handleClose={handleClose} getdata={getdata} handleClickOpen={handleClickOpen} />
            <WithdrawTable setEditOpen={setEditOpen} Editopen={Editopen} data={data} getbank={getbank} getBankFun={getBankFun} getdata={getdata} handleClickOpen={handleClickOpen} />
        </div>
    )
}

export default Withdraw
