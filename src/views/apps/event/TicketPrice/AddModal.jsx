'use client'
import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FormHelperText from '@mui/material/FormHelperText'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { MenuItem, Radio, RadioGroup, FormControlLabel } from '@mui/material'
import { toast } from 'react-toastify'
import TicketService from '@/services/event/event_mgmt/ticketService'
import { useAuth } from '@/contexts/AuthContext'

const AddModal = ({ open, handleClose, getdata, Eventid }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        Eventid: Eventid,
        ticket_name: '',
        description: '',
        avail_ticket: 'UNLIMITED',
        ticket_type: 'FREE',
        limited_ticket: '',
        without_variation_price: '',
        status: 'ACTIVE',
        user: user?._id,
        freeBookedTickets: 0,
        withoutVariationBooked: 0
    });

    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateFields = () => {
        const errors = {};

        if (!formData.ticket_name.trim()) {
            errors.ticket_name = 'Ticket name is required';
        }

        if (!formData.description.trim()) {
            errors.description = 'Description is required';
        }

        if (formData.ticket_type === 'PAID' && !formData.without_variation_price) {
            errors.without_variation_price = 'Price is required';
        } else if (formData.ticket_type === 'PAID' && isNaN(formData.without_variation_price)) {
            errors.without_variation_price = 'Price must be a number';
        }

        if (formData.avail_ticket === 'LIMITED') {
            if (!formData.limited_ticket) {
                errors.limited_ticket = 'Ticket quantity is required';
            } else if (isNaN(formData.limited_ticket)) {
                errors.limited_ticket = 'Ticket quantity must be a number';
            }
        }

        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async () => {
        const errors = validateFields();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsSubmitting(true);
        try {
            // Prepare the payload according to schema
            const payload = {
                ...formData,
                limited_ticket: formData.avail_ticket === 'LIMITED' ? Number(formData.limited_ticket) : 0,
                without_variation_price: formData.ticket_type === 'PAID' ? formData.without_variation_price : '0'
            };

            const response = await TicketService.Post(payload);
            if (response.success) {
                toast.success(response.message);
                getdata();
                handleClose();
            } else {
                toast.error(response.message || "Failed to add ticket");
            }
        } catch (error) {
            console.error("API Error:", error);
            toast.error(error.message || "Failed to add ticket");
        } finally {
            setIsSubmitting(false);
        }
    };


    useEffect(() => {
        // Reset form data when modal opens
        if (open) {
            setFormData({
                Eventid: Eventid,
                ticket_name: '',
                description: '',
                avail_ticket: 'UNLIMITED',
                ticket_type: 'FREE',

            });
            setFormErrors({});
        }
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth='md'
            PaperProps={{ sx: { overflow: 'visible' } }}
        >
            <DialogTitle>
                <div>Add Ticket</div>
                <DialogCloseButton onClick={handleClose} />
            </DialogTitle>
            <DialogContent>
                <div className='flex flex-col gap-4 p-2'>
                    <CustomTextField
                        fullWidth
                        name='ticket_name'
                        label='Ticket Name'
                        value={formData.ticket_name}
                        onChange={handleChange}
                        error={!!formErrors.ticket_name}
                        helperText={formErrors.ticket_name}
                        required
                    />

                    <CustomTextField
                        fullWidth
                        name='description'
                        label='Description'
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        error={!!formErrors.description}
                        helperText={formErrors.description}
                        required
                    />

                    <FormControl component="fieldset">
                        <FormLabel component="legend">Ticket Type</FormLabel>
                        <RadioGroup
                            row
                            name='ticket_type'
                            value={formData.ticket_type}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="FREE" control={<Radio />} label="Free" />
                            <FormControlLabel value="PAID" control={<Radio />} label="Paid" />
                        </RadioGroup>
                    </FormControl>

                    {formData.ticket_type === 'PAID' && (
                        <CustomTextField
                            fullWidth
                            name='without_variation_price'
                            label='Ticket Price (With taxes)'
                            type='number'
                            value={formData.without_variation_price || ''}
                            onChange={handleChange}
                            error={!!formErrors.without_variation_price}
                            helperText={formErrors.without_variation_price}
                            required={formData.ticket_type === 'PAID'}
                        />
                    )}

                    <FormControl component="fieldset" error={!!formErrors.avail_ticket}>
                        <FormLabel component="legend">Ticket Availability</FormLabel>
                        <RadioGroup
                            row
                            name='avail_ticket'
                            value={formData.avail_ticket || ''}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="UNLIMITED" control={<Radio />} label="Unlimited" />
                            <FormControlLabel value="LIMITED" control={<Radio />} label="Limited" />
                        </RadioGroup>
                    </FormControl>

                    {formData.avail_ticket === 'LIMITED' && (
                        <CustomTextField
                            fullWidth
                            name='limited_ticket'
                            label='Ticket Quantity'
                            type='number'
                            value={formData.limited_ticket || ''}
                            onChange={handleChange}
                            error={!!formErrors.limited_ticket}
                            helperText={formErrors.limited_ticket}
                            required={formData.avail_ticket === 'LIMITED'}
                        />
                    )}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant='contained'
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Adding...' : 'Add Ticket'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddModal;
