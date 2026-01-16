'use client'

// React Imports
import { useRef, useState } from 'react'

// MUI Imports
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import { useRouter } from 'next/navigation'

const Todo = () => {
  // States
  const [open, setOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const route = useRouter()

  const handleNavigate = () => {
    route.push('/en/apps/todo')
  }


  return (
    <>
      <Tooltip
        title={'Todo'}
        onOpen={() => setTooltipOpen(true)}
        onClose={() => setTooltipOpen(false)}
        open={open ? false : tooltipOpen ? true : false}
        slotProps={{ popper: { className: 'capitalize' } }}
      >
        <IconButton  onClick={handleNavigate} className='text-textPrimary'>
          <i className='tabler-checklist' />
        </IconButton>
      </Tooltip>
      
    </>
  )
}

export default Todo
