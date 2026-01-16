// 'use client'
// import { Avatar, Button, Card, Divider, Chip, MenuItem, Popover, Tooltip } from '@mui/material'
// import { ChevronLeft, ChevronRight, ForwardIcon, MoreVertical, Pencil, ReplyIcon, Star, Tags, Trash2 } from 'lucide-react'
// import { Download as DownloadIcon, StarBorder } from '@mui/icons-material'
// import React, { useEffect, useState } from 'react'
// import { toast } from 'react-toastify'


// function downloadFile(base64, filename, mimeType) {
//     try {
//         const link = document.createElement('a')
//         link.href = `data:${mimeType};base64,${base64}`
//         link.download = filename
//         document.body.appendChild(link)
//         link.click()
//         document.body.removeChild(link)
//     } catch (error) {
//         console.error('Error downloading file:', error)
//         alert('Failed to download file')
//     }
// }




// function renderTextWithLinks(text) {
//     if (!text) return <div className="text-sm text-gray-500 italic">No content</div>;

//     // Clean and normalize text
//     let modifiedText = text
//         .replace(/=3D/g, '=')
//         .replace(/=E2=80=AF/g, ' ')
//         .replace(/=C2=A0/g, ' ')
//         .replace(/=20/g, ' ')
//         .replace(/=\r\n/g, '')
//         .replace(/<[^>]+>/g, '')
//         .replace(/=+/g, '')
//         .replace(/\s{2,}/g, ' ')
//         .replace(/\n{3,}/g, '\n\n')
//         .trim();

//     // Gmail-style quote split
//     const quoteRegex = /On\s.*?wrote:/s;
//     const splitIndex = modifiedText.search(quoteRegex);

//     let visibleText = modifiedText;
//     let quotedText = '';

//     if (splitIndex !== -1) {
//         visibleText = modifiedText.slice(0, splitIndex).trim();
//         quotedText = modifiedText.slice(splitIndex).trim();
//     }

//     // ✅ Remove consecutive duplicate lines (case insensitive)
//     const removeDuplicateLines = (input) => {
//         const lines = input.split('\n');
//         const filtered = lines.filter((line, index, arr) => {
//             return index === 0 || line.trim().toLowerCase() !== arr[index - 1].trim().toLowerCase();
//         });
//         return filtered.join('\n');
//     };

//     visibleText = removeDuplicateLines(visibleText);
//     quotedText = removeDuplicateLines(quotedText);

//     const urlRegex = /(https?:\/\/[^\s"'<>()]+)/g;

//     const renderWithLinks = (textBlock) =>
//         textBlock.split('\n').map((line, index) => {
//             const parts = line.split(urlRegex);
//             return (
//                 <div key={index} className="mb-1 leading-relaxed break-words text-sm text-BackgroundPaper">
//                     {parts.map((part, i) =>
//                         urlRegex.test(part) ? (
//                             <a
//                                 key={i}
//                                 href={part}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="text-blue-600 underline hover:text-blue-800"
//                             >
//                                 {part.replace(/[.,;!?]*$/, '')}
//                             </a>
//                         ) : (
//                             <span key={i}>{part}</span>
//                         )
//                     )}
//                 </div>
//             );
//         });

//     return (
//         <div className="whitespace-pre-line">
//             {renderWithLinks(visibleText)}
//             {quotedText && (
//                 <details className="mt-2 text-sm text-gray-600 cursor-pointer">
//                     <summary className="underline">Show quoted text</summary>
//                     <div className="mt-2 pl-4 border-l border-gray-300 text-gray-600">
//                         {renderWithLinks(quotedText)}
//                     </div>
//                 </details>
//             )}
//         </div>
//     );
// }








































// // function renderTextWithLinks(text) {
// //     if (!text) return <div className="text-sm text-gray-500 italic">No content</div>;

// //     let modifiedText = text
// //         .replace(/=3D/g, '=')
// //         .replace(/=E2=80=AF/g, ' ')
// //         .replace(/=C2=A0/g, ' ')
// //         .replace(/=20/g, ' ')
// //         .replace(/=\r\n/g, '')
// //         .replace(/<[^>]+>/g, '')
// //         .replace(/=+/g, '')
// //         .trim();

// //     const urlRegex = /(https?:\/\/[^\s"'<>()]+)/g;

// //     return (
// //         <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} className="text-sm text-BackgroundPaper">
// //             {modifiedText.split('\n').map((line, index) => (
// //                 <div key={index}>
// //                     {line.split(urlRegex).map((part, i) =>
// //                         urlRegex.test(part) ? (
// //                             <a
// //                                 key={i}
// //                                 href={part}
// //                                 target="_blank"
// //                                 rel="noopener noreferrer"
// //                                 className="text-blue-600 underline hover:text-blue-800"
// //                             >
// //                                 {part.replace(/[.,;!?]*$/, '')}
// //                             </a>
// //                         ) : (
// //                             <span key={i}>{part}</span>
// //                         )
// //                     )}
// //                 </div>
// //             ))}
// //         </div>
// //     );
// // }





// function EmailDetail({
//     email,
//     handleClickOpen,
//     setMails,
//     thread,
//     setisReply,
//     setCompose,
//     onBack,
//     SaveMail,
//     getLabelbyMsgId,
//     fetchAllLabels,
//     DeleteLabelbyMsgId,
//     moveToTrash,
//     setisForward,
//     SaveStarred,
//     GetallLabel,
//     onNextEmail,
//     onPrevEmail,
//     hasNextEmail,
//     hasPrevEmail,
//     sentMails, InDraft
// }) {
//     const [formData, setFormData] = useState({
//         messageid: email?.messageId,
//         labels: email?.labels || []
//     })
//     const [tagsAnchorEl, setTagsAnchorEl] = useState(null)
//     const [showLabels, setShowLabels] = useState(false)
//     const [moreAnchorEl, setMoreAnchorEl] = useState(null)
//     const showMoreOptions = Boolean(moreAnchorEl)

