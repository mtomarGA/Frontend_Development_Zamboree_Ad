'use client'
import React, { useState } from 'react'
import IssueTable from './IssueTable'
// import AddModal from './AddModal'

function MainQues() {
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    return (
        <div>

            {/* <AddModal open={open} handleClose={handleClose} handleClickOpen={handleClickOpen} /> */}
            <IssueTable handleClickOpen={handleClickOpen} />
        </div>
    )
}

export default MainQues
