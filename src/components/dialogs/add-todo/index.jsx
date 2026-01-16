// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../DialogCloseButton'
import { useState } from 'react'
import { MenuItem } from '@mui/material'

const AddContent = ({ handleClose, handleTodoAdd }) => {
  const [todoData, setTodoData] = useState({ description: '', status: false })

  const handleChange = (name, value) => {
    setTodoData({ ...todoData, [name]: value })
  }

  return (
    <>
      <DialogContent className='overflow-visible px-4 pt-2 sm:px-6'>
        <CustomTextField
          fullWidth
          label='Todo Description'
          variant='outlined'
          value={todoData.description}
          onChange={e => handleChange('description', e.target.value)}
          placeholder='Enter Todo content'
          className='mb-4'
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions className='flex flex-col sm:flex-row sm:justify-end gap-3 px-4 pb-4 sm:px-6 sm:pb-6'>
        <Button
          variant='contained'
          onClick={() => handleTodoAdd(todoData)}
          className='w-full sm:w-auto'
        >
          Create Todo
        </Button>
        <Button
          variant='outlined'
          onClick={handleClose}
          className='w-full sm:w-auto'
        >
          Cancel
        </Button>
      </DialogActions>
    </>
  )
}

const EditContent = ({ handleClose, data, handleUpdate }) => {
  const [editData, setEditData] = useState(data.body)
  console.log('editData', editData);
  

  const handleChange = (name, value) => {
    setEditData({ ...editData, [name]: value })
  }

  return (
    <>
      <DialogContent className='overflow-visible px-4 pt-2 sm:px-6'>
        <CustomTextField
          fullWidth
          size='small'
          variant='outlined'
          label='Todo Content'
          value={editData.description}
          onChange={e => handleChange('description', e.target.value)}
          placeholder='Enter Todo content'
          className='mb-4'
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions className='flex flex-col sm:flex-row sm:justify-end gap-3 px-4 pb-4 sm:px-6 sm:pb-6'>
        <Button
          variant='contained'
          onClick={() => handleUpdate(data.id, editData.description, editData.status)}
          className='w-full sm:w-auto'
        >
          Update
        </Button>
        <Button
          variant='outlined'
          onClick={handleClose}
          className='w-full sm:w-auto'
        >
          Cancel
        </Button>
      </DialogActions>
    </>
  )
}

const TodoModal = ({ open, setOpen, data, handleUpdate, handleAdd }) => {
  const handleClose = () => setOpen(false)

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      closeAfterTransition={false}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' , width: '80%'}  }}
    >
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='text-left px-4 pt-6 sm:px-6'>
        {data ? 'Edit Todo' : 'Add New Todo'}
      </DialogTitle>
      {data ? (
        <EditContent handleClose={handleClose} handleUpdate={handleUpdate} data={data} />
      ) : (
        <AddContent handleClose={handleClose} handleTodoAdd={handleAdd} />
      )}
    </Dialog>
  )
}

export default TodoModal
