'use client'

import { useEffect, useState } from "react"
import { ComposeModal } from "./Compose"
import EmailPage from "./Email"
import { useMail } from "@/contexts/mail/MailService"
import { Inbox } from "lucide-react"


function Mailpage() {
    const { open, SaveMail,
        fetchAllLabels, GetallLabel,
        DeleteLabelbyMsgId, getLabelbyMsgId,
        handleClickOpen, MarkSeen, SaveDraft,
        SentMails, RestoreMail, DeletePermanentMail,
        MoveTrash, handleClose, SendMail,
        setCompose, setMails, fetchData,
        Compose,
        GetMail, Mails, ChangeFun, setisReply, isReply
        , isForward, setisForward, copyAlldata, getEmailid
        , InTrash, setInTrash, InInbox, setInbox, InDraft, setInDraft, InSend, setInSent, Starred, setStarred, inboxMails, setInboxMails,
        sentMails, setSentMails,
        draftMails, setDraftMails,
        trashMails, setTrashMails, limit, total, page, setPage, pageloading, setpagesNo, limits, sentloading, pagesNo } = useMail();


    console.log(GetallLabel, "mailpage")

    // const IncreasePageNo = () => {
    //     setpage(prev => prev + 1);
    //     fetchData();
    // }

    // const DecreasePageNo = () => {
    //     setpage(prev => prev - 1);
    //     fetchData();
    // }



    useEffect(() => { fetchAllLabels() }, [])

    return (

        <div>
            {/* compose a mail */}
            <ComposeModal getEmailid={getEmailid} isForward={isForward} isReply={isReply} open={open} Compose={Compose} SaveDraft={SaveDraft} handleClose={handleClose} setCompose={setCompose} SendMail={SendMail} ChangeFun={ChangeFun} />

            {/* email page */}
            <EmailPage pagesNo={pagesNo} setpagesNo={setpagesNo} limits={limits} sentloading={sentloading} limit={limit} pageloading={pageloading} total={total} page={page} setPage={setPage} copyAlldata={copyAlldata} setisForward={setisForward} setisReply={setisReply} fetchAllLabels={fetchAllLabels} setCompose={setCompose} GetallLabel={GetallLabel} DeleteLabelbyMsgId={DeleteLabelbyMsgId} getLabelbyMsgId={getLabelbyMsgId} SaveMail={SaveMail} fetchData={fetchData} MarkSeen={MarkSeen} DeletePermanentMail={DeletePermanentMail} RestoreMail={RestoreMail} MoveTrash={MoveTrash} SentMails={SentMails} setMails={setMails} handleClickOpen={handleClickOpen} Mails={Mails} open={open} handleClose={handleClose} GetMail={GetMail} InTrash={InTrash} setInTrash={setInTrash} InInbox={InInbox} setInbox={setInbox} InDraft={InDraft} setInDraft={setInDraft} InSend={InSend} setInSent={setInSent} Starred={Starred} setStarred={setStarred} inboxMails={inboxMails} setInboxMails={setInboxMails} sentMails={sentMails} setSentMails={setSentMails} draftMails={draftMails} setDraftMails={setDraftMails} trashMails={trashMails} setTrashMails={setTrashMails} />
        </div>



    )
}

export default Mailpage
