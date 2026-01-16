// React Imports
import { useState } from 'react'

import Image from 'next/image'
// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import { Avatar, CircularProgress } from '@mui/material'
import { Send } from 'lucide-react'

const AiModal = ({ AiModalopen, handleAiModalClose, setquery, ai, AiResponse, IsBotLoading, setCompose, Compose }) => {


    const index = AiResponse.length - 1;

    const setMsg = () => {

        let msg = AiResponse[index];
        // console.log(msg, "ssssssssss")
        setCompose({
            ...Compose, message: AiResponse[index]
        })
        handleAiModalClose();
    }


    return (
        <>

            <Dialog
                onClose={handleAiModalClose}
                aria-labelledby='customized-dialog-title'
                open={AiModalopen}
                // fullWidth
                closeAfterTransition={false}
                PaperProps={{
                    sx: {
                        // top: "10px",
                        overflow: 'visible',
                        width: '900px',
                        maxWidth: '90vw',
                    }
                }}
            >
                <DialogTitle id='customized-dialog-title'>
                    <Typography variant='h5' component='span'>
                        Use Ai
                    </Typography>
                    <DialogCloseButton onClick={handleAiModalClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>
                    <div className="w-full mx-auto p-6 bg-BackgroundPaper shadow rounded-md">
                        <h2 className="text-md font-medium mb-1">✨ AI assistant</h2>
                        <p className="text-gray-500 mb-4">
                            Experience the convenience of our AI-powered assistance. Simply provide the specifications, and it will generate a captivating content in seconds!
                        </p>


                        {AiResponse.length > 0 && (
                            <div className="border-2 rounded-lg p-4 overflow-auto max-h-[400px] space-y-4 bg-white shadow">
                                {AiResponse.map((item, i) => (
                                    <div key={i} className={`flex ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-start gap-2`}>
                                        <Avatar src='' alt={i % 2 === 0 ? 'You' : 'AI'} />
                                        <p className={`p-2 rounded-md max-w-[70%] ${i % 2 === 0 ? 'bg-gray-100 text-left' : 'bg-blue-100 text-right'}`}>
                                            {item}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}


                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden my-4">
                            <div className='p-2' >
                                <Avatar src='' alt='You' />
                            </div>
                            <input
                                type="text"
                                onChange={(e) => setquery(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2 text-sm focus:outline-none"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !IsBotLoading) {
                                        ai();
                                    }
                                }}
                            />

                            <button
                                className="bg-transparent hover:text-blue-600 text-gray-700 px-4 py-2 rounded flex items-center gap-2"
                                onClick={ai}
                                disabled={IsBotLoading}
                            >
                                {IsBotLoading ? (
                                    <CircularProgress size={18} className="text-blue-600" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </button>


                        </div>
                        <div>


                        </div>
                    </div>




                </DialogContent>
                <DialogActions>

                    <Button onClick={setMsg} variant='tonal' size='small'>
                        Accept Suggestion
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AiModal