//     const getLabel = async () => {
//         if (!email?.messageId) return
//         const res = await getLabelbyMsgId(email.messageId)
//         const labelList = res?.data?.[0]?.labels || []
//         setFormData(prev => ({
//             ...prev,
//             labels: labelList
//         }))
//     }

//     useEffect(() => {
//         if (email?.messageId) getLabel()
//     }, [email])

//     const handleLabelDelete = async labelToDelete => {
//         const updatedLabels = formData.labels.filter(label => label !== labelToDelete)

//         setFormData(prev => ({
//             ...prev,
//             labels: updatedLabels
//         }))

//         await SaveMail({
//             messageid: email.messageId,
//             labels: updatedLabels
//         })

//         try {
//             const response = await DeleteLabelbyMsgId({ messageid: email.messageId, labels: [labelToDelete] })
//             if (response.success === true) {
//                 fetchAllLabels()
//                 toast.success(response?.message)
//             }
//         } catch (err) {
//             console.error('Error deleting label:', err)
//         }
//     }

//     const handleTagsClick = (event) => {
//         setTagsAnchorEl(event.currentTarget)
//         setShowLabels(!showLabels)
//     }

//     const handleTagsClose = () => {
//         setTagsAnchorEl(null)
//         setShowLabels(false)
//     }

//     const handleMoreClose = () => setMoreAnchorEl(null)

//     const toggleLabel = async (label) => {
//         const isSelected = formData.labels.includes(label)
//         let updatedLabels

//         if (isSelected) {
//             updatedLabels = formData.labels.filter(l => l !== label)
//             try {
//                 const response = await DeleteLabelbyMsgId({
//                     messageid: email.messageId,
//                     labels: [label]
//                 })
//                 if (response.success) {
//                     toast.success(response.message)
//                 }
//             } catch (err) {
//                 console.error('Error deleting label:', err)
//                 toast.error('Failed to remove label')
//                 return
//             }
//         } else {
//             updatedLabels = [...formData.labels, label]
//             try {
//                 const response = await SaveMail({
//                     messageid: email.messageId,
//                     labels: updatedLabels
//                 })
//                 if (response.success) {
//                     toast.success(response.message)
//                 }
//             } catch (err) {
//                 console.error('Error adding label:', err)
//                 toast.error('Failed to add label')
//                 return
//             }
//         }

//         setFormData(prev => ({
//             ...prev,
//             labels: updatedLabels
//         }))
//         fetchAllLabels()
//     }

//     const labelObj = GetallLabel.find(label => label.messageid === email?.messageId)
//     const isStarred = labelObj?.hasStarred ?? false



//     const removeQuote = (originalMessage) => {
//         let cleanedText = originalMessage
//             // decode quoted-printable
//             .replace(/=3D/g, '=')
//             .replace(/=E2=80=AF/g, ' ')
//             .replace(/=C2=A0/g, ' ')
//             .replace(/=20/g, ' ')
//             .replace(/=\r\n/g, '')

//             // remove all "On ... wrote:" style blocks
//             .replace(/On .*? wrote:([\s\S]*?)(?=(\nOn .*? wrote:|$))/gi, '')

//             // remove HTML tags and clean up
//             .replace(/<[^>]+>/g, '')
//             .replace(/=+/g, '')
//             .replace(/\s{2,}/g, ' ')
//             .replace(/\n{3,}/g, '\n\n')
//             .trim();

//         return cleanedText

//     }

//     const handleReply = (mail = email) => {
//         setCompose('')
//         handleClickOpen();
//         setisReply(true);
//         setisForward(false);

//         if (InDraft) {
//             setCompose({
//                 to: [email.to],
//                 message: email?.body || '',
//                 subject: email?.subject
//             });
//             return;
//         }


//         console.log('handleReply called with:', mail);
//         // Get existing references
//         const existingReferences = mail.references || [];
//         const newReferences = [...new Set([...existingReferences, mail.messageId])];

//         if (mail.body) {
//             // Extract the original message (after last marker if exists)
//             let originalMessage = mail.body.includes('____original_message_____')
//                 ? mail.body.split(/____original_message_____/).pop().trim()
//                 : mail.body.trim();

//             // Format the "On [date] [sender] wrote:" line
//             const formattedDate = new Date(mail.date).toLocaleDateString('en-GB', {
//                 day: 'numeric',
//                 month: 'short',
//                 year: 'numeric',
//                 hour: '2-digit',
//                 minute: '2-digit'
//             });

//             const quoteHeader = `On ${formattedDate}, ${mail.from} wrote:`;

//             // // Indent the original message with >
//             const quotedMessage = originalMessage
//                 .split('\n')
//                 .map(line => `> ${line}`)
//                 .join('\n');

//             let cleanedText = originalMessage
//                 // decode quoted-printable
//                 .replace(/=3D/g, '=')
//                 .replace(/=E2=80=AF/g, ' ')
//                 .replace(/=C2=A0/g, ' ')
//                 .replace(/=20/g, ' ')
//                 .replace(/=\r\n/g, '')

//                 // remove all "On ... wrote:" style blocks
//                 .replace(/On .*? wrote:([\s\S]*?)(?=(\nOn .*? wrote:|$))/gi, '')

//                 // remove HTML tags and clean up
//                 .replace(/<[^>]+>/g, '')
//                 .replace(/=+/g, '')
//                 .replace(/\s{2,}/g, ' ')
//                 .replace(/\n{3,}/g, '\n\n')
//                 .trim();

//             // removeQuote(originalMessage)




