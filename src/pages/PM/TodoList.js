import { DeleteIcon, StarIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  IconButton,
  List,
  ListItem,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import * as APIs from 'utils/APIs/APICenter.js'
import { useGlobalState } from 'utils/GlobalState.ts'
import LanguageLocalizer from 'utils/LanguageLocalizer'

const ToDoList = () => {
  const { setTitle, setShowHint } = useGlobalState()
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')

  // Fetch tasks from the database on component mount
  useEffect(() => {
    setTitle(LanguageLocalizer['todo_list'])
    setShowHint(false)
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setTasks(await APIs.GetTodoList())
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  // Handle adding a new task
  const handleAddTask = async () => {
    if (newTask.trim() !== '') {
      try {
        const response = await APIs.CreateTodo({ title: newTask })
        setTasks([...tasks, response])
        setNewTask('')
      } catch (error) {
        console.error('Error adding task:', error)
      }
    }
  }

  // Handle deleting a task
  const handleDeleteTask = async (id) => {
    try {
      await APIs.DeleteTodo(id)
      setTasks(tasks.filter((task) => task.ID !== id))
      fetchTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  // Handle toggling task completion
  const handleToggleTask = async (task) => {
    try {
      const updatedStatus = task.COMPLETE_STATUS === 0 ? 1 : 0

      const updatedTask = { ...task, COMPLETE_STATUS: updatedStatus }

      await APIs.UpdateTodo({ id: task.ID, status: updatedStatus })
      setTasks(tasks.map((t) => (t.ID === task.ID ? updatedTask : t)))
      fetchTasks()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }
  const handlePriority = async (task) => {
    try {
      const updatedStatus = task.PRIORITY_LEVEL === 0 ? 1 : 0

      const updatedTask = { id: task.ID, priorityLevel: updatedStatus }

      await APIs.UpdatePriorityLevel(updatedTask)
      setTasks(tasks.map((t) => (t.ID === task.ID ? updatedTask : t)))
      fetchTasks()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  // Function to format date with 24-hour time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString)

    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // 24-hour format
      timeZone: 'Europe/Istanbul',
    })
  }

  return (
    <Box
      bg='gray.100'
      color='gray.800'
      p={8}
      mt={4}
      mb={4}
      width='30%'
      minWidth='280px'
      mx='auto'
      borderRadius='md'
      boxShadow='md'
    >
      <Heading mb={4} textAlign='center' fontSize='2xl' color='teal.600'>
        ToDo List
      </Heading>
      <Flex justifyContent='space-between'>
        <Text fontWeight='bold' mb={2}>
          Toplam: {tasks.length}
        </Text>
        <Text fontWeight='bold' mb={2}>
          Tamamlanan: {tasks.filter((task) => task.COMPLETE_STATUS).length}
        </Text>
      </Flex>
      <List spacing={3} mb={4}>
        {tasks.map((task) => (
          <ListItem
            key={task.ID}
            display='flex'
            flexDirection='column'
            bg='white'
            p={3}
            borderRadius='md'
            boxShadow='sm'
          >
            <Flex alignItems='center' justifyContent='space-between' w='100%'>
              <Flex alignItems='center' w='100%'>
                <Checkbox
                  colorScheme='teal'
                  isChecked={task.COMPLETE_STATUS}
                  onChange={() => handleToggleTask(task)}
                  mr={2}
                />
                <Text
                  textDecoration={
                    task.COMPLETE_STATUS ? 'line-through' : 'none'
                  }
                  fontSize='sm'
                  maxWidth='100%'
                  wordBreak='break-word'
                  whiteSpace='normal'
                  color={task.PRIORITY_LEVEL ? 'red.500' : 'gray.800'} // Text color based on priority
                >
                  {task.TITLE}
                </Text>
              </Flex>
              <Flex>
                <IconButton
                  icon={<StarIcon />}
                  colorScheme='yellow'
                  variant={task.PRIORITY_LEVEL ? 'solid' : 'outline'}
                  onClick={() => handlePriority(task)}
                  size='sm'
                  aria-label='Set Priority'
                  mr={2}
                />
                <IconButton
                  icon={<DeleteIcon />}
                  colorScheme='red'
                  variant='outline'
                  onClick={() => handleDeleteTask(task.ID)}
                  size='sm'
                />
              </Flex>
            </Flex>

            <VStack align='start' mt={2} fontSize='sm' color='gray.500'>
              <Text>Tarih: {formatDateTime(task.DATE)}</Text>
              {task.UPDATE_DATE !== '1900-01-01T00:00:00.000Z' &&
                task.COMPLETE_STATUS && (
                  <Text>Bitiş: {formatDateTime(task.UPDATE_DATE)}</Text>
                )}
            </VStack>
          </ListItem>
        ))}
      </List>

      <Flex>
        <Textarea
          placeholder='Add todo'
          value={newTask}
          borderRadius='5px'
          onChange={(e) => setNewTask(e.target.value)}
          bg='white'
          color='gray.800'
        />
      </Flex>
      <Flex mt={4} justifyContent='center'>
        <Button width='100%' colorScheme='teal' onClick={handleAddTask}>
          Todo Ekle
        </Button>
      </Flex>
    </Box>
  )
}

export default ToDoList
