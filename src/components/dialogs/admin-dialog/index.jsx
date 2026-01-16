'use client'

import { useState, useEffect } from 'react'

import { useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, email, minLength, pipe, nonEmpty, array } from 'valibot'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

// Component Imports
import { toast } from 'react-toastify'
import Select from 'react-select'
import axios from 'axios'

import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../DialogCloseButton'
import adminService from '@/services/adminService'
import roleService from '@/services/roleService'

// ** Validation Schema **
const schema = object({
  fullName: pipe(string(), nonEmpty('Full Name is required'), minLength(3, 'Full Name must be at least 3 characters')),
  email: pipe(string(), minLength(1, 'Email is required'), email('Email is invalid')),
  password: pipe(
    string(),
    nonEmpty('Password is required'),
    minLength(5, 'Password must be at least 5 characters long')
  ),
  roles: array(string()) // Ensuring roles is an array of ObjectIds
})

const AddContent = ({ handleClose, setRefresh }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: valibotResolver(schema),
    defaultValues: {
      roles: [] // Ensure roles is initialized as an array
    }
  })

  const [roleOptions, setRoleOptions] = useState([])
  const [loadingRoles, setLoadingRoles] = useState(false)

  // Fetch role options from API
  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true)

      try {
        const response = await roleService.getRoles()

        const formattedRoles = response.data.map(role => ({
          value: role._id,
          label: role.name
        }))

        setRoleOptions(formattedRoles)
      } catch (error) {
        toast.error('Failed to load roles')
      } finally {
        setLoadingRoles(false)
      }
    }

    fetchRoles()
  }, [])

  const handleRoleChange = selected => {
    const selectedValues = selected.map(role => role.value)

    setValue('roles', selectedValues, { shouldValidate: true }) // Update roles in form state
  }

  const onSubmit = async data => {
    try {
      const res = await adminService.addAdmin(data)

      setRefresh(prev => !prev) // Toggle refresh to trigger useEffect

      toast.success(res?.message)

      handleClose()
    } catch (error) {
      console.log(error, 'error')
      toast.error(error?.response?.data?.message || 'Error Caught')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
        <CustomTextField
          {...register('fullName')}
          fullWidth
          label='Full Name'
          variant='outlined'
          placeholder='Enter Full Name'
          className='mbe-2'
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
        />
        <CustomTextField
          {...register('email')}
          fullWidth
          label='Email'
          variant='outlined'
          placeholder='Enter Email'
          className='mbe-2'
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <CustomTextField
          {...register('password')}
          fullWidth
          label='Password'
          variant='outlined'
          type='password'
          placeholder='Enter Password'
          className='mbe-2'
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        {/* Multi-Select Dropdown for Roles */}
        <label className='block text-sm font-medium text-gray-700'>Roles</label>
        <Select
          isMulti
          options={roleOptions}
          isLoading={loadingRoles}
          onChange={handleRoleChange}
          placeholder='Select Roles'
          className='mbe-2'
        />
        {errors.roles && <p className='text-red-500'>{errors.roles.message}</p>}
      </DialogContent>

      <DialogActions className='flex max-sm:flex-col max-sm:items-start max-sm:gap-2 justify-start pbs-0 sm:pbe-16 sm:pli-16'>
        <Button type='submit' variant='contained'>
          Create Admin
        </Button>
        <Button onClick={handleClose} variant='tonal' color='secondary' className='max-sm:mis-0'>
          Discard
        </Button>
      </DialogActions>
    </form>
  )
}

const AdminDialog = ({ open, setOpen, setRefresh }) => {
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      closeAfterTransition={false}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex flex-col gap-2 text-start sm:pbs-16 sm:pbe-2 sm:pli-16'>
        Add Admin
      </DialogTitle>
      <AddContent setRefresh={setRefresh} handleClose={handleClose} />
    </Dialog>
  )
}

export default AdminDialog