//             setCompose({
//                 to: [mail?.from],
//                 subject: mail.subject?.startsWith('Re:') ? mail.subject : `Re: ${mail.subject}`,
//                 // message: `\n\n${quoteHeader}\n${quotedMessage}\n\n____original_message_____\n\n`,
//                 message: `\n\n\n\n\n\n\n${quoteHeader} ${cleanedText}\n\n`,
//                 inReplyTo: mail?.messageId,
//                 references: newReferences,
//                 query: `write a reply of  ${cleanedText}, not need for points,also not tell starting promt like Okie,here etc..`
//             });
//         }
//     };

//     const handleForward = () => {
//         setCompose('')
//         handleClickOpen()
//         setisForward(true)
//         setisReply(false);
//         // const formattedDate = new Date(email.date).toLocaleDateString('en-GB', {
//         //     day: 'numeric',
//         //     month: 'short',
//         //     year: 'numeric',
//         //     hour: '2-digit',
//         //     minute: '2-digit'
//         // });

//         // const quoteHeader = `On ${formattedDate}, ${email.from} wrote:`;
//         // const onlymsg = removeQuote(email?.body)
//         setCompose({
//             to: [],
//             subject: email.subject?.startsWith('Fwd:') ? email.subject : `Fwd: ${email.subject}`,
//             inReplyTo: email?.messageId,
//             references: [email?.messageId],
//             message: email?.body
//             // message: `${quoteHeader}\n ${onlymsg}\n\n`,
//         })
//     }


//     const [SentMsgdata, setSentMsgData] = useState([]);


//     // fetch SentMails
//     const fetchSentMsg = async () => {
//         if (email) {

//             // const response = await SentMails("sent");
//             // console.log(response, "inside Email details Sent mailzs");

//             const currentMessageId = email?.messageId;

//             const GetReplies = Array.isArray(sentMails)
//                 ? sentMails.filter((item) => {
//                     return (

//                         item?.inReplyTo === currentMessageId ||
//                         (Array.isArray(item?.references) && item.references.includes(currentMessageId))
//                     );
//                 })
//                 : [];

//             setSentMsgData(GetReplies || []);
//         }

//     };


//     useEffect(() => { fetchSentMsg() }, [email])




//     if (!email) return <div className='bg-backgroundPaper p-6'>No email selected</div>

//     return (
//         <div className='bg-backgroundPaper'>
//             <Card>
//                 <div className="px-4 py-3 border-b border-gray-200">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                             <Tooltip title="Back">
//                                 <ChevronLeft onClick={onBack} className="w-5 h-5 cursor-pointer" />
//                             </Tooltip>
//                             <p className="text-lg font-medium ">{email?.subject || '(No Subject)'}</p>
//                             {formData.labels.length > 0 && (
//                                 <div className="flex gap-1">
//                                     {formData.labels.map(label => (
//                                         <span
//                                             key={label}
//                                             className="text-xs px-2 py-0.5 rounded-full font-medium"
//                                             style={{
//                                                 backgroundColor:
//                                                     label === 'Private' ? 'rgb(254 226 226)' :
//                                                         label === 'Company' ? 'rgb(219 234 254)' :
//                                                             label === 'Important' ? 'rgb(254 249 195)' :
//                                                                 'rgb(220 252 231)',
//                                                 color:
//                                                     label === 'Private' ? 'rgb(220 38 38)' :
//                                                         label === 'Company' ? 'rgb(37 99 235)' :
//                                                             label === 'Important' ? 'rgb(161 98 7)' :
//                                                                 'rgb(22 163 74)'
//                                             }}
//                                         >
//                                             {label}
//                                         </span>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>

//                         <div className="flex items-center gap-2">
//                             <Tooltip title="Previous Mail">
//                                 <ChevronLeft size={20}
//                                     onClick={hasPrevEmail ? onPrevEmail : undefined}
//                                     className={`w-4 mx-2 h-4 cursor-pointer ${hasPrevEmail ? 'text-gray-500 hover:text-primary' : 'text-gray-300 cursor-default'
//                                         }`}
//                                 />
//                             </Tooltip>

//                             <Tooltip title="Next Mail">
//                                 <ChevronRight
//                                     onClick={hasNextEmail ? onNextEmail : undefined}
//                                     className={`w-4 h-4 cursor-pointer ${hasNextEmail ? 'text-gray-500 hover:text-primary' : 'text-gray-300 cursor-default'
//                                         }`}
//                                 />
//                             </Tooltip>
//                         </div>
//                     </div>

//                     <div className="flex items-center justify-between mt-4">
//                         <div className="flex items-center gap-6 text-gray-600">
//                             <Tooltip title="Move To Trash">
//                                 <Trash2
//                                     onClick={async () => {
//                                         await moveToTrash(email?.uid)
//                                         setMails((prev) => prev.filter((mail) => mail.uid !== email.uid))
//                                     }}
//                                     className="w-5 h-5 cursor-pointer hover:text-red-500"
//                                 />
//                             </Tooltip>

//                             <Tooltip title="Labels">
//                                 <Tags
//                                     className={`w-5 h-5 cursor-pointer hover:text-blue-500 ${showLabels ? 'text-blue-500' : ''
//                                         }`}
//                                     onClick={handleTagsClick}
//                                 />
//                             </Tooltip>
//                             {InDraft && (

//                                 <Tooltip title="Edit">
//                                     <Pencil
//                                         className={`w-5 h-5 cursor-pointer hover:text-blue-500 ${showLabels ? 'text-blue-500' : ''}`}
//                                         onClick={handleReply}

//                                     />
//                                 </Tooltip>
//                             )}



