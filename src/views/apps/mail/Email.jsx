'use client'

import RefreshIcon from "@mui/icons-material/Refresh";
import {
    Avatar,
    Box,
    Checkbox,
    IconButton,
    Button,
    TextField,
    CircularProgress,
    Tooltip
} from '@mui/material'
import { Star, StarBorder, Close, StarBorderRounded, AttachmentRounded } from '@mui/icons-material'
import React, { useState, useEffect } from 'react'
import { InboxIcon, MenuIcon, RotateCcw, SearchIcon, Trash2 } from 'lucide-react'
import DraftsIcon from '@mui/icons-material/Drafts'
import ReportIcon from '@mui/icons-material/Report'
import EmailDetail from './EmailDetail'
import { motion, AnimatePresence, hover } from 'framer-motion'
import { toast } from 'react-toastify'
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash'
import CustomTextField from '@/@core/components/mui/TextField'
import PaginationRounded from '../announce/list/pagination'
import { useMail } from "@/contexts/mail/MailService";


const Dot = ({ color }) => (
    <Box
        sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: color,
            mx: 0.5
        }}
    />
)





function Email({ handleClickOpen, fetchAllLabels, setCompose, DeleteLabelbyMsgId, GetallLabel, Mails, SaveMail, SentMails, setMails, fetchData, MoveTrash, RestoreMail, DeletePermanentMail, MarkSeen, getLabelbyMsgId, setisReply, setisForward, copyAlldata, InTrash, setInTrash, InInbox, setInbox, InDraft, setInDraft, InSend, setInSent, Starred, setStarred,
    sentMails, setSentMails,
    draftMails, setDraftMails,
    trashMails, setTrashMails, limit, total, page, setPage, pageloading, setpagesNo, limits, sentloading, pagesNo }) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [selectedEmail, setSelectedEmail] = useState(null)
    const [isMounted, setIsMounted] = useState(false)
    const [loading, setLoading] = useState(false)

    const { refreshInbox } = useMail();
    // Add state to track if each folder has been fetched
    const [fetchedFolders, setFetchedFolders] = useState({
        inbox: false,
        sent: false,
        draft: false,
        trash: false,
        // starred: false
    })


    const [totalPages, setTotalPages] = useState(0);
    const [SelcetedStarMails, setSelectedStarMails] = useState([]);
    const handleSent = async (type) => {
        // Check if this folder has already been fetched

        // if (type !== 'starred' && fetchedFolders[type]) {
        //     return;
        // }

        setLoading(true);
        try {
            const response = await SentMails(type);
            const emails = response?.data?.Paginatedmsg || [];
            setTotalPages(response?.data?.total);

            // Normalize flags and ensure seen is correctly set
            const enriched = emails.map(mail => {
                let flags = Array.isArray(mail.flag) ? [...mail.flag] : [];

                // Ensure \\Seen is set for draft, trash, and sent
                if (!flags.includes("\\Seen") && (type === "draft" || type === "trash" || type === "sent")) {
                    flags.push("\\Seen");
                }

                return {
                    ...mail,
                    flag: flags
                };
            });


            if (type == "sent") {
                // setSentMails(enriched || []);
                setSentMails(enriched.sort((a, b) => new Date(b.date) - new Date(a.date)) || []);
                setFetchedFolders(prev => ({
                    ...prev,
                    [type]: true
                }));
            }
            else if (type == 'draft') {
                setDraftMails(enriched.sort((a, b) => new Date(b.date) - new Date(a.date)) || []);
                setFetchedFolders(prev => ({
                    ...prev,
                    [type]: true
                }));
            }
            else if (type == "trash") {
                setTrashMails(enriched.sort((a, b) => new Date(b.date) - new Date(a.date)) || []);
                setFetchedFolders(prev => ({
                    ...prev,
                    [type]: true
                }));
            }
            else if (type == 'starred') {
                // First get all emails (you might need to fetch these differently)
                const allEmails = Mails; // or await fetchAllEmails();

                // Filter for starred emails
                const StarMail = allEmails.filter(item => {
                    const matchingLabel = GetallLabel.find(label =>
                        label.messageid === item.messageId
                    );
                    return matchingLabel?.hasStarred === true;
                });

                setSelectedStarMails(StarMail);
                console.log(StarMail, "sddddddddd")
            }

            // Mark this folder as fetched


        } catch (error) {
            console.error('Failed to fetch sent mails:', error);
        } finally {
            setLoading(false);
        }
    }


    const MailChange = () => {
        if (InInbox) return Mails;
        if (InDraft) return draftMails;
        if (InSend) return sentMails;
        if (InTrash) return trashMails;
        if (Starred) return SelcetedStarMails;
        return [];
    }

    // Get current mails based on active folder
    const currentMails = MailChange();


    useEffect(() => {
        MailChange()
    }, [InInbox, InDraft, InSend, InTrash, Starred])


    // fetch inbox
    const handleInbox = async () => {
        // Only fetch if inbox hasn't been fetched yet
        if (fetchedFolders.inbox) {
            return;
        }

        setLoading(true)
        try {
            await fetchData()
            // Mark inbox as fetched
            setFetchedFolders(prev => ({
                ...prev,
                inbox: true
            }));
        } catch (error) {
            console.error('Inbox fetch error:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setIsMounted(true)
        handleInbox()
    }, [])

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    // mark as seen when click 
    const handleEmailClick = async (email) => {
        setSelectedEmail(email);
        await MarkSeen({ uid: email?.uid });

        // Update the correct folder state based on current view

        // unflag 
        const updateMailState = (prevMails) =>
            prevMails.map((mail) =>
                mail.uid === email.uid
                    ? {
                        ...mail,
                        flag: Array.isArray(mail.flag)
                            ? [...new Set([...mail.flag, "\\Seen"])] // add if not already present
                            : ["\\Seen"],
                    }
                    : mail
            );

        // Update the appropriate state based on current folder
        if (InInbox) {
            setMails(updateMailState);
        } else if (InSend) {
            setSentMails(updateMailState);
        } else if (InDraft) {
            setDraftMails(updateMailState);
        } else if (InTrash) {
            setTrashMails(updateMailState);
        } else if (Starred) {
            setSelectedStarMails(updateMailState);
        }
    };



    const handleBackToList = () => {
        setSelectedEmail(null)
    }

    const moveToTrash = async (item) => {
        console.log(item, "uids ");
        let fromFolder;
        if (InTrash) {
            fromFolder = "INBOX.Trash";
        } else if (InInbox) {
            fromFolder = "INBOX";
        } else if (InDraft) {
            fromFolder = "INBOX.Drafts";
        } else if (InSend) {
            fromFolder = "INBOX.Sent";
        }

        console.log(fromFolder, "fromFolder");

        const response = await MoveTrash({ uid: item, fromFolder });

        if (response?.success === true) {
            toast.success(response?.message);
        }
    };

    const TrashFun = () => {
        setInTrash(true);
        setInbox(false);
        setInDraft(false);
        setInSent(false)
        setStarred(false)
    }

    const InboxFun = () => {
        setInTrash(false);
        setInbox(true);
        setInDraft(false);
        setInSent(false)
        setStarred(false)
    }

    const DraftFun = () => {
        setInTrash(false);
        setInbox(false);
        setInDraft(true);
        setInSent(false)
        setStarred(false)
    }

    const SentFun = () => {
        setInTrash(false);
        setInbox(false);
        setInDraft(false);
        setInSent(true)
        setStarred(false)
    }

    const StarredFun = () => {
        setInTrash(false);
        setInbox(false);
        setInDraft(false);
        setInSent(false);
        setStarred(true)
    }

    const getActiveClass = (active) => {
        return active
            ? 'bg-blue-50 text-blue-700 font-semibold'
            : 'hover:bg-gray-100 text-BackgroundPaper';
    };

    const handlePermanentDelete = async (items) => {
        try {
            const uids = Array.isArray(items) ? items.map(i => i.uid) : [items.uid];

            const response = await DeletePermanentMail({ uid: uids });

            if (response.success === true) {
                toast.success(response?.message || "Deleted successfully");

                // Update the appropriate state based on current folder
                if (InInbox) {
                    setMails(prev => prev.filter(mail => !uids.includes(mail.uid)));
                } else if (InSend) {
                    setSentMails(prev => prev.filter(mail => !uids.includes(mail.uid)));
                } else if (InDraft) {
                    setDraftMails(prev => prev.filter(mail => !uids.includes(mail.uid)));
                } else if (InTrash) {
                    setTrashMails(prev => prev.filter(mail => !uids.includes(mail.uid)));
                } else if (Starred) {
                    setSelectedStarMails(prev => prev.filter(mail => !uids.includes(mail.uid)));
                }

                setCheckedId([]);
            }
        } catch (error) {
            toast.error("Failed to delete mail permanently");
            console.error(error);
        }
    };

    const SaveStarred = async (item) => {
        const labelObj = GetallLabel.find(label => label.messageid === item.messageId);
        const isCurrentlyStarred = labelObj?.hasStarred ?? false; // default: false if not found

        const payload = {
            messageid: item.messageId,
            hasStarred: !isCurrentlyStarred, // toggle logic
        };

        const response = await SaveMail(payload);
        if (response.success) {
            toast.success(payload.hasStarred ? "Starred" : "Unstarred");
            fetchAllLabels();
        } else {
            toast.error("Failed to update star");
        }
    };

    // Check Box
    const [CheckedId, setCheckedId] = useState([]);

    const OnchangeCheck = (e, uid) => {
        e.stopPropagation();

        const alreadyChecked = CheckedId.some(item => item.uid === uid);

        if (alreadyChecked) {
            setCheckedId(CheckedId.filter(item => item.uid !== uid));
        } else {
            setCheckedId([...CheckedId, { uid }]);
        }
    };

    console.log(CheckedId, "ddd")

    // search - Fixed to use currentMails instead of Mails
    const [searchQuery, setSearchQuery] = useState('');
    const filteredMails = currentMails?.filter((mail) => {
        const lowerQuery = searchQuery.toLowerCase();
        return (
            mail.subject?.toLowerCase().includes(lowerQuery) ||
            mail.body?.toLowerCase().includes(lowerQuery) ||
            mail.from?.toLowerCase().includes(lowerQuery) ||
            mail.senderName?.toLowerCase().includes(lowerQuery)
        );
    }) || [];

    // count of unSeen msgs - Fixed to use currentMails
    const [flagcount, setflagcount] = useState('');
    const flagfun = () => {
        if (!InInbox) {
            setflagcount('');
            return;
        }

        const GetUnflag = currentMails.filter((item) => {
            return Array.isArray(item.flag) && !item.flag.includes("\\Seen");
        });
        setflagcount(GetUnflag.length);
    }

    // store filtered data because when delete then immediate not updating ,here we are updating Mails but data is shows from filteredMail, so need a state 
    const [StoredFilterdata, setStoredFilterdata] = useState([])
    useEffect(() => {
        setStoredFilterdata(filteredMails);
        flagfun()
    }, [currentMails, searchQuery, InInbox, InSend, InDraft, InTrash, Starred])

    console.log(selectedEmail, "dhhh")

    const threadMessages = selectedEmail
        ? currentMails.filter(
            msg =>
                (msg.references?.includes(selectedEmail.messageId) ||
                    msg.inReplyTo === selectedEmail.messageId) &&
                msg.messageId !== selectedEmail.messageId
        )
        : [];

    // select all mail
    const allSelected = filteredMails?.length > 0 &&
        filteredMails.every(mail =>
            CheckedId.some(item => item.uid === mail.uid));

    // move previous or next mail form email detail
    const [currentEmailIndex, setCurrentEmailIndex] = useState(0);

    const handleNextEmail = () => {
        if (currentEmailIndex < filteredMails.length - 1) {
            setCurrentEmailIndex(currentEmailIndex + 1);
            setSelectedEmail(filteredMails[currentEmailIndex + 1]);
        }
    };

    const handlePrevEmail = () => {
        if (currentEmailIndex > 0) {
            setCurrentEmailIndex(currentEmailIndex - 1);
            setSelectedEmail(filteredMails[currentEmailIndex - 1]);
        }
    };

    const [TodayDate, setTodayDay] = useState('');
    const TodayFun = () => {
        setTodayDay(
            new Date().toLocaleDateString(),
        );
    };

    useEffect(() => TodayFun, [currentMails])
    console.log(TodayDate, "ddddddddddddddd")


    // pagination 
    useEffect(() => {
        if (InSend) {
            handleSent('sent');
        } else if (InDraft) {
            handleSent('draft');
        } else if (InTrash) {
            handleSent('trash');
        }
    }, [pagesNo, InSend, InDraft, InTrash]);


    useEffect(() => {
        if (InInbox || InSend || InDraft || InTrash || Starred) {
            setpagesNo(1);
        }

    }, [InInbox, InSend, InDraft, InTrash, Starred]);

    return (
        <div className='flex flex-row relative h-screen overflow-hidden'>


            {/* Mobile Sidebar */}
            <div className={`md:hidden absolute left-0 top-0 h-full z-20 transition-all duration-300 ease-in-out ${mobileOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
                {mobileOpen && (
                    <div className='h-full flex flex-col bg-backgroundPaper shadow-lg rounded'>
                        <div className='flex justify-end p-2'>
                            <IconButton onClick={handleDrawerToggle}>
                                <Close />
                            </IconButton>
                        </div>
                        <div className='m-2'>
                            <Button variant='contained' className='w-full text-sm' onClick={() => { handleClickOpen(), setisReply(false), setCompose('') }} >Compose</Button>
                        </div>

                        <div className="relative w-full ">
                            {/* Left vertical line only if active */}
                            {InInbox && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 bg-blue-600 rounded-r-full opacity-80 transition-all " />
                            )}

                            <Button
                                className={`flex justify-start w-full text-sm mx-2 bg-backgroundPaper ${getActiveClass(InInbox)}`}
                                onClick={() => {
                                    handleInbox();
                                    InboxFun();
                                    handleBackToList();
                                }}
                                startIcon={<InboxIcon size={20} />}
                            >
                                <span className='flex justify-between items-center w-full'>
                                    <span>Inbox</span>
                                    {(flagcount > 0) &&
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full ${InInbox ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {flagcount}
                                        </span>
                                    }
                                </span>
                            </Button>
                        </div>

                        <div className="relative w-full ">
                            {/* Left vertical line only if active */}
                            {InSend && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 bg-blue-600 rounded-r-full opacity-80 transition-all " />
                            )}
                            <Button
                                className={`flex justify-start w-full text-sm mx-2 text-BackgroundPaper ${getActiveClass(InSend)}`}
                                onClick={() => { handleSent('sent'); SentFun(); handleBackToList() }}
                                startIcon={<i className='tabler-send' size={20} />}
                            >
                                Send
                            </Button>
                        </div>

                        <div className="relative w-full ">
                            {/* Left vertical line only if active */}
                            {InDraft && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 bg-blue-600 rounded-r-full opacity-80 transition-all " />
                            )}

                            <Button
                                className={`flex justify-start w-full text-sm mx-2 ${getActiveClass(InDraft)}`}
                                onClick={() => { handleSent('draft'); DraftFun(); handleBackToList() }}
                                startIcon={<DraftsIcon size={20} />}
                            >
                                Draft
                            </Button>
                        </div>

                        <div className="relative w-full ">
                            {/* Left vertical line only if active */}
                            {Starred && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 bg-blue-600 rounded-r-full opacity-80 transition-all " />
                            )}
                            <Button
                                className={`flex justify-start w-full text-sm mx-2 ${getActiveClass(Starred)}`}
                                onClick={() => { handleSent('starred'); StarredFun(); handleBackToList() }}
                                startIcon={<StarBorderRounded size={20} />}
                            >
                                Starred
                            </Button>
                        </div>

                        <div className="relative w-full ">
                            {/* Left vertical line only if active */}
                            {InTrash && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 bg-blue-600 rounded-r-full opacity-80 transition-all " />
                            )}
                            <Button
                                className={`flex justify-start w-full text-sm mx-2 ${getActiveClass(InTrash)}`}
                                onClick={() => { handleSent('trash'); TrashFun(); handleBackToList() }}
                                startIcon={<i className='tabler-trash' size={20} />}
                            >
                                Trash
                            </Button>
                        </div>

                        <div className='m-2 mt-4'>
                            <p className='opacity-40 text-2xl'>Labels</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <p className="m-0">Private</p>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                                <p className="m-0">Company</p>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                <p className="m-0">Important</p>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <p className="m-0">Personal</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop Sidebar */}
            <div className='hidden md:block w-1/5 h-full overflow-auto border-r rounded p-2 bg-backgroundPaper'>
                <div className='m-2'>
                    <Button variant='contained' className='w-full text-sm' onClick={() => { handleClickOpen(), setisReply(false), setCompose('') }}>Compose</Button>
                </div>

                <div className='m-2 flex gap-2 flex-col'>
                    <div className="relative w-full ">
                        {/* Left vertical line only if active */}
                        {InInbox && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 bg-blue-600 rounded-r-full opacity-80 transition-all " />
                        )}

                        <Button
                            className={`flex justify-start w-full text-sm mx-2 bg-backgroundPaper ${getActiveClass(InInbox)}`}
                            onClick={() => {
                                handleInbox();
                                InboxFun();
                                handleBackToList();
                            }}
                            startIcon={<InboxIcon size={20} />}
                        >
                            <span className='flex justify-between items-center w-full'>
                                <span>Inbox</span>
                                {(flagcount > 0) &&
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full ${InInbox ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                            }`}
                                    >
                                        {flagcount}
                                    </span>
                                }
                            </span>
                        </Button>
                    </div>

                    <div className="relative w-full ">
                        {/* Left vertical line only if active */}
                        {InSend && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 bg-blue-600 rounded-r-full opacity-80 transition-all " />
                        )}
                        <Button
                            className={`flex justify-start w-full text-sm mx-2  ${getActiveClass(InSend)}`}
                            onClick={() => { handleSent('sent'); SentFun(); handleBackToList() }}
                            startIcon={<i className='tabler-send' size={20} />}
                        >
                            Send
                        </Button>
                    </div>

                    <div className="relative w-full ">
                        {/* Left vertical line only if active */}
                        {InDraft && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 bg-blue-600 rounded-r-full opacity-80 transition-all " />
                        )}

                        <Button
                            className={`flex justify-start w-full text-sm mx-2 ${getActiveClass(InDraft)}`}
                            onClick={() => { handleSent('draft'); DraftFun(); handleBackToList() }}
                            startIcon={<DraftsIcon size={20} />}
                        >
                            Draft
                        </Button>
                    </div>

                    <div className="relative w-full ">
                        {/* Left vertical line only if active */}
                        {Starred && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 bg-blue-600 rounded-r-full opacity-80 transition-all " />
                        )}
                        <Button
                            className={`flex justify-start w-full text-sm mx-2 ${getActiveClass(Starred)}`}
                            onClick={() => { handleSent('starred'); StarredFun(); handleBackToList() }}
                            startIcon={<StarBorderRounded size={20} />}
                        >
                            Starred
                        </Button>
                    </div>

                    <div className="relative w-full ">
                        {/* Left vertical line only if active */}
                        {InTrash && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 bg-blue-600 rounded-r-full opacity-80 transition-all " />
                        )}
                        <Button
                            className={`flex justify-start w-full text-sm mx-2 ${getActiveClass(InTrash)}`}
                            onClick={() => { handleSent('trash'); TrashFun(); handleBackToList() }}
                            startIcon={<i className='tabler-trash' size={20} />}
                        >
                            Trash
                        </Button>
                    </div>
                </div>

                <div className='m-2 mt-4'>
                    <p className='opacity-70 text-md'>Labels</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <p className="m-0">Private</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                        <p className="m-0">Company</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        <p className="m-0">Important</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <p className="m-0">Personal</p>
                    </div>
                </div>
            </div>

            {/* Right Content Area */}

            {/* Right Content Area */}
            <div className='w-full md:w-10/12 h-full flex overflow-auto flex-col'>
                <div className='md:hidden p-2'>
                    <IconButton onClick={handleDrawerToggle}>
                        <MenuIcon />
                    </IconButton>
                </div>

                {isMounted && (
                    loading || pageloading || sentloading ? (
                        <div className="flex-1 flex justify-center items-center">
                            {/* <p className="text-gray-500 text-lg">Loading...</p>
                             */}
                            <CircularProgress size={40} />
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            {selectedEmail ? (
                                <motion.div
                                    key="email-detail"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-1"
                                >
                                    <EmailDetail
                                        moveToTrash={moveToTrash}
                                        setMails={setMails}
                                        fetchAllLabels={fetchAllLabels}
                                        DeleteLabelbyMsgId={DeleteLabelbyMsgId}
                                        getLabelbyMsgId={getLabelbyMsgId}
                                        SaveMail={SaveMail}
                                        email={selectedEmail}
                                        onBack={handleBackToList}
                                        setCompose={setCompose}
                                        handleClickOpen={handleClickOpen}
                                        setisReply={setisReply}
                                        thread={threadMessages}
                                        setisForward={setisForward}
                                        SaveStarred={SaveStarred}
                                        GetallLabel={GetallLabel}
                                        onNextEmail={handleNextEmail}
                                        onPrevEmail={handlePrevEmail}
                                        hasNextEmail={currentEmailIndex < filteredMails.length - 1}
                                        hasPrevEmail={currentEmailIndex > 0}
                                        // SentMails={SentMails}
                                        sentMails={sentMails}
                                        InDraft={InDraft}


                                    />



                                </motion.div>
                            ) : (
                                <motion.div
                                    key="email-list"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-1"
                                >
                                    <div className='my-1'>

                                        {/* <TextField
                                            id="outlined-search"
                                            fullWidth
                                            label="Search by Email , Subject or Body"
                                            type="search"
                                            value={searchQuery}

                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        /> */}

                                        <span className='flex gap-4 items-center my-1  border-y rounded'>
                                            <span className='p-3 bg-transparent'>
                                                <SearchIcon size={18} />
                                            </span>
                                            <input

                                                type="text"
                                                id="Search"
                                                value={searchQuery}

                                                placeholder='Search mail'
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className='m-0 p-0 border-none opacity-70 outline-none w-full h-10 bg-transparent'
                                            />
                                        </span>




                                        <div className='flex flex-row items-center border-b py-1'>
                                            {/* Select All Mails */}
                                            <div className="flex justify-between">

                                                <Tooltip title="Select All">
                                                    <Checkbox
                                                        className='ml-5'
                                                        checked={allSelected || false}
                                                        indeterminate={CheckedId.length > 0 && !allSelected}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            if (e.target.checked) {
                                                                setCheckedId(filteredMails.map(mail => ({ uid: mail.uid })));
                                                            } else {
                                                                setCheckedId([]);
                                                            }
                                                        }}
                                                    />
                                                </Tooltip>

                                                {InInbox && <span className='flex justify-end mx-4'>
                                                    <IconButton
                                                        color="primary"
                                                        onClick={refreshInbox}
                                                        title="Refresh"
                                                    >
                                                        <RefreshIcon />
                                                    </IconButton>
                                                </span>}

                                            </div>

                                            {/* If some emails are selected, show trash/delete icons */}
                                            {CheckedId.length > 0 && (
                                                <div className='flex justify-start items-center'>
                                                    {InTrash ? (
                                                        <Tooltip title="Delete Permanently">
                                                            <Trash2
                                                                size={20}
                                                                className='m-2 text-red-500 cursor-pointer'
                                                                onClick={(e) => {
                                                                    handlePermanentDelete(CheckedId);
                                                                    setMails(prev => prev.filter(mail => !CheckedId.some(item => item.uid === mail.uid)));
                                                                    setCheckedId([]);
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip title="Move to Trash">
                                                            <Trash2
                                                                size={20}
                                                                className='m-2 text-red-500 cursor-pointer'
                                                                onClick={() => {
                                                                    moveToTrash(CheckedId);
                                                                    setMails(prev => prev.filter(mail => !CheckedId.some(item => item.uid === mail.uid)));
                                                                    setCheckedId([]);
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                    </div>



                                    {(StoredFilterdata || []).map((item, i) => {
                                        const isSeen = item.flag?.includes("\\Seen");

                                        // Match labels using messageId
                                        const labelObj = GetallLabel.find(label => label.messageid === item.messageId);
                                        const labels = labelObj?.labels || [];

                                        return (
                                            <div
                                                key={i}
                                                className="border-b group flex flex-wrap sm:flex-nowrap items-center p-3  hover:bg-backgroundPaper cursor-pointer"
                                                onClick={() => handleEmailClick(item)}
                                            >
                                                {/* {!isSeen && (
                                                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block mx-2"></span>
                                                )} */}

                                                <span className="mx-2">
                                                    {/* <Checkbox /> */}
                                                    <Tooltip title="Select">

                                                        <Checkbox
                                                            checked={CheckedId.some(obj => obj.uid === item.uid)}
                                                            onClick={(e) => OnchangeCheck(e, item.uid)}
                                                        />
                                                    </Tooltip>



                                                </span>
                                                <span
                                                    className="mx-2 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        SaveStarred(item); // pass the email item to toggle star
                                                    }}
                                                >
                                                    {
                                                        (() => {
                                                            const labelObj = GetallLabel.find(label => label.messageid === item.messageId);
                                                            const isStarred = labelObj?.hasStarred ?? false;
                                                            return isStarred ? (<Tooltip title="Remove From Starred">
                                                                <StarBorder color="warning" />
                                                            </Tooltip>) : (<Tooltip title="Move To Starred">
                                                                <StarBorder />
                                                            </Tooltip>);
                                                        })()
                                                    }
                                                </span>



                                                {/* yaha se justify-between remove kiya h */}
                                                <div className="flex flex-col sm:flex-row  items-start sm:items-center flex-1 min-w-0 gap-0.5 sm:gap-3 mx-2">
                                                    {/* Sender Name */}
                                                    <p className={`text-sm truncate w-full sm:w-1/4 ${isSeen ? "font-normal text-gray-500" : "font-medium"}`}>
                                                        {item?.senderName}
                                                    </p>

                                                    {/* Subject and Labels */}
                                                    <div className="flex flex-row w-full sm:w-2/4 gap-0.5">
                                                        <p className={`text-sm mr-2 truncate ${isSeen ? "text-gray-500" : "font-semibold"}`}>
                                                            {item?.subject}
                                                        </p>

                                                        {/* Labels */}
                                                        <div className="flex flex-wrap gap-1">
                                                            {labels.map((label, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${label === 'Private' ? 'bg-red-500 text-white' :
                                                                        label === 'Company' ? 'bg-sky-500 text-white' :
                                                                            label === 'Important' ? 'bg-orange-500 text-white' :
                                                                                label === 'Personal' ? 'bg-green-500 text-white' :
                                                                                    'bg-gray-300 text-black'
                                                                        }`}
                                                                >
                                                                    {label}
                                                                </span>


                                                                // <span
                                                                //     key={idx}
                                                                //     className="text-xs px-2 py-0.5 rounded-full font-medium"
                                                                //     style={{
                                                                //         backgroundColor:
                                                                //             label === 'Private' ? 'rgb(254 226 226)' :
                                                                //                 label === 'Company' ? 'rgb(219 234 254)' :
                                                                //                     label === 'Important' ? 'rgb(254 249 195)' :
                                                                //                         'rgb(220 252 231)',
                                                                //         color:
                                                                //             label === 'Private' ? 'rgb(220 38 38)' :
                                                                //                 label === 'Company' ? 'rgb(37 99 235)' :
                                                                //                     label === 'Important' ? 'rgb(161 98 7)' :
                                                                //                         'rgb(22 163 74)'
                                                                //     }}
                                                                // >
                                                                //     {label}
                                                                // </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* {console.log(item)} */}
                                                <div className='flex justify-around items-center'>

                                                    <div >
                                                        {item?.attachments?.length > 0 && (
                                                            isSeen ? <AttachmentRounded className='opacity-60' /> : <AttachmentRounded className="font-bold" />

                                                        )}
                                                    </div>


                                                    {/* if msg date is today,s date , show time */}
                                                    {(new Date(item.date).toLocaleDateString()) == (TodayDate) ?
                                                        (
                                                            isSeen ?
                                                                (<div>
                                                                    <p className='text-sm opacity-60 mx-4'>{new Date(item.date).toLocaleTimeString([], {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                        hour12: true,
                                                                    })}</p>
                                                                </div>) : (
                                                                    <div>
                                                                        <p className='text-sm font-bold  mx-4'>{new Date(item.date).toLocaleTimeString([], {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                            hour12: true,
                                                                        })}</p>
                                                                    </div>
                                                                )) :

                                                        (
                                                            isSeen ? (
                                                                <div>
                                                                    <p className='text-sm opacity-60 mx-4'>{new Date(item.date).toLocaleDateString('gb')}</p>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <p className='text-sm font-bold mx-4'>{new Date(item.date).toLocaleDateString('gb')}</p>
                                                                </div>
                                                            )
                                                        )
                                                    }

                                                    {/* if other date show date */}


                                                </div>


                                                {/* Actions */}
                                                {InTrash ? (
                                                    <div className="opacity-0 mx-2 group-hover:opacity-100 transition-opacity duration-200 flex items-center ">
                                                        <Tooltip title="Delete Permanently">
                                                            <Trash2 size={20}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handlePermanentDelete(item);

                                                                }}

                                                                className="text-red-500 hover:scale-110 transition-transform cursor-pointer"
                                                            />
                                                        </Tooltip>

                                                        <Tooltip title="Restore Mail">
                                                            <RotateCcw
                                                                size={20}
                                                                onClick={async (e) => {
                                                                    e.stopPropagation();
                                                                    const response = await RestoreMail({ uid: item?.uid });
                                                                    if (response?.success == true) {
                                                                        toast.success(response?.message)
                                                                        setStoredFilterdata((prev) => prev.filter((mail) => mail.uid !== item.uid));

                                                                    }
                                                                }}
                                                                className="text-green-500 mx-2 hover:scale-110 transition-transform cursor-pointer"
                                                            />
                                                        </Tooltip>
                                                    </div>
                                                ) : (
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <Tooltip title="Move To Trash">
                                                            <Trash2
                                                                size={20}
                                                                onClick={async (e) => {
                                                                    e.stopPropagation();
                                                                    setMails((prev) => prev.filter((mail) => mail.uid !== item.uid));
                                                                    moveToTrash(item?.uid);
                                                                    setStoredFilterdata((prev) => prev.filter((mail) => mail.uid !== item.uid));
                                                                }}
                                                                className="text-red-500 hover:scale-110 transition-transform cursor-pointer"
                                                            />
                                                        </Tooltip>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}



                                </motion.div>
                            )}
                        </AnimatePresence>
                    )

                )}

                {InInbox && (
                    <div className='flex justify-end m-2'>
                        <PaginationRounded
                            count={Math.ceil(total / limit)}
                            // count={Math.ceil(totalPages / limit)}
                            page={page}
                            onChange={(event, value) => setPage(value)}
                        />
                    </div>

                )}

                {
                    (InSend || InDraft || InTrash) && (
                        <div className='flex justify-end m-2'>
                            <PaginationRounded
                                // count={Math.ceil( InSend ? totalPages : total / limit)}
                                count={Math.ceil(totalPages / limits)}
                                page={pagesNo}
                                onChange={(event, value) => setpagesNo(value)}

                            />
                        </div>

                    )
                }
                {/* <div className='flex justify-end m-2'>
                    <PaginationRounded
                        // count={Math.ceil( InSend ? totalPages : total / limit)}
                        count={Math.ceil(totalPages / limit)}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                    />
                </div> */}

            </div>
        </div>)
}

export default Email
