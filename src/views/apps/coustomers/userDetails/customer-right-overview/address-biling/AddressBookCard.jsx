'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import UserAddress from "@/services/customers/createService" // Assuming this path is correct
import AddNewAddress from '@components/dialogs/add-edit-address' // Assuming this path is correct
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick' // Assuming this path is correct
import { toast } from 'react-toastify' // Assuming toast is correctly imported and configured

const CustomerAddress = ({ typeOfAddress, isDefaultAddress, flat, mobile, state, zipCode, latitude, longitude, name, addressLine1, area, city, userId, id, fetchAddress, country, addresses }) => {

  // console.log(addressLine1, "addressLine1addressLine1");

  const [expanded, setExpanded] = useState(isDefaultAddress ? true : false)
  const theme = useTheme()

  const iconButtonProps = {
    children: <i className='tabler-edit' />,
    className: 'text-textSecondary'
  }


  const handleSetDefault = async () => {
    const data = {
      isDefault: true
    }
    const result = await UserAddress.setDefault(id, data)
    toast.success(result.message)
    fetchAddress()
  }

  const deleteAddress = async () => {
    userId
    const result = await UserAddress.deleteAdd(id, userId)
    toast.success(result.message)
    fetchAddress()
  }


  return (
    <>
      <div className='flex flex-wrap justify-between items-center mlb-3 gap-y-2'>
        <div className='flex items-center gap-2'>
          <IconButton
            size='large'
            sx={{
              '& i': {
                transition: 'transform 0.3s',
                transform: expanded ? 'rotate(0deg)' : theme.direction === 'ltr' ? 'rotate(-90deg)' : 'rotate(90deg)'
              }
            }}
            onClick={() => setExpanded(!expanded)}
          >
            <i className='tabler-chevron-down text-textPrimary' />
          </IconButton>
          <div className='flex flex-col items-start gap-1'>
            <div className='flex items-center gap-2'>
              <Typography color='text.primary' className='font-medium'>
                {typeOfAddress}
              </Typography>
              {isDefaultAddress && <Chip variant='tonal' color='success' label='Default Address' size='small' />}
            </div>
            {/* Displaying addressLine1 as streetAddress based on common usage */}
            <Typography>{addressLine1}</Typography>
          </div>
        </div>
        <div className='mis-10'>
          <OpenDialogOnElementClick
            element={IconButton}
            elementProps={iconButtonProps}
            dialog={AddNewAddress} // Component type
            dialogProps={{ userId, typeOfAddress, isDefaultAddress,fetchAddress, flat, mobile, state, zipCode, latitude, longitude, name, addressLine1, area, city, id, country }} // Pass props here
          />
          <IconButton onClick={deleteAddress} >
            <i className='tabler-trash text-textSecondary' />
          </IconButton>

          <IconButton onClick={handleSetDefault}>
            <i className='tabler-exclamation-mark text-textSecondary' />
          </IconButton>
        </div>
      </div>
      <Collapse in={expanded} timeout={300}>
        <div className='flex flex-col gap-1 pb-3 pis-14'>
          <Typography color='text.primary' className='font-medium'>
            {name}
          </Typography>
          <div>
            {/* Displaying addressLine1 as streetAddress and area as part of the address details */}
            <Typography>{addressLine1}</Typography>
            <Typography>{area}</Typography>
            <Typography>{city}</Typography>
          </div>
        </div>
      </Collapse>
    </>
  )
}


const AddressBook = ({ userId }) => {
  const id = userId?.selectedUser
  const [addresses, setAddresses] = useState([])

  // Fetch function moved outside useEffect
  const fetchAddress = async () => {
    try {
      const result = await UserAddress.getAddress(id)
      if (result?.data) {
        setAddresses(Array.isArray(result.data) ? result.data : [result.data])
      }
    } catch (error) {
      console.error("Failed to fetch address:", error)
      toast.error("Failed to load addresses.")
    }
  }

  // Call fetch on mount / when id changes
  useEffect(() => {
    if (id) fetchAddress()
  }, [id])

  return (
    <Card>
      <CardHeader
        title="Address Book"
        action={
          <OpenDialogOnElementClick
            element={Button}
            elementProps={{ variant: 'tonal', children: 'Add New Address', size: 'small' }}
            dialog={AddNewAddress}
            dialogProps={{ userId, addresses }}

          />
        }
      />


      <CardContent>
        {addresses.length > 0 ? (
          addresses.map(address => (
           

            <div key={address._id}>
              <CustomerAddress
                typeOfAddress={address.types}
                isDefaultAddress={address.isDefault|| ''}
                name={`${address.firstName || ''}`}
                addressLine1={address.addressLine1|| ''}
                area={address.landmark|| ''}
                city={address.city|| ''}
                userId={userId|| ''}
                flat={address.flat|| ''}
                state={address.state|| ''}
                zipCode={address.zipCode|| ''}
                latitude={address.latitude|| ''}
                longitude={address.longitude|| ''}
                mobile={address.mobile||""}
                country={address.country|| ''}
                id={address._id|| ''}
                fetchAddress={fetchAddress} // now properly passed
              />
              <Divider />
            </div>
          ))
        ) : (
          <Typography align="center" color="textSecondary">
            No addresses found. Add a new address!
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}


export default AddressBook