//                             <Popover
//                                 open={showLabels}
//                                 anchorEl={tagsAnchorEl}
//                                 onClose={handleTagsClose}
//                                 anchorOrigin={{
//                                     vertical: 'bottom',
//                                     horizontal: 'left',
//                                 }}
//                                 transformOrigin={{
//                                     vertical: 'top',
//                                     horizontal: 'left',
//                                 }}
//                             >
//                                 <div className="p-2 w-48">
//                                     <div className="text-sm font-medium px-3 py-2">Labels</div>
//                                     <MenuItem
//                                         onClick={() => toggleLabel('Private')}
//                                         selected={formData.labels.includes('Private')}
//                                     >
//                                         Private
//                                     </MenuItem>
//                                     <MenuItem
//                                         onClick={() => toggleLabel('Company')}
//                                         selected={formData.labels.includes('Company')}
//                                     >
//                                         Company
//                                     </MenuItem>
//                                     <MenuItem
//                                         onClick={() => toggleLabel('Important')}
//                                         selected={formData.labels.includes('Important')}
//                                     >
//                                         Important
//                                     </MenuItem>
//                                     <MenuItem
//                                         onClick={() => toggleLabel('Personal')}
//                                         selected={formData.labels.includes('Personal')}
//                                     >
//                                         Personal
//                                     </MenuItem>
//                                     {formData.labels.length > 0 && (
//                                         <div className="border-t border-gray-200 mt-2 pt-2 px-3">
//                                             <div className="text-xs text-gray-500 mb-1">Selected labels:</div>
//                                             <div className="flex flex-wrap gap-1">
//                                                 {formData.labels.map(label => (
//                                                     <Chip
//                                                         key={label}
//                                                         label={label}
//                                                         onDelete={() => toggleLabel(label)}
//                                                         size="small"
//                                                         color="primary"
//                                                     />
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </Popover>
//                         </div>

//                         <div className="flex items-center gap-4 text-gray-600">
//                             <span
//                                 className="mx-2 cursor-pointer"
//                                 onClick={(e) => {
//                                     e.stopPropagation()
//                                     SaveStarred(email)
//                                 }}
//                             >
//                                 {!isStarred ? (
//                                     <Tooltip title='Move to Starred'>
//                                         <StarBorder />
//                                     </Tooltip>
//                                 ) : (
//                                     <Tooltip title='Remove From Starred'>
//                                         <StarBorder color='warning' />
//                                     </Tooltip>
//                                 )}
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             </Card>

//             <div className='p-6'>
//                 <Card>
//                     <div className='flex flex-col sm:flex-row justify-between'>
//                         <div className='flex items-center gap-2 p-2'>
//                             <Avatar src={email.avatar} alt={email.from} className='w-10 h-10' />
//                             <div className='flex flex-col mx-2'>
//                                 {email?.senderName && <p className='text-sm'> {email?.senderName}</p>}
//                                 {email?.from && <p className='text-xs opacity-60'>{email?.from}</p>}
//                                 {email?.to && <p className='text-xs opacity-60'>To :{email?.to}</p>}
//                             </div>
//                         </div>
//                         <div className='flex items-center mx-4'>
//                             <p className='mx-2 opacity-60'>
//                                 {new Date(email?.date).toLocaleDateString('en-GB')}, {new Date(email.date).toLocaleTimeString('en-GB')}
//                             </p>
//                             <MoreVertical
//                                 className="mx-2 w-5 h-5 cursor-pointer"
//                                 onClick={(event) => setMoreAnchorEl(event.currentTarget)}
//                             />

//                             <Popover
//                                 open={showMoreOptions}
//                                 anchorEl={moreAnchorEl}
//                                 onClose={handleMoreClose}
//                                 anchorOrigin={{
//                                     vertical: 'bottom',
//                                     horizontal: 'right',
//                                 }}
//                                 transformOrigin={{
//                                     vertical: 'top',
//                                     horizontal: 'right',
//                                 }}
//                                 PaperProps={{
//                                     sx: { padding: 1 },
//                                 }}
//                             >
//                                 <div className='flex flex-col gap-1'>
//                                     <Button
//                                         startIcon={<ReplyIcon size={20} />}
//                                         onClick={() => {
//                                             handleMoreClose()
//                                             handleReply()
//                                         }}
//                                     >
//                                         Reply
//                                     </Button>
//                                     <Button
//                                         startIcon={<ForwardIcon size={20} />}
//                                         onClick={() => {
//                                             handleMoreClose()
//                                             handleForward()
//                                         }}
//                                     >
//                                         Forward
//                                     </Button>
//                                 </div>
//                             </Popover>
//                         </div>
//                     </div>

//                     <Divider />

//                     <div className='w-full overflow-auto'>
//                         <div className="p-8">
//                             {renderTextWithLinks(email.body)}
//                         </div>

//                     </div>

//                     <Divider />

//                     {email.attachments?.length > 0 && (
//                         <div>
//                             <div className='mx-4'>
//                                 <p>Attachments ({email?.attachments?.length})</p>
//                             </div>

//                             {email.attachments.map((file, index) => (
//                                 <div key={index} className='flex flex-wrap justify-between items-center p-6'>
//                                     <div>
//                                         <p>{file.filename}</p>
//                                     </div>
//                                     <div>
//                                         <Button
//                                             variant='tonal'
//                                             size='small'
//                                             onClick={() => downloadFile(file.content, file.filename, file.mimeType)}
//                                             startIcon={<DownloadIcon fontSize="small" />}
//                                         >
//                                             Download
//                                         </Button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </Card>

