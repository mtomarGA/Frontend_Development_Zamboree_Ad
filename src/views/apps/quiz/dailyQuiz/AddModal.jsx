'use client'

import { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { MenuItem } from '@mui/material'
import Grid from '@mui/material/Grid2'

import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import DailyQuizRoute from '@/services/quiz/dailyQuizServices'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'

const AddModal = ({ open, handleClose, handleClickOpen, GetDailyQuizFun }) => {
    const [date, setDate] = useState(new Date())
    const { hasPermission } = useAuth()
    const [Adddata, setAdddata] = useState({ status: 'INACTIVE', maxQues: '', winning: '' })
    const [formErrors, setFormErrors] = useState({})

    const validateFields = (data) => {
        let errors = {}
        if (!data.date) errors.date = 'Date is required'
        if (!data.entry_fee) errors.entry_fee = 'Entry Fee is required'
        if (!data.status) errors.status = 'Status is required'
        if (!data.prize) errors.prize = 'Prize is required'
        if (!data.terms) errors.terms = 'Term and condition is required'
        if (!data.maxQues) errors.maxQues = 'Maximum Questions is required'
        if (!data.winning) errors.winning = 'Winning Percentage is required'
        if (isNaN(data.scorePerCorrectAns) || data.scorePerCorrectAns < 0) errors.scorePerCorrectAns = 'Score Credit Per Correct Answer must be a non-negative number'
        if (!data.ques_duration) errors.ques_duration = 'Question Duration is required'
        return errors
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        // Restrict to numbers only for specific fields
        if (['participate_point', 'prize'].includes(name) && !/^\d*$/.test(value)) {
            return
        }

        setAdddata((prev) => ({ ...prev, [name]: value }))

        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    const handleSubmit = async () => {
        const errors = validateFields({ ...Adddata })
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }

        try {
            const response = await DailyQuizRoute.Post(Adddata)
            if (response.success === true) {
                toast.success(response.message)
                GetDailyQuizFun()
                handleClose()
            }
        } catch (error) {
            toast.error('Failed to add Daily Quiz')
            console.error(error)
        }
    }

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby='customized-dialog-title'
            open={open}
            closeAfterTransition={false}
            PaperProps={{ sx: { overflow: 'visible' } }}
        >
            <DialogTitle id='customized-dialog-title'>
                <Typography variant='h5' component='span'>
                    Add Daily Quiz
                </Typography>
                <DialogCloseButton onClick={handleClose} disableRipple>
                    <i className='tabler-x' />
                </DialogCloseButton>
            </DialogTitle>

            <DialogContent>
                <Grid size={{ xs: 12, md: 4 }}>
                    <AppReactDatepicker
                        selected={Adddata.date ? new Date(Adddata.date) : ""}
                        className='m-2 w-96'
                        minDate={new Date()}
                        id='basic-input'
                        dateFormat='dd/MM/yyyy'
                        onChange={(date) => setAdddata({ ...Adddata, date: date })}
                        placeholderText='Click to select a date'
                        customInput={
                            <CustomTextField
                                label='Date'
                                fullWidth
                                error={!!formErrors.date}
                                helperText={formErrors.date}
                            />
                        }
                    />
                </Grid>

                <div className='m-2'>
                    <CustomTextField
                        className='w-96'
                        name='entry_fee'
                        label='Entry Fee'
                        type='number'
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }}
                        onKeyDown={(e) => {
                            if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault()
                        }}
                        onChange={handleChange}
                        value={Adddata.entry_fee || ''}
                        multiline
                        rows={1}
                        variant='outlined'
                        error={!!formErrors.entry_fee}
                        helperText={formErrors.entry_fee}
                    />
                </div>

                <div className='m-2'>
                    <CustomTextField
                        className='w-96'
                        name='prize'
                        label='Prize'
                        type='number'
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }}
                        onKeyDown={(e) => {
                            if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault()
                        }}
                        onChange={handleChange}
                        value={Adddata.prize || ''}
                        multiline
                        rows={1}
                        variant='outlined'
                        error={!!formErrors.prize}
                        helperText={formErrors.prize}
                    />
                </div>

                <div className='m-2'>
                    <CustomTextField
                        className='w-96'
                        name='maxQues'
                        label='Maximum Questions'
                        onChange={handleChange}
                        value={Adddata.maxQues || ''}
                        variant='outlined'
                        error={!!formErrors.maxQues}
                        helperText={formErrors.maxQues}
                    />
                </div>

                <div className='m-2'>
                    <CustomTextField
                        className='w-96'
                        name='winning'
                        label='Winning Percentage'
                        onChange={handleChange}
                        value={Adddata.winning || ''}
                        variant='outlined'
                        error={!!formErrors.winning}
                        helperText={formErrors.winning}
                    />
                </div>


                <div className='m-2'>
                    <CustomTextField
                        className='w-96'
                        name='ques_duration'
                        label='Question Duration'
                        type='number'
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }}
                        onKeyDown={(e) => {
                            if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault()
                        }}
                        onChange={handleChange}
                        value={Adddata.ques_duration || ''}
                        multiline
                        rows={1}
                        variant='outlined'
                        error={!!formErrors.ques_duration}
                        helperText={formErrors.ques_duration}
                    />
                </div>

                <div className='m-2'>
                    <CustomTextField
                        className='w-96'
                        name='scorePerCorrectAns'
                        label='Score Credit Per Correct Answer'
                        type='number'
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 0 }}
                        onKeyDown={(e) => {
                            if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault()
                        }}
                        onChange={handleChange}
                        value={Adddata.scorePerCorrectAns || ''}
                        multiline
                        rows={1}
                        variant='outlined'
                        error={!!formErrors.scorePerCorrectAns}
                        helperText={formErrors.scorePerCorrectAns}
                    />
                </div>

                <div className='m-2'>
                    <CustomTextField
                        className='w-96'
                        name='terms'
                        label='Terms and Conditions'
                        onChange={handleChange}
                        value={Adddata.terms || ''}
                        multiline
                        rows={4}
                        variant='outlined'
                        error={!!formErrors.terms}
                        helperText={formErrors.terms}
                    />
                </div>

                <div className='m-2'>
                    <CustomTextField
                        select
                        className='w-96'
                        name='status'
                        label='Status'
                        value={Adddata.status}
                        onChange={handleChange}
                        error={!!formErrors.status}
                        helperText={formErrors.status}
                    >
                        <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
                        <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
                    </CustomTextField>
                </div>
            </DialogContent>

            <DialogActions>
                {hasPermission('quiz_dailyquiz:add') && (
                    <Button onClick={handleSubmit} variant='contained'>
                        Add Daily Quiz
                    </Button>
                )}
                <Button onClick={handleClose} variant='tonal' color='secondary'>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddModal
