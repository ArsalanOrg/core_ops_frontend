import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import * as APIs from 'utils/APIs/APICenter.js'
import { FormatDate } from 'utils/Functions/UtilFunctions'
import LanguageLocalizer from 'utils/LanguageLocalizer.js'

const CreateTaskModal = ({
  isOpen,
  onClose,
  projectId,
  onTaskCreated,
  onTaskUpdated,
  editTask = false,
  taskData = null,
}) => {
  const [taskName, setTaskName] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [observer, setObserver] = useState('')
  const [projectMembers, setProjectMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  // useEffect(() => {
  //   if (isOpen && editTask && taskData) {
  //     // Populate form fields with existing task data when editing
  //     setTaskName(taskData.NAME.trim() || '')
  //     setTaskDescription(taskData.DESCRIPTION.trim() || '')
  //     setDueDate(FormatDate(taskData.DUE_DATE, false, true) || '')

  //     const assignedMember = projectMembers.find(member => member.UserName === taskData.ASSIGNED_TO)
  //     setAssignedTo(assignedMember ? assignedMember.USERID : '')
  //     const observingMember = projectMembers.find(member => member.UserName === taskData.OBSERVER)
  //     setObserver(observingMember ? observingMember.USERID : '')

  //   } else if (isOpen && !editTask) {
  //     // Clear fields for task creation
  //     setTaskName('')
  //     setTaskDescription('')
  //     setDueDate('')
  //     setAssignedTo('')
  //     setObserver('')
  //   }
  // }, [isOpen, editTask, taskData])

  // const fetchMembers = async () => {
  //   setProjectMembers(await APIs.GetProjectMembers(projectId))
  // }

  useEffect(() => {
    if (isOpen && !editTask) {
      // Clear form fields for creating a new task
      setTaskName('')
      setTaskDescription('')
      setDueDate('')
      setAssignedTo('')
      setObserver('')
      setIsLoading(true) // Reset loading state if needed
    }
  }, [isOpen, editTask])

  // Fetch project members when the modal opens
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const members = await APIs.GetProjectMembers(projectId)
        setProjectMembers(members)
        setIsLoading(false) // Set loading to false after fetching
      } catch (error) {
        console.error('Error fetching project members:', error)
        setIsLoading(false)
      }
    }

    if (isOpen) {
      setIsLoading(true) // Reset loading state
      fetchMembers()
    }
  }, [isOpen, projectId])

  // Populate form fields when task data is available and members are loaded
  useEffect(() => {
    if (!isLoading && editTask && taskData) {
      setTaskName(taskData.NAME.trim() || '')
      setTaskDescription(taskData.DESCRIPTION.trim() || '')
      setDueDate(FormatDate(taskData.DUE_DATE, false, true) || '')

      const assignedMember = projectMembers.find(
        (member) => member.UserName === taskData.ASSIGNED_TO
      )
      setAssignedTo(assignedMember ? assignedMember.UserID : '')

      const observingMember = projectMembers.find(
        (member) => member.UserName === taskData.OBSERVER
      )
      setObserver(observingMember ? observingMember.UserID : '')
    }
  }, [isLoading, editTask, taskData, projectMembers])
  // useEffect(() => {
  //   if (isOpen) {
  //     fetchMembers()
  //   }
  // }, [isOpen, projectId, onTaskCreated, onTaskUpdated, projectMembers])

  const handleSaveTask = async () => {
    if (!taskName || !dueDate || !assignedTo) {
      toast({
        title: LanguageLocalizer['missing_data'],
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      const taskDataToSend = {
        PROJECTID: projectId,
        NAME: taskName,
        DESCRIPTION: taskDescription,
        DUE_DATE: dueDate,
        ASSIGNED_TO: assignedTo,
        OBSERVER_USER_ID: Number(observer),
        STATUS: 1,
      }

      if (editTask && taskData) {
        // Update the existing task
        const response = await APIs.UpdateTask({
          ...taskDataToSend,
          START_DATE: taskData.START_DATE,
          TASKID: taskData.TASKID,
        })

        if (response) {
          toast({
            title: LanguageLocalizer['task_updated'],
            status: 'success',
            duration: 3000,
            isClosable: true,
          })

          onTaskUpdated() // Callback to refresh the task list
          onClose()
        } else {
          toast({
            title: 'Görev güncellenemedi',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }
      } else {
        // Create a new task
        const response = await APIs.CreateTask(taskDataToSend)
        if (response) {
          toast({
            title: LanguageLocalizer['task_created'],
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
          onTaskCreated() // Callback to refresh the task list
          onClose()
        } else {
          toast({
            title: 'Görev oluşturulamadı',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }
      }
    } catch (error) {
      toast({
        title: editTask
          ? LanguageLocalizer['task_updated_error']
          : LanguageLocalizer['task_created_error'],
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {editTask
            ? LanguageLocalizer['edit_task']
            : LanguageLocalizer['new_task']}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>{LanguageLocalizer['task_title']}</FormLabel>
            <Input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder={LanguageLocalizer['task_title']}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>{LanguageLocalizer['task_description']}</FormLabel>
            <Textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder={LanguageLocalizer['task_description']}
            />
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel>{LanguageLocalizer['task_due_date']}</FormLabel>
            <Input
              type='date'
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired mt={4}>
            <FormLabel>{LanguageLocalizer['task_assigned_to']}</FormLabel>
            <Select
              placeholder={LanguageLocalizer['select_user']}
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              {projectMembers.length > 0 &&
                projectMembers.map((member) => (
                  <option key={member.UserID} value={member.UserID}>
                    {member.FullName}
                  </option>
                ))}
            </Select>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>{LanguageLocalizer['task_observer']}</FormLabel>
            <Select
              placeholder={LanguageLocalizer['select_user']}
              value={observer}
              onChange={(e) => setObserver(e.target.value)}
            >
              {projectMembers &&
                projectMembers.length > 0 &&
                projectMembers.map((member) => (
                  <option key={member.UserID} value={member.UserID}>
                    {member.FullName}
                  </option>
                ))}
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant='ghost' mr={3} onClick={onClose}>
            {LanguageLocalizer['cancel']}
          </Button>
          <Button colorScheme='blue' onClick={handleSaveTask}>
            {editTask
              ? LanguageLocalizer['edit_task']
              : LanguageLocalizer['new_task']}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CreateTaskModal
