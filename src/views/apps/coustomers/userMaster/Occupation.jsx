'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Occupation from '@/services/customers/occupation'
// Form Imports
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'

// Components Imports
import CustomTextField from '@core/components/mui/TextField'
import OccupationTable from '@/components/coustomer/UserMaster/Occupation'
import { useAuth } from '@/contexts/AuthContext'

const InterestForm = () => {
  const [openInterestModal, setOpenInterestModal] = useState(false)
  const {hasPermission} = useAuth()



  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      status: 'INACTIVE'
    }
  })




  const onSubmit = async data => {
    const formattedData = {
      ...data,
      name: data.name,
      status: data.status.toUpperCase()
    };
    const result = await Occupation.createOccupation(formattedData);
    // console.log('API Response:', result);

    toast.success(result.message);
    reset();
    setOpenInterestModal(false);
  };

  const [allUpdatedOccupation ,setAllUpdatedoccupation]=useState()

  const alloccupation=async()=>{
    const getAlloccupation=await Occupation.getAllOccupation()
    setAllUpdatedoccupation(getAlloccupation)
  }
  useEffect(()=>{
    alloccupation()
  },[openInterestModal])

  return (
    <Card >
      <CardContent>
        <Grid xs={12} className='flex items-center justify-between'>
          <CardHeader title='Occupation List' />
          {hasPermission("user_user_master:add") && <Button variant='outlined' className='bg-[#7367F0] text-white' onClick={() => setOpenInterestModal(true)}>
            Add Occupation
          </Button>}
        </Grid>
      </CardContent>

      <Dialog

        open={openInterestModal}

        maxWidth='md'
        scroll='body'
        setEditModalOpen={false}

        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={() => setOpenInterestModal(false)} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle>
          <Typography variant='h4'>Add Occupation</Typography>
        </DialogTitle>

        <DialogTitle variant='h4' className='flex gap-2 flex-col   '>

          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <Grid container spacing={6}>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name='name'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Occupation'
                        placeholder='Photography'
                        error={!!errors.name}
                        helperText={errors.name && 'This field is required.'}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Controller
                    name='status'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        select
                        label='Status'
                        error={!!errors.status}
                        helperText={errors.status && 'This field is required.'}
                      >
                        <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
                        <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
                      </CustomTextField>
                    )}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenInterestModal(false)}>Cancel</Button>
              <Button type='submit' variant='contained'>
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogTitle>

      </Dialog>

      <OccupationTable alloccupation={alloccupation} getAlloccupation={allUpdatedOccupation} />
    </Card>
  )
}

export default InterestForm
