'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Helper: format date
const formatDate = dateStr => {
  try {
    if (!dateStr) return '-'
    const date = new Date(dateStr)

    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return '-'
  }
}

const RecentDevice = ({ selectedUser }) => {
  // Sort by latest LoginAt first, then take last 5
  const devices = (selectedUser?.loginDevices || [])
    .sort((a, b) => new Date(b.LoginAt) - new Date(a.LoginAt)) // sort descending
    .slice(0, 5) // only top 5

  return (
    <Card>
      <CardHeader title='Recent Devices' />
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Device Type</th>
              <th>Device Model</th>
              <th>Location</th>
              <th>Login At</th>
              <th>Login IP</th>
            </tr>
          </thead>
          <tbody>
            {devices.length > 0 ? (
              devices.map((device, index) => (
                <tr key={device._id || index}>
                  <td>
                    <Typography color='text.primary'>
                      {device.DeviceType || '-'}
                    </Typography>
                  </td>
                  <td>
                    <Typography>{device.DeviceModel || '-'}</Typography>
                  </td>
                  <td>
                    <Typography>{device.Location || '-'}</Typography>
                  </td>
                  <td>
                    <Typography>{formatDate(device.LoginAt)}</Typography>
                  </td>
                  <td>
                    <Typography>{device.LoginIp || '-'}</Typography>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>
                  <Typography align='center' className='py-4'>
                    No device activity found.
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default RecentDevice