//                 {/* {thread?.length > 0 && (
//                     <div className="mt-6">
//                         <p className="text-lg font-medium mb-2">Conversation</p>
//                         {thread.map((msg, i) => (
//                             <Card key={i} className="p-4 mb-3">
//                                 <div className="flex justify-between items-start">
//                                     <div>
//                                         <p className="text-sm text-gray-600 mb-1">
//                                             From: {msg.from} | {new Date(msg.date).toLocaleString()}
//                                         </p>
//                                         {/* <p className="font-medium mb-1">{msg.subject}</p> */}
//                 {/* <div className="whitespace-pre-line">{renderTextWithLinks(msg.body)}</div> */}
//                 {/* </div> */}
//                 {/* <div className="flex gap-2">
//                                         <Tooltip title="Reply">
//                                             <Button
//                                                 variant="tonal"
//                                                 size="small"
//                                                 startIcon={<ReplyIcon size={16} />}
//                                                 onClick={() => {
//                                                     setisReply(true);
//                                                     setisForward(false);
//                                                     handleReply(msg)
//                                                     // setCompose({
//                                                     //     to: msg.from,
//                                                     //     subject: msg.subject?.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`,
//                                                     //     message: msg.body,
//                                                     //     inReplyTo: msg.messageId,
//                                                     //     references: [...(msg.references || []), msg.messageId]
//                                                     // });
//                                                     handleClickOpen();
//                                                 }}
//                                             >
//                                              Reply
//                                             </Button>
//                                         </Tooltip>
//                                         <Tooltip title="Forward">
//                                             <Button
//                                                 variant="tonal"
//                                                 size="small"
//                                                 startIcon={<ForwardIcon size={16} />}
//                                                 onClick={() => {
//                                                     setisReply(false);
//                                                     setisForward(true);
//                                                     setCompose({
//                                                         to: '',
//                                                         subject: msg.subject?.startsWith('Fwd:') ? msg.subject : `Fwd: ${msg.subject}`,
//                                                         message: msg.body,
//                                                         inReplyTo: msg.messageId,
//                                                         references: [msg.messageId]
//                                                     });
//                                                     handleClickOpen();
//                                                 }}
//                                             >
//                                                 Forward
//                                             </Button>
//                                         </Tooltip>
//                                     </div> */}
//                 {/* </div> */}
//                 {/* </Card> */}
//                 {/* ))} */}
//                 {/* </div> */}
//                 {/* )} */}

//                 {thread.concat(SentMsgdata).length > 0 && (
//                     <div className="mt-6">
//                         <p className="text-lg font-medium mb-2">Conversation</p>
//                         {[...thread, ...SentMsgdata]
//                             .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date
//                             .map((msg, i) => (
//                                 <Card key={i} className="p-4 mb-3">
//                                     <Card key={i} className="p-4 mb-3">
//                                         <div className="flex justify-between items-start">
//                                             <div>
//                                                 <p className="text-sm text-gray-600 mb-1">
//                                                     From: {msg.from} | {new Date(msg.date).toLocaleString()}
//                                                 </p>
//                                                 {/* <p className="font-medium mb-1">{msg.subject}</p> */}
//                                                 <div className="whitespace-pre-line">{renderTextWithLinks(msg?.body)}</div>
//                                             </div>
//                                             <div className="flex gap-2">
//                                                 <Tooltip title="Reply">
//                                                     <Button
//                                                         variant="tonal"
//                                                         size="small"
//                                                         startIcon={<ReplyIcon size={16} />}
//                                                         onClick={() => {
//                                                             setisReply(true);
//                                                             setisForward(false);
//                                                             handleReply(msg)
//                                                             // setCompose({
//                                                             //     to: msg.from,
//                                                             //     subject: msg.subject?.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`,
//                                                             //     message: msg.body,
//                                                             //     inReplyTo: msg.messageId,
//                                                             //     references: [...(msg.references || []), msg.messageId]
//                                                             // });
//                                                             handleClickOpen();
//                                                         }}
//                                                     >

//                                                         Reply
//                                                     </Button>
//                                                 </Tooltip>
//                                                 <Tooltip title="Forward">
//                                                     <Button
//                                                         variant="tonal"
//                                                         size="small"
//                                                         startIcon={<ForwardIcon size={16} />}
//                                                         onClick={() => {
//                                                             setisReply(false);
//                                                             setisForward(true);

//                                                             setCompose({
//                                                                 to: '',
//                                                                 subject: msg.subject?.startsWith('Fwd:') ? msg.subject : `Fwd: ${msg.subject}`,
//                                                                 message: msg.body,
//                                                                 inReplyTo: msg.messageId,
//                                                                 references: [msg.messageId]
//                                                             });
//                                                             handleClickOpen();
//                                                         }}
//                                                     >
//                                                         Forward
//                                                     </Button>
//                                                 </Tooltip>
//                                             </div>
//                                         </div>
//                                     </Card>
//                                 </Card>
//                             ))}
//                     </div>
//                 )}
//                 <div className='mt-2'>
//                     <Card className='p-4 flex gap-2 flex-wrap items-center'>
//                         <Button
//                             variant='tonal'
//                             size='small'
//                             startIcon={<ReplyIcon size={20} />}
//                             onClick={() => handleReply()}
//                         >
//                             Reply
//                         </Button>
//                         <Button
//                             variant='tonal'
//                             size='small'
//                             startIcon={<ForwardIcon size={20} />}
//                             onClick={handleForward}
//                         >
//                             Forward
//                         </Button>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default EmailDetail


'use client'
import { Avatar, Button, Card, Divider, Chip, MenuItem, Popover, Tooltip } from '@mui/material'
import { ChevronLeft, ChevronRight, ForwardIcon, MoreVertical, Pencil, ReplyIcon, Star, Tags, Trash2 } from 'lucide-react'
import { Download as DownloadIcon, StarBorder } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'


function downloadFile(base64, filename, mimeType) {
    try {
        const link = document.createElement('a')
        link.href = `data:${mimeType};base64,${base64}`
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    } catch (error) {
        console.error('Error downloading file:', error)
        alert('Failed to download file')
    }
}


