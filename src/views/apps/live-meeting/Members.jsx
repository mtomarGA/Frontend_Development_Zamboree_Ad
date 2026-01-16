// 'use client'

// import React, { useEffect, useState } from 'react'
// import { createLiveMeetingsService } from '@/services/createLiveMeetingsService'

// const MeetingsForMember = () => {
//   const [meetings, setMeetings] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   // 🔑 Assume you store the logged-in user's ID in sessionStorage
//   const memberId = sessionStorage.getItem('user_id') // or wherever you store it

//   const fetchMeetings = async () => {
//     try {
//       const response = await createLiveMeetingsService.getMeetingsByMember(memberId)
//       setMeetings(response.data || [])
//     } catch (err) {
//       console.error(err)
//       setError(err.message || 'Error loading meetings')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (memberId) fetchMeetings()
//     else setError('User not logged in')
//   }, [memberId])

//   return (
//     <div className='max-w-4xl mx-auto mt-10 px-4'>
//       <h2 className='text-2xl font-bold mb-6'>My Meetings</h2>

//       {loading && <p>Loading meetings...</p>}
//       {error && <p className='text-red-600'>{error}</p>}
//       {!loading && !error && meetings.length === 0 && (
//         <p className='text-gray-500'>No meetings assigned to you.</p>
//       )}

//       <div className='space-y-4'>
//         {meetings.map(meeting => (
//           <div key={meeting._id} className='border rounded-lg p-4 shadow-sm bg-white'>
//             <h3 className='text-lg font-semibold'>{meeting.title}</h3>
//             <p className='text-sm text-gray-600'>Date: {new Date(meeting.meetingDateTime).toLocaleString()}</p>
//             <p className='text-sm text-gray-600'>Duration: {meeting.duration} minutes</p>

//             {meeting.meetingLink ? (
//               <a
//                 href={meeting.meetingLink}
//                 target='_blank'
//                 rel='noopener noreferrer'
//                 className='inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'
//               >
//                 Join Meeting
//               </a>
//             ) : (
//               <p className='text-sm text-gray-400 mt-3'>No meeting link provided.</p>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default MeetingsForMember
