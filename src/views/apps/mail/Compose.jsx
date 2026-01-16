// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import { Autocomplete, Avatar, CircularProgress, Popover, TextField, Tooltip } from '@mui/material'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import Image from '../../../services/imageService'
import GeminiService from '@/contexts/mail/GeminiService'
import { BotIcon } from 'lucide-react'
import CloseIcon from '@mui/icons-material/Close';


import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import AiModal from './AiModal'

export const ComposeModal = ({ isForward, open, handleClose, SendMail, Compose, setCompose, ChangeFun, SaveDraft, isReply, getEmailid }) => {
    const [formErrors, setFormErrors] = useState({})
    const [loading, setLoading] = useState(false);


    // const handleSubmit = async () => {
    //     const response = await SendMail()
    //     if (response.success === true) {
    //         handleClose()
    //         toast.success(response?.message || 'Email Sent')
    //     }
    // }

    // serach email 
    const [searchdata, setsearchdata] = useState('');
    const onchangeSearch = (e) => {
        setsearchdata(e.target.value)
    }


    const [Emailid, setEmailid] = useState([]);

    // const fetchemailByUSer = async () => {

    //     const response = await getEmailid(searchdata);
    //     setEmailid(response?.data || []);
    // }


    const fetchemailByUSer = async () => {
        const response = await getEmailid(searchdata);

        // Remove duplicate email entries
        const uniqueList = Array.from(
            new Map((response?.data || []).map(item => [item.email, item])).values()
        );

        setEmailid(uniqueList);
    };


    useEffect(() => { if (searchdata) fetchemailByUSer() }, [searchdata]);





    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await SendMail();
            if (response.success === true) {
                toast.success(response?.message || 'Email Sent');
                handleClose();
            } else {
                toast.error(response?.message || 'Failed to send email');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (open && !isReply && !isForward) {
            // setCompose({
            //     attachments: [],
            //     to: '',
            //     subject: '',
            //     inReplyTo: '',
            //     // references: ''
            // });

            setCompose({
                attachments: [],
                to: [], // not ''
                subject: '',
                inReplyTo: '',
            });

            setAiResponse([]);
        }
    }, [open, isReply, isForward]);


    const [SaveDraftLoading, setSaveDraftLoading] = useState(false);
    const saveDraftFun = async () => {
        setSaveDraftLoading(true);
        const response = await SaveDraft()
        if (response.success === true) {
            setSaveDraftLoading(false);
            toast.success(response?.message)
            handleClose()
        }
    }

    const [filename, setfilename] = useState('')
    console.log(filename)
    const handleFileChange = async (e) => {
        const { files } = e.target;
        const uploaded = [];

        for (const file of files) {
            const result = await Image.uploadImage({ image: file });
            if (result?.data?.url) {
                uploaded.push({
                    url: result.data.url,
                    filename: file.name
                });
            }
        }

        setCompose((prev) => ({
            ...prev,
            attachments: [...(prev.attachments || []), ...uploaded]
        }));

        if (formErrors.attachments) {
            setFormErrors((prev) => ({ ...prev, attachments: '' }));
        }
    };

    const handleRemoveAttachment = (url) => {
        setCompose((prev) => ({
            ...prev,
            attachments: prev.attachments.filter((item) => item.url !== url)
        }));
    };


    // ai modal
    const [AiModalopen, setAiModalOpen] = useState(false)
    const handleAiModalOpen = () => setAiModalOpen(true)
    const handleAiModalClose = () => setAiModalOpen(false)
    const [AiResponse, setAiResponse] = useState([]);
    console.log(AiResponse, "ssssssssssss")

    const [IsBotLoading, setIsBotLoading] = useState(false);
    const [query, setquery] = useState('');

    // console.log(query, "ss")
    // const ai = async () => {
    //     setIsBotLoading(true);
    //     setShowSparkle(true);
    //     const response = await GeminiService.GetGemini(query || Compose.query || `write a message on ${Compose.subject}, not need for points,also not tell starting prompt like Okie,here etc.. `);
    //     // console.log(response)
    //     const msg = response.text.replace(/\*\*/g, '');

    //     if (AiModalopen) {
    //         setAiResponse(prev => {
    //             // Find next even index (0, 2, 4, ...)
    //             const nextIndex = prev.length === 0 ? 0 : Math.ceil(prev.length / 2) * 2;
    //             const updated = [...prev];
    //             updated[nextIndex] = msg;
    //             return updated;
    //         });
    //     } else {
    //         setAiResponse([msg]);
    //     }



    //     if (response?.text) {
    //         setIsBotLoading(false)
    //         setCompose(prev => ({
    //             ...prev,
    //             message: msg
    //         }));
    //         return;
    //     }
    //     setIsBotLoading(false);
    //     setShowSparkle(false);
    // };


    const ai = async () => {
        setIsBotLoading(true);
        setShowSparkle(true);

        try {
            const prompt = query || Compose.query || `write a message on ${Compose.subject}, not need for points, also not tell starting prompt like Okie, here etc.. `;
            const response = await GeminiService.GetGemini(prompt);
            const msg = response.text.replace(/\*\*/g, '');

            if (AiModalopen) {
                setIsBotLoading(true);
                setAiResponse(prev => {
                    const updated = [...prev];
                    const baseIndex = prev.length;

                    // Store prompt at even index and response at odd index
                    updated[baseIndex] = prompt;
                    updated[baseIndex + 1] = msg;
                    return updated;
                });

                return
            } else {
                setAiResponse([prompt, msg]);
                // return;
            }

            if (response?.text) {
                setCompose(prev => ({
                    ...prev,
                    message: msg
                }));
            }
        } catch (error) {
            console.error("AI fetch failed:", error);
        } finally {
            setIsBotLoading(false);
            setShowSparkle(false);
        }
    };


    // const [aiOpen, setAiOpen] = useState(false);

    // const handleCloseAi = () => {
    //     setAiOpen(false);

    // };

    // const handleClickAi = (event) => {
    //     setAiOpen(true);
    // };


    const [showSparkle, setShowSparkle] = useState(false)


    const handleClickAndRunAI = () => {
        setShowSparkle(true)
        ai()
    }




    return (

        <>

            {/* <Button variant='outlined' onClick={handleAiModalOpen}>
                Open dialog
            </Button> */}
            <AiModal AiModalopen={AiModalopen} IsBotLoading={IsBotLoading} AiResponse={AiResponse} ai={ai} handleAiModalClose={handleAiModalClose} handleAiModalOpen={handleAiModalOpen} setquery={setquery} setCompose={setCompose} Compose={Compose} />

            <Dialog
                onClose={handleClose}
                aria-labelledby='customized-dialog-title'
                open={open}
                // fullWidth
                closeAfterTransition={false}
                fullWidth
                maxWidth={false} // Disable default MUI width constraints
                PaperProps={{
                    sx: {
                        overflow: 'visible',
                        width: '900px', // or '1000px', '80vw', etc.
                        maxWidth: '90vw', // optional: limit it responsively
                    }
                }}
            >
                <DialogTitle id='customized-dialog-title'>
                    <Typography variant='h5' component='span'>
                        {(isReply) && "Reply Email"}
                        {(isForward) && "Forward Email"}
                        {(!isReply && !isForward) && " Compose Email"}
                    </Typography>
                    <DialogCloseButton onClick={handleClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>

                <DialogContent>
                    <div>


                        {/*  */}



                        {/* <TextField
                        id='to'
                        label='To:'
                        name='to'
                        value={Compose?.to || ''}

                        className='m-2'
                        onChange={(e) => { ChangeFun(e); onchangeSearch(e) }}
                        fullWidth
                        variant='standard'
                        disabled={isReply}
                    /> */}

                        <Autocomplete
                            multiple
                            freeSolo
                            options={Emailid}
                            getOptionLabel={(option) => {
                                if (typeof option === 'string') {
                                    return option;
                                }
                                return option.email ? `${option.name || option.email} <${option.email}>` : '';
                            }}
                            filterOptions={(options, params) => {
                                // Filter existing options
                                const filtered = options.filter(option =>
                                    option.email.toLowerCase().includes(params.inputValue.toLowerCase()) ||
                                    (option.name && option.name.toLowerCase().includes(params.inputValue.toLowerCase()))
                                );

                                // Add the current input value as an option if it looks like an email
                                const inputValue = params.inputValue.trim();
                                if (inputValue && !filtered.some(option => option.email === inputValue)) {
                                    filtered.push(inputValue);
                                }

                                return filtered;
                            }}
                            onInputChange={(event, newInputValue) => {
                                setsearchdata(newInputValue);
                            }}
                            onChange={(event, newValue) => {
                                setCompose(prev => ({
                                    ...prev,
                                    to: newValue.map(item => typeof item === 'string' ? item : item.email)
                                }));
                            }}
                            value={Compose.to ? Compose.to.map(email => {
                                // Find if this email exists in our options
                                const found = Emailid.find(opt => opt.email === email);
                                return found || email;
                            }) : []}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="To:"
                                    variant="standard"
                                    fullWidth
                                    className="m-2"
                                    disabled={isReply}
                                />
                            )}
                            renderOption={(props, option) => {
                                if (typeof option === 'string') {
                                    return (
                                        <li {...props} key={option}>
                                            {option}
                                        </li>
                                    );
                                }
                                return (
                                    <li {...props} key={option.email}>
                                        <div className="flex items-center gap-2">
                                            {option.avatar && (
                                                <Avatar src={option.avatar} sx={{ width: 24, height: 24 }} />
                                            )}
                                            <div>
                                                {option.name && <span>{option.name}</span>}
                                                <span className="text-gray-500 ml-1">
                                                    {option.name ? `<${option.email}>` : option.email}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            }}
                        />



                        <TextField
                            className='m-2'
                            id='subject'
                            label='Subject:'
                            value={Compose?.subject || ''}
                            onChange={ChangeFun}
                            name='subject'
                            fullWidth
                            variant='standard'
                        />

                        <TextField
                            className='m-2 mt-4'
                            id='message'
                            label='Message:'
                            name='message'
                            value={Compose?.message || ''}
                            onChange={ChangeFun}
                            fullWidth
                            multiline
                            rows={8}
                        />





                        {/* 
                        {aiOpen && (
                            <>
                                <TextField
                                    className='m-2 mt-4'

                                    label='Ai'
                                    name="query"
                                    onChange={(e) => setquery(e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={2}
                                />
                                <div className='flex items-center'>
                                    <Tooltip title="Click To Generate">

                                        <Button variant='tonal' className='mx-2' size='small' onClick={ai} startIcon={IsBotLoading && <CircularProgress size={18} color='inherit' />} disabled={IsBotLoading}>Generate</Button>
                                    </Tooltip>


                                    <Tooltip title="Close Ai">

                                        < CloseIcon className='cursor-pointer' onClick={handleCloseAi} />
                                    </Tooltip>
                                </div>
                            </>
                        )} */}





                        <div className='flex justify-end items-center gap-2 flex-row mx-2'>


                            <p onClick={handleAiModalOpen} className='cursor-pointer text-sm'>AI assistant </p>

                            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>

                            {/* Ai suggestion */}
                            <div className=''>

                                <div className=''>
                                    {IsBotLoading ? (
                                        <div style={{ position: 'relative', display: 'inline-block', height: 28, width: 28 }}>
                                            {showSparkle && (
                                                <AutoAwesomeIcon
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        color: '#fdd835',
                                                        fontSize: 28,
                                                        animation: 'sparkleAnim 1s ease-in-out infinite',
                                                        '@keyframes sparkleAnim': {
                                                            '0%': {
                                                                opacity: 0,
                                                                transform: 'scale(0.5) rotate(0deg)'
                                                            },
                                                            '50%': {
                                                                opacity: 1,
                                                                transform: 'scale(1.4) rotate(45deg)'
                                                            },
                                                            '100%': {
                                                                opacity: 0,
                                                                transform: 'scale(0.5) rotate(90deg)'
                                                            }
                                                        }
                                                    }}
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <Typography
                                            onClick={handleClickAndRunAI}
                                            component={'div'}
                                            sx={{
                                                // color: "blue",
                                                cursor: 'pointer',
                                                '&:hover': { textDecoration: 'underline' }
                                            }}
                                        >
                                            {(isReply && open) && <p className='text-sm text-blue-400'>
                                                Auto Reply
                                            </p>}
                                            {(open && !isReply && !isForward) &&
                                                (
                                                    <p className='text-sm text-blue-400'>
                                                        AI Auto Message according subject
                                                    </p>
                                                )}

                                        </Typography>
                                    )}
                                </div>

                            </div>
                        </div>



                        <div className='m-2 flex flex-col border-2 rounded p-2'>

                            <label htmlFor='attachment'>Attachments:</label>
                            <Tooltip title="Please Attach Pdf or Images">

                                <input
                                    type='file'
                                    id='attachment'
                                    name='attachments'
                                    className='my-2'
                                    multiple
                                    onChange={handleFileChange}
                                />
                            </Tooltip>

                            {/* Preview uploaded files */}
                            {Array.isArray(Compose?.attachments) && Compose.attachments.length > 0 && (
                                <ul className="text-sm text-gray-700 pl-0">
                                    {Compose.attachments.map((attachment, index) => (
                                        <li key={index} className="flex items-center gap-3 my-2">
                                            <Avatar
                                                src={attachment.url}
                                                alt={`attachment-${index}`}
                                                sx={{ width: 48, height: 48 }}
                                            />
                                            <span className="truncate max-w-xs">{attachment?.filename}</span>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleRemoveAttachment(attachment.url)}
                                            >
                                                Remove
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}

                        </div>
                    </div>
                </DialogContent>

                <DialogActions className='flex justify-between items-center flex-wrap'>

                    <div>
                        <Tooltip title="Click To Save As Draft">

                            <Button variant='contained' onClick={saveDraftFun} startIcon={(SaveDraftLoading) && <CircularProgress size={18} color='inherit' />} disabled={SaveDraftLoading} >
                                Save As Draft
                            </Button>
                        </Tooltip>
                    </div>
                    <div className='flex flex-wrap mt-2'>
                        <Tooltip title="Click To Send">

                            <Button
                                onClick={handleSubmit}
                                variant='contained'
                                disabled={loading}
                                startIcon={loading && <CircularProgress size={18} color='inherit' />}
                            >
                                {loading ? 'Sending...' : 'Send'}
                            </Button>
                        </Tooltip>

                        {/* 
                    <Tooltip title="Close?">

                        <Button onClick={handleClose} variant='tonal' color='secondary'>
                            Close
                        </Button>
                    </Tooltip> */}

                        {/* <Button onClick={handleSubmit} variant='contained'>
                        Send
                    </Button> */}

                    </div>
                </DialogActions>
            </Dialog >

        </>
    )
}
