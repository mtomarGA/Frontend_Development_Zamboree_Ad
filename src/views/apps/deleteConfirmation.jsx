import { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    IconButton,
    CircularProgress
} from '@mui/material';

const DeleteConfirmationDialog = ({
    itemName = 'item',
    onConfirm,
    onCancel,
    children,
    isLoading = false,
    confirmationText = 'Are you sure you want to delete this',
    cancelText = 'Cancel',
    confirmText = 'Delete',
    icon = <i className='tabler-trash text-red-500' />,
    dialogProps = {}
}) => {
    const [open, setOpen] = useState(false);

    const handleOpen = (e) => {
        e?.stopPropagation();
        setOpen(true);
    };

    const handleClose = () => {
        onCancel?.();
        setOpen(false);
    };

    const handleConfirm = async () => {
        try {
            await onConfirm();
            setOpen(false);
        } catch (error) {
            // Error handling can be added here
        }
    };

    return (
        <>
            {children ? (
                <span onClick={handleOpen} style={{ display: 'inline-flex' }}>
                    {children}
                </span>
            ) : (
                <IconButton onClick={handleOpen} size="small">
                    {icon}
                </IconButton>
            )}

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="xs"
                fullWidth
                {...dialogProps}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {confirmationText} {itemName}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        color="error"
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} /> : null}
                    >
                        {confirmText}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

DeleteConfirmationDialog.propTypes = {
    itemName: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    children: PropTypes.node,
    isLoading: PropTypes.bool,
    confirmationText: PropTypes.string,
    cancelText: PropTypes.string,
    confirmText: PropTypes.string,
    icon: PropTypes.node,
    dialogProps: PropTypes.object
};

export default DeleteConfirmationDialog;