function renderTextWithLinks(text) {
  if (!text) return <div className="text-sm text-gray-500 italic">No content</div>;

  // Minimal cleaning – only decode quoted-printable, don’t remove newlines
  let modifiedText = text
    .replace(/=3D/g, "=")
    .replace(/=E2=80=AF/g, " ")
    .replace(/=C2=A0/g, " ")
    .replace(/=20$/gm, "") // Remove trailing =20 only at end of lines
    .replace(/=\r?\n/g, "") // Remove soft line breaks only
    .replace(/<[^>]+>/g, "") // Remove HTML tags
    .trim();

  // Gmail-style quote split
  const quoteRegex = /On\s.*?wrote:/s;
  const splitIndex = modifiedText.search(quoteRegex);

  let visibleText = modifiedText;
  let quotedText = "";

  if (splitIndex !== -1) {
    visibleText = modifiedText.slice(0, splitIndex).trim();
    quotedText = modifiedText.slice(splitIndex).trim();
  }

  const urlRegex = /(https?:\/\/[^\s"'<>()]+)/g;

  // helper: render a block of text with links
  const renderWithLinks = (textBlock) => {
    return textBlock.split("\n").map((line, lineIndex) => {
      const parts = line.split(urlRegex);
      return (
        <React.Fragment key={lineIndex}>
          {parts.map((part, i) =>
            urlRegex.test(part) ? (
              <a
                key={i}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {part.replace(/[.,;!?]*$/, "")}
              </a>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
          {lineIndex < textBlock.split("\n").length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  // ✅ single return here only
  return (
    <div className="text-sm text-BackgroundPaper leading-relaxed">
      <div>{renderWithLinks(visibleText)}</div>
      {quotedText && (
        <details className="mt-4 text-sm text-gray-600 cursor-pointer">
          <summary className="underline hover:text-gray-800">Show quoted text</summary>
          <div className="mt-2 pl-4 border-l-2 border-gray-300 text-gray-600">
            {renderWithLinks(quotedText)}
          </div>
        </details>
      )}
    </div>
  );
}

function EmailDetail({
    email,
    handleClickOpen,
    setMails,
    thread,
    setisReply,
    setCompose,
    onBack,
    SaveMail,
    getLabelbyMsgId,
    fetchAllLabels,
    DeleteLabelbyMsgId,
    moveToTrash,
    setisForward,
    SaveStarred,
    GetallLabel,
    onNextEmail,
    onPrevEmail,
    hasNextEmail,
    hasPrevEmail,
    sentMails,
    InDraft
}) {
    const [formData, setFormData] = useState({
        messageid: email?.messageId,
        labels: email?.labels || []
    })
    const [tagsAnchorEl, setTagsAnchorEl] = useState(null)
    const [showLabels, setShowLabels] = useState(false)
    const [moreAnchorEl, setMoreAnchorEl] = useState(null)
    const showMoreOptions = Boolean(moreAnchorEl)

    const getLabel = async () => {
        if (!email?.messageId) return
        const res = await getLabelbyMsgId(email.messageId)
        const labelList = res?.data?.[0]?.labels || []
        setFormData(prev => ({
            ...prev,
            labels: labelList
        }))
    }

    useEffect(() => {
        if (email?.messageId) getLabel()
    }, [email])

    const handleLabelDelete = async labelToDelete => {
        const updatedLabels = formData.labels.filter(label => label !== labelToDelete)

        setFormData(prev => ({
            ...prev,
            labels: updatedLabels
        }))

        await SaveMail({
            messageid: email.messageId,
            labels: updatedLabels
        })

        try {
            const response = await DeleteLabelbyMsgId({ messageid: email.messageId, labels: [labelToDelete] })
            if (response.success === true) {
                fetchAllLabels()
                toast.success(response?.message)
            }
        } catch (err) {
            console.error('Error deleting label:', err)
        }
    }

    const handleTagsClick = (event) => {
        setTagsAnchorEl(event.currentTarget)
        setShowLabels(!showLabels)
    }

    const handleTagsClose = () => {
        setTagsAnchorEl(null)
        setShowLabels(false)
    }

    const handleMoreClose = () => setMoreAnchorEl(null)

    const toggleLabel = async (label) => {
        const isSelected = formData.labels.includes(label)
        let updatedLabels

        if (isSelected) {
            updatedLabels = formData.labels.filter(l => l !== label)
            try {
                const response = await DeleteLabelbyMsgId({
                    messageid: email.messageId,
                    labels: [label]
                })
                if (response.success) {
                    toast.success(response.message)
                }
            } catch (err) {
                console.error('Error deleting label:', err)
                toast.error('Failed to remove label')
                return
            }
        } else {
            updatedLabels = [...formData.labels, label]
            try {
                const response = await SaveMail({
                    messageid: email.messageId,
                    labels: updatedLabels
                })
                if (response.success) {
                    toast.success(response.message)
                }
            } catch (err) {
                console.error('Error adding label:', err)
                toast.error('Failed to add label')
                return
            }
        }

        setFormData(prev => ({
            ...prev,
            labels: updatedLabels
        }))
        fetchAllLabels()
    }

    const labelObj = GetallLabel.find(label => label.messageid === email?.messageId)
    const isStarred = labelObj?.hasStarred ?? false

    const removeQuote = (originalMessage) => {
        let cleanedText = originalMessage
            // decode quoted-printable
            .replace(/=3D/g, '=')
            .replace(/=E2=80=AF/g, ' ')
            .replace(/=C2=A0/g, ' ')
            .replace(/=20/g, ' ')
            .replace(/=\r\n/g, '')
            // remove all "On ... wrote:" style blocks
            .replace(/On .*? wrote:([\s\S]*?)(?=(\nOn .*? wrote:|$))/gi, '')
            // remove HTML tags and clean up
            .replace(/<[^>]+>/g, '')
            .replace(/=+/g, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        return cleanedText
    }

    const handleReply = (mail = email) => {
        setCompose('')
        handleClickOpen();
        setisReply(true);
        setisForward(false);

        if (InDraft) {
            setCompose({
                to: [email.to],
                message: email?.body || '',
                subject: email?.subject
            });
            return;
        }

        console.log('handleReply called with:', mail);
        // Get existing references
        const existingReferences = mail.references || [];
        const newReferences = [...new Set([...existingReferences, mail.messageId])];

        if (mail.body) {
            // Extract the original message (after last marker if exists)
            let originalMessage = mail.body.includes('____original_message_____')
                ? mail.body.split(/____original_message_____/).pop().trim()
                : mail.body.trim();

            // Format the "On [date] [sender] wrote:" line
            const formattedDate = new Date(mail.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const quoteHeader = `On ${formattedDate}, ${mail.from} wrote:`;

            let cleanedText = originalMessage
                // decode quoted-printable
                .replace(/=3D/g, '=')
                .replace(/=E2=80=AF/g, ' ')
                .replace(/=C2=A0/g, ' ')
                .replace(/=20/g, ' ')
                .replace(/=\r\n/g, '')
                // remove all "On ... wrote:" style blocks
                .replace(/On .*? wrote:([\s\S]*?)(?=(\nOn .*? wrote:|$))/gi, '')
                // remove HTML tags and clean up
                .replace(/<[^>]+>/g, '')
                .replace(/=+/g, '')
                .replace(/\s{2,}/g, ' ')
                .replace(/\n{3,}/g, '\n\n')
                .trim();

            setCompose({
                to: [mail?.from],
                subject: mail.subject?.startsWith('Re:') ? mail.subject : `Re: ${mail.subject}`,
                message: `\n\n\n\n\n\n\n${quoteHeader} ${cleanedText}\n\n`,
                inReplyTo: mail?.messageId,
                references: newReferences,
                query: `write a reply of  ${cleanedText}, not need for points,also not tell starting promt like Okie,here etc..`
            });
        }
    };

    const handleForward = () => {
        setCompose('')
        handleClickOpen()
        setisForward(true)
        setisReply(false);

        setCompose({
            to: [],
            subject: email.subject?.startsWith('Fwd:') ? email.subject : `Fwd: ${email.subject}`,
            inReplyTo: email?.messageId,
            references: [email?.messageId],
            message: email?.body
        })
    }

    const [SentMsgdata, setSentMsgData] = useState([]);

    // fetch SentMails
    const fetchSentMsg = async () => {
        if (email) {
            const currentMessageId = email?.messageId;

            const GetReplies = Array.isArray(sentMails)
                ? sentMails.filter((item) => {
                    return (
                        item?.inReplyTo === currentMessageId ||
                        (Array.isArray(item?.references) && item.references.includes(currentMessageId))
                    );
                })
                : [];

            setSentMsgData(GetReplies || []);
        }
    };

    useEffect(() => { fetchSentMsg() }, [email])

    if (!email) return <div className='bg-backgroundPaper p-6'>No email selected</div>

    return (
        <div className='bg-backgroundPaper'>
            <Card>
                <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Tooltip title="Back">
                                <ChevronLeft onClick={onBack} className="w-5 h-5 cursor-pointer" />
                            </Tooltip>
                            <p className="text-lg font-medium ">{email?.subject || '(No Subject)'}</p>
                            {formData.labels.length > 0 && (
                                <div className="flex gap-1">
                                    {formData.labels.map(label => (
                                        <span
                                            key={label}
                                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                                            style={{
                                                backgroundColor:
                                                    label === 'Private' ? 'rgb(254 226 226)' :
                                                        label === 'Company' ? 'rgb(219 234 254)' :
                                                            label === 'Important' ? 'rgb(254 249 195)' :
                                                                'rgb(220 252 231)',
                                                color:
                                                    label === 'Private' ? 'rgb(220 38 38)' :
                                                        label === 'Company' ? 'rgb(37 99 235)' :
                                                            label === 'Important' ? 'rgb(161 98 7)' :
                                                                'rgb(22 163 74)'
                                            }}
                                        >
                                            {label}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Tooltip title="Previous Mail">
                                <ChevronLeft size={20}
                                    onClick={hasPrevEmail ? onPrevEmail : undefined}
                                    className={`w-4 mx-2 h-4 cursor-pointer ${hasPrevEmail ? 'text-gray-500 hover:text-primary' : 'text-gray-300 cursor-default'
                                        }`}
                                />
                            </Tooltip>

                            <Tooltip title="Next Mail">
                                <ChevronRight
                                    onClick={hasNextEmail ? onNextEmail : undefined}
                                    className={`w-4 h-4 cursor-pointer ${hasNextEmail ? 'text-gray-500 hover:text-primary' : 'text-gray-300 cursor-default'
                                        }`}
                                />
                            </Tooltip>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-6 text-gray-600">
                            <Tooltip title="Move To Trash">
                                <Trash2
                                    onClick={async () => {
                                        await moveToTrash(email?.uid)
                                        setMails((prev) => prev.filter((mail) => mail.uid !== email.uid))
                                    }}
                                    className="w-5 h-5 cursor-pointer hover:text-red-500"
                                />
                            </Tooltip>

                            <Tooltip title="Labels">
                                <Tags
                                    className={`w-5 h-5 cursor-pointer hover:text-blue-500 ${showLabels ? 'text-blue-500' : ''
                                        }`}
                                    onClick={handleTagsClick}
                                />
                            </Tooltip>
                            {InDraft && (
                                <Tooltip title="Edit">
                                    <Pencil
                                        className={`w-5 h-5 cursor-pointer hover:text-blue-500 ${showLabels ? 'text-blue-500' : ''}`}
                                        onClick={handleReply}
                                    />
                                </Tooltip>
                            )}

                            <Popover
                                open={showLabels}
                                anchorEl={tagsAnchorEl}
                                onClose={handleTagsClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                            >
                                <div className="p-2 w-48">
                                    <div className="text-sm font-medium px-3 py-2">Labels</div>
                                    <MenuItem
                                        onClick={() => toggleLabel('Private')}
                                        selected={formData.labels.includes('Private')}
                                    >
                                        Private
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => toggleLabel('Company')}
                                        selected={formData.labels.includes('Company')}
                                    >
                                        Company
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => toggleLabel('Important')}
                                        selected={formData.labels.includes('Important')}
                                    >
                                        Important
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => toggleLabel('Personal')}
                                        selected={formData.labels.includes('Personal')}
                                    >
                                        Personal
                                    </MenuItem>
                                    {formData.labels.length > 0 && (
                                        <div className="border-t border-gray-200 mt-2 pt-2 px-3">
                                            <div className="text-xs text-gray-500 mb-1">Selected labels:</div>
                                            <div className="flex flex-wrap gap-1">
                                                {formData.labels.map(label => (
                                                    <Chip
                                                        key={label}
                                                        label={label}
                                                        onDelete={() => toggleLabel(label)}
                                                        size="small"
                                                        color="primary"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Popover>
                        </div>

                        <div className="flex items-center gap-4 text-gray-600">
                            <span
                                className="mx-2 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    SaveStarred(email)
                                }}
                            >
                                {!isStarred ? (
                                    <Tooltip title='Move to Starred'>
                                        <StarBorder />
                                    </Tooltip>
                                ) : (
                                    <Tooltip title='Remove From Starred'>
                                        <StarBorder color='warning' />
                                    </Tooltip>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </Card>

            <div className='p-6'>
                <Card>
                    <div className='flex flex-col sm:flex-row justify-between'>
                        <div className='flex items-center gap-2 p-2'>
                            <Avatar src={email.avatar} alt={email.from} className='w-10 h-10' />
                            <div className='flex flex-col mx-2'>
                                {email?.senderName && <p className='text-sm'> {email?.senderName}</p>}
                                {email?.from && <p className='text-xs opacity-60'>{email?.from}</p>}
                                {email?.to && <p className='text-xs opacity-60'>To :{email?.to}</p>}
                            </div>
                        </div>
                        <div className='flex items-center mx-4'>
                            <p className='mx-2 opacity-60'>
                                {new Date(email?.date).toLocaleDateString('en-GB')}, {new Date(email.date).toLocaleTimeString('en-GB')}
                            </p>
                            <MoreVertical
                                className="mx-2 w-5 h-5 cursor-pointer"
                                onClick={(event) => setMoreAnchorEl(event.currentTarget)}
                            />

                            <Popover
                                open={showMoreOptions}
                                anchorEl={moreAnchorEl}
                                onClose={handleMoreClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                PaperProps={{
                                    sx: { padding: 1 },
                                }}
                            >
                                <div className='flex flex-col gap-1'>
                                    <Button
                                        startIcon={<ReplyIcon size={20} />}
                                        onClick={() => {
                                            handleMoreClose()
                                            handleReply()
                                        }}
                                    >
                                        Reply
                                    </Button>
                                    <Button
                                        startIcon={<ForwardIcon size={20} />}
                                        onClick={() => {
                                            handleMoreClose()
                                            handleForward()
                                        }}
                                    >
                                        Forward
                                    </Button>
                                </div>
                            </Popover>
                        </div>
                    </div>

                    <Divider />

                    <div className='w-full overflow-auto'>
                        <div className="p-8">
                            {renderTextWithLinks(email.body)}
                        </div>
                    </div>

                    <Divider />

                    {email.attachments?.length > 0 && (
                        <div>
                            <div className='mx-4'>
                                <p>Attachments ({email?.attachments?.length})</p>
                            </div>

                            {email.attachments.map((file, index) => (
                                <div key={index} className='flex flex-wrap justify-between items-center p-6'>
                                    <div>
                                        <p>{file.filename}</p>
                                    </div>
                                    <div>
                                        <Button
                                            variant='tonal'
                                            size='small'
                                            onClick={() => downloadFile(file.content, file.filename, file.mimeType)}
                                            startIcon={<DownloadIcon fontSize="small" />}
                                        >
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {thread.concat(SentMsgdata).length > 0 && (
                    <div className="mt-6">
                        <p className="text-lg font-medium mb-2">Conversation</p>
                        {[...thread, ...SentMsgdata]
                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                            .map((msg, i) => (
                                <Card key={i} className="p-4 mb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600 mb-1">
                                                From: {msg.from} | {new Date(msg.date).toLocaleString()}
                                            </p>
                                            <div>{renderTextWithLinks(msg?.body)}</div>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <Tooltip title="Reply">
                                                <Button
                                                    variant="tonal"
                                                    size="small"
                                                    startIcon={<ReplyIcon size={16} />}
                                                    onClick={() => {
                                                        setisReply(true);
                                                        setisForward(false);
                                                        handleReply(msg)
                                                        handleClickOpen();
                                                    }}
                                                >
                                                    Reply
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Forward">
                                                <Button
                                                    variant="tonal"
                                                    size="small"
                                                    startIcon={<ForwardIcon size={16} />}
                                                    onClick={() => {
                                                        setisReply(false);
                                                        setisForward(true);
                                                        setCompose({
                                                            to: '',
                                                            subject: msg.subject?.startsWith('Fwd:') ? msg.subject : `Fwd: ${msg.subject}`,
                                                            message: msg.body,
                                                            inReplyTo: msg.messageId,
                                                            references: [msg.messageId]
                                                        });
                                                        handleClickOpen();
                                                    }}
                                                >
                                                    Forward
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                    </div>
                )}

                <div className='mt-2'>
                    <Card className='p-4 flex gap-2 flex-wrap items-center'>
                        <Button
                            variant='tonal'
                            size='small'
                            startIcon={<ReplyIcon size={20} />}
                            onClick={() => handleReply()}
                        >
                            Reply
                        </Button>
                        <Button
                            variant='tonal'
                            size='small'
                            startIcon={<ForwardIcon size={20} />}
                            onClick={handleForward}
                        >
                            Forward
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default EmailDetail
