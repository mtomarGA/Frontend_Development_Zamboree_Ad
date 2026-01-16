import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Box, Typography, Checkbox } from '@mui/material'

export default function SortableItem({
  id,
  text,
  crossed,
  showCheckbox,
  onCheck,
  handleUpdateToggle,
  timestamp,
  handleDelete
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleCheckboxClick = event => {
    event.stopPropagation()
    if (onCheck) onCheck(id, text, !crossed)
  }

  const formattedTimestamp = timestamp
    ? new Date(timestamp).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : '—'

  const bodyData = {
    description: text,
    status: crossed
  }

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex items-center  justify-between gap-4 border p-3 mb-2 rounded-lg shadow-sm ${
        isDragging ? 'ring-2 ring-blue-400 opacity-75' : ''
      }`}
    >
      {/* Drag handle */}
      <span {...listeners} className='cursor-grab pt-1 text-gray-500'>
        <i className='tabler-grip-vertical text-lg' />
      </span>
      <Checkbox
          size='small'
          checked={crossed}
          onClick={handleCheckboxClick}
          className='z-10'
        />

      {/* Main content */}
      <Box className='flex-1'>
        <Typography variant='h1' className={`text-sm ${crossed ? 'line-through ' : ''}`}>
          {text}
        </Typography>
        <Typography variant='caption' >
          {formattedTimestamp}
        </Typography>
      </Box>

      {/* Checkbox */}
     

      

      {/* Action buttons */}
      <Box className='flex gap-2 text-gray-400 mt-1'>
        <i
          onClick={() => handleUpdateToggle(id, bodyData)}
          className='tabler-edit cursor-pointer text-blue-500'
        />
        <i onClick={() => handleDelete(id)} className='tabler-trash cursor-pointer text-red-500' />
      </Box>
    </Box>
  )
}
