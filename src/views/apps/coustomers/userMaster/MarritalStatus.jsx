'use client'

// React Imports
import { useEffect, useState } from 'react'

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
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// App Imports
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import maritalStatus from '@/services/customers/maritalstatus'
import CustomTextField from '@core/components/mui/TextField'
import ColumnVisibility from '@/components/coustomer/UserMaster/MarritalStatus'

// Form & Toast
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'

const MaritalForm = () => {
  const [openInterestModal, setOpenInterestModal] = useState(false)
  const [getedData, setGetedData] = useState([])
  const {hasPermission} = useAuth()

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      status: 'Inactive'
    }
  })

  const getAllMaritalStatus = async () => {
    try {
      const result = await maritalStatus.getStatusMarital()
      setGetedData(result.data)
    } catch (error) {
      console.error('Error fetching marital status:', error)
    }
  }

  useEffect(() => {
    getAllMaritalStatus()
  }, [])

  const onSubmit = async data => {
  
  
    const formattedData = {
      ...data,
      name: data.name.toUpperCase(),
      status: data.status.toUpperCase()
    };
  
    try {
      const result = await maritalStatus.createMaritalStatus(formattedData);
      toast.success(result.message);
      reset();
      setOpenInterestModal(false);
      await getAllMaritalStatus(); // Refresh list
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to create marital status.';
      toast.error(errorMessage);
      console.error(error);
    }
  };
  

  return (
    <Card>
      <CardContent>
        <Grid xs={12} className='flex items-center justify-between'>
          <CardHeader title='Marital Status' />
          {hasPermission("user_user_master:add") && <Button
            variant='outlined'
            className='bg-[#7367F0] text-white'
            onClick={() => setOpenInterestModal(true)}
          >
            Add Marital Status
          </Button>}
        </Grid>
      </CardContent>

      {/* Modal */}
      <Dialog
        open={openInterestModal}
        maxWidth='lg'
        scroll='body'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton disableRipple onClick={() => setOpenInterestModal(false)}>
          <i className='tabler-x' />
        </DialogCloseButton>

        <DialogTitle>
          <Typography variant='h4'>Marital Status</Typography>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={6}>
              <Grid size={{xs:12}}>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label='Marital Status'
                      placeholder='Marriage'
                      error={!!errors.name}
                      helperText={errors.name && 'This field is required.'}
                    />
                  )}
                />
              </Grid>
              <Grid size={{xs:12}}>
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
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (selected) => {
                          if (!selected) {
                            return <span>Select Status</span>;
                          }
                          return selected.charAt(0) + selected.slice(1).toLowerCase(); // Capitalize
                        }
                      }}
                    >
                      <MenuItem value='Active'>Active</MenuItem>
                      <MenuItem value='Inactive'>Inactive</MenuItem>
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
      </Dialog>

      <ColumnVisibility getedData={getedData} />
    </Card>
  )
}

export default MaritalForm
