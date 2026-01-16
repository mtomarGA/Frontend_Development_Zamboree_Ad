'use client'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { useState, useEffect } from 'react'
import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import SortableItem from './SortableItem'
import TodoModal from '@/components/dialogs/add-todo'
import TodoService from '@/services/todoService'

export default function TodoBoard() {
  const ITEMS_PER_PAGE = 5

  const [unfinished, setUnfinished] = useState([])
  const [finished, setFinished] = useState([])
  const [unfinishedVisible, setUnfinishedVisible] = useState(ITEMS_PER_PAGE)
  const [finishedVisible, setFinishedVisible] = useState(ITEMS_PER_PAGE)
  const [open, setopen] = useState(false)
  const [editData, setEditData] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const data = await TodoService.getTodos()
    const unfinished = data.data
      .filter(item => item.status === false)
      .map(item => ({ id: item._id, description: item.description, createdAt: item.createdAt }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
    const finished = data.data
      .filter(item => item.status === true)
      .map(item => ({ id: item._id, description: item.description, createdAt: item.createdAt }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    setUnfinished(unfinished)
    setFinished(finished)
    setUnfinishedVisible(ITEMS_PER_PAGE)
    setFinishedVisible(ITEMS_PER_PAGE)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = event => {
    const { active, over } = event
    if (!active || !over || active.id === over.id) return

    const activeIdxUnfinished = unfinished.findIndex(item => item.id === active.id)
    const overIdxUnfinished = unfinished.findIndex(item => item.id === over.id)

    if (activeIdxUnfinished !== -1 && overIdxUnfinished !== -1) {
      setUnfinished(arrayMove(unfinished, activeIdxUnfinished, overIdxUnfinished))
      return
    }

    const activeIdxFinished = finished.findIndex(item => item.id === active.id)
    const overIdxFinished = finished.findIndex(item => item.id === over.id)

    if (activeIdxFinished !== -1 && overIdxFinished !== -1) {
      setFinished(arrayMove(finished, activeIdxFinished, overIdxFinished))
      return
    }
  }

  const handleCheck = async (id, text, status) => {
    setLoading(true)
    await TodoService.updateTodo(id, { description: text, status: status })
    await fetchData()
    setopen(false)
  }

  const handleCreateTodo = async data => {
    await TodoService.addTodo(data)
    await fetchData()
    setopen(false)
  }

  const handleUpdateToggle = async (id, data) => {
    setEditData({ id: id, body: data })
    setopen(true)
  }
  const handleDelete = async id => {
    setLoading(true)
    await TodoService.deleteTodo(id)
    await fetchData()
    setLoading(false)
  }

  return (
    <Box className='p-6'>
      {loading ? (
        <div className='flex justify-center items-center h-screen'>Loading...</div>
      ) : (
        <>
          <Box className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
            <Typography variant='h4' className='font-semibold'>Todo Board</Typography>
            <Button variant='contained' onClick={() => { setopen(true); setEditData('') }}>Add Todo</Button>
          </Box>

          <Box className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Unfinished Tasks */}
            <Card variant='outlined'>
              <CardContent>
                <Typography variant='h6' className='font-semibold mb-3'>⚠️ Unfinished To-Do's</Typography>
                {unfinished.length > 0 ? (
                  <>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={unfinished.slice(0, unfinishedVisible).map(item => item.id)} strategy={verticalListSortingStrategy}>
                        {unfinished.slice(0, unfinishedVisible).map(todo => (
                          <SortableItem
                            key={todo.id}
                            id={todo.id}
                            text={todo.description}
                            showCheckbox={true}
                            onCheck={handleCheck}
                            timestamp={todo.createdAt}
                            handleUpdateToggle={handleUpdateToggle}
                            handleDelete={handleDelete}
                            crossed={false}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                    {unfinishedVisible < unfinished.length && (
                      <Button variant='text' onClick={() => setUnfinishedVisible(prev => prev + ITEMS_PER_PAGE)}>
                        Load More
                      </Button>
                    )}
                  </>
                ) : (
                  <Typography className='text-center text-gray-500'>No unfinished tasks.</Typography>
                )}
              </CardContent>
            </Card>

            {/* Finished Tasks */}
            <Card variant='outlined'>
              <CardContent>
                <Typography variant='h6' className='font-semibold mb-3'>✅ Finished To-Do's</Typography>
                {finished.length > 0 ? (
                  <>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={finished.slice(0, finishedVisible).map(item => item.id)} strategy={verticalListSortingStrategy}>
                        {finished.slice(0, finishedVisible).map(todo => (
                          <SortableItem
                            key={todo.id}
                            id={todo.id}
                            text={todo.description}
                            crossed={true}
                            timestamp={todo.createdAt}
                            onCheck={handleCheck}
                            handleUpdateToggle={handleUpdateToggle}
                            handleDelete={handleDelete}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                    {finishedVisible < finished.length && (
                      <Button variant='text' onClick={() => setFinishedVisible(prev => prev + ITEMS_PER_PAGE)}>
                        Load More
                      </Button>
                    )}
                  </>
                ) : (
                  <Typography className='text-center'>No finished tasks.</Typography>
                )}
              </CardContent>
            </Card>
          </Box>

          <TodoModal
            data={editData}
            open={open}
            setOpen={setopen}
            handleAdd={handleCreateTodo}
            handleUpdate={handleCheck}
          />
        </>
      )}
    </Box>
  )
}
