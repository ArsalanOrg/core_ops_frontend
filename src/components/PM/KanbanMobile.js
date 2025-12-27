import React, { useState } from 'react'
import {
  AddIcon,
  ArrowForwardIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  DeleteIcon,
  EditIcon,
} from '@chakra-ui/icons'
import { Button, Flex, useToast } from '@chakra-ui/react'
import CommentModal from 'components/PM/CommentModal.js'
import CreateTaskModal from 'components/PM/CreateTaskModal.js'
import { IoMdArchive } from 'react-icons/io'
import 'style/Kanban.js.css'
import * as APIs from 'utils/APIs/APICenter.js'
import LanguageLocalizer from 'utils/LanguageLocalizer.js'

const Kanban = ({ tasks, projectId, updateKanban }) => {
  const toast = useToast()
  const phases = ['yapilacak', 'devamEden', 'tamamlanan', 'arsiv']
  
  const [selectedTask, setSelectedTask] = useState(null)
  const [isCommentModalOpen, setCommentModalOpen] = useState(false)
  const [isCreateTaskModalOpen, setCreateTaskModalOpen] = useState(false)
  const [isEditMode, setEditMode] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)

  const handleTaskCreated = () => {
    setCreateTaskModalOpen(true)
    updateKanban()
  }

  const handleEditTask = (task) => {
    setTaskToEdit(task)
    setCreateTaskModalOpen(true)
  }

  const handleOpenComments = (task) => {
    setSelectedTask(task)
    setCommentModalOpen(true)
  }

  const handleCloseComments = () => {
    setSelectedTask(null)
    setCommentModalOpen(false)
  }

  const moveToNextPhase = async (task, currentPhase) => {
    const currentIndex = phases.indexOf(currentPhase)
    if (currentIndex < phases.length - 1) {
      const response = await APIs.StageUpdate({
        id: task.TASKID,
        stage: currentIndex + 1,
      })
      if (response) updateKanban()
      else {
        toast({
          title: 'Stage update error',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom',
        })
      }
    }
  }

  const moveToPreviousPhase = async (task, currentPhase) => {
    const currentIndex = phases.indexOf(currentPhase)
    if (currentIndex > 0) {
      const response = await APIs.StageUpdate({
        id: task.TASKID,
        stage: currentIndex - 1,
      })
      if (response) updateKanban()
      else {
        toast({
          title: 'Stage update error',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom',
        })
      }
    }
  }

  const toggleEditMode = () => {
    setEditMode((prev) => !prev)
  }

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await APIs.DeleteTask(taskId)
      if (response) {
        toast({
          title: 'Task deleted successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'bottom',
        })
        updateKanban()
      } else {
        toast({
          title: 'Failed to delete the task.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom',
        })
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      toast({
        title: 'An error occurred.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom',
      })
    }
  }

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await APIs.CompleteUpdate({
        TASKID: taskId,
        COMPLETE: 1,
      })
      if (response) {
        toast({
          title: 'Task completed successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'bottom',
        })
        updateKanban()
      } else {
        toast({
          title: 'Failed to complete the task.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'bottom',
        })
      }
    } catch (error) {
      console.error('Error completing task:', error)
      toast({
        title: 'An error occurred.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom',
      })
    }
  }

  const handleArchiveTask = async (task) => {
    const response = await APIs.AchiveTask(task.TASKID)
    if (response) {
      toast({
        title: 'Task Archived',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'bottom',
      })
      updateKanban()
    }
  }

  const calculateRemainingDays = (date) =>
    Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))

  return (
    <div className='kanban-container'>
      {['head', 'admin'].includes(localStorage.getItem('role')) && (
        <Flex justify='flex-end' gap={4} m='1em' mb={0}>
          <Button
            size='sm'
            colorScheme='green'
            variant='outline'
            rightIcon={<EditIcon />}
            onClick={toggleEditMode}
          >
            Düzenle
          </Button>
          {projectId && (
            <Button
              size='sm'
              colorScheme='green'
              variant='outline'
              rightIcon={<AddIcon />}
              onClick={() => setCreateTaskModalOpen(true)}
            >
              Ekle
            </Button>
          )}
        </Flex>
      )}

      <div className='kanban-board'>
        {tasks &&
          Object.entries(tasks).map(([phase, tasksInPhase]) => (
            <div className='column' key={phase}>
              <div
                className={`column-title ${
                  phase === 'yapilacak'
                    ? 'yapilacak-title'
                    : phase === 'devamEden'
                    ? 'devamEden-title'
                    : phase === 'tamamlanan'
                    ? 'tamamlanan-title'
                    : 'arsiv-title'
                }`}
              >
                {phase === 'yapilacak'
                  ? 'Yapılacak Görevler'
                  : phase === 'devamEden'
                  ? 'Devam Eden'
                  : phase === 'tamamlanan'
                  ? 'Tamamlanan'
                  : 'Arşiv'}
              </div>

              <div className='tasks'>
                {tasksInPhase.length > 0 ? (
                  tasksInPhase.map((task) => (
                    <div
                      key={task.TASKID}
                      className='task'
                      style={{
                        backgroundColor:
                          task.COMPLETE_STATUS === 1
                            ? 'rgb(220, 245, 225)'
                            : 'white',
                      }}
                    >
                      <Flex justify='space-between'>
                        <button
                          className='task-title'
                          onClick={() => handleOpenComments(task)}
                        >
                          {task.NAME.trim()}
                        </button>

                        {Number(task.COMMENT_COUNT) > 0 && (
                          <div className='comment-number-badge'>
                            {task.COMMENT_COUNT}
                          </div>
                        )}
                      </Flex>

                      {isEditMode && (
                        <div className='icon-container'>
                          <DeleteIcon
                            color='red.500'
                            className='delete-icon'
                            onClick={() => handleDeleteTask(task.TASKID)}
                          />
                          <EditIcon
                            color='yellow.500'
                            className='edit-icon'
                            onClick={() => handleEditTask(task)}
                          />
                          {phase === 'arsiv' && (
                            <IoMdArchive
                              size={20}
                              className='delete-icon'
                              onClick={() => handleArchiveTask(task)}
                            />
                          )}
                          <CheckIcon
                            className='complete-icon'
                            onClick={() => handleCompleteTask(task.TASKID)}
                          />
                        </div>
                      )}

                      <p className='task-description'>{task.DESCRIPTION}</p>

                      {phase !== 'arsiv' && (
                        <div
                          className='task-due'
                          style={{
                            color:
                              calculateRemainingDays(task.DUE_DATE) < 0
                                ? 'red'
                                : 'green',
                          }}
                        >
                          <p>
                            {new Intl.DateTimeFormat('tr-TR', {
                              month: 'long',
                              day: 'numeric',
                            }).format(new Date(task.START_DATE))}
                            &nbsp;-&nbsp;
                            {new Intl.DateTimeFormat('tr-TR', {
                              month: 'long',
                              day: 'numeric',
                            }).format(new Date(task.DUE_DATE))}
                          </p>
                          <p>
                            {calculateRemainingDays(task.DUE_DATE) < 0
                              ? `${-calculateRemainingDays(
                                  task.DUE_DATE
                                )} Gün geçti`
                              : `${calculateRemainingDays(
                                  task.DUE_DATE
                                )} Gün kaldı`}
                          </p>
                        </div>
                      )}

                      <Flex justify='space-between'>
                        <div className='task-assignee'>
                          <p>
                            {task.ASSIGNED_BY}
                            <ArrowForwardIcon mx={1} />
                            {task.ASSIGNED_TO}
                          </p>
                        </div>
                        <div
                          className='task-assignee'
                          style={{ textAlign: 'right' }}
                        >
                          {task.OBSERVER}
                        </div>
                      </Flex>

                      <Flex justify='space-between' mt={2}>
                        {phase !== 'yapilacak' && (
                          <button
                            onClick={() => moveToPreviousPhase(task, phase)}
                          >
                            <ArrowLeftIcon className='move-button' />
                          </button>
                        )}
                        <div />
                        {/* spacer */}
                        {phase !== 'arsiv' && (
                          <button onClick={() => moveToNextPhase(task, phase)}>
                            <ArrowRightIcon className='move-button' />
                          </button>
                        )}
                      </Flex>
                    </div>
                  ))
                ) : (
                  <p className='no-tasks'>{LanguageLocalizer['no_tasks']}</p>
                )}
              </div>
            </div>
          ))}
      </div>

      {selectedTask && (
        <CommentModal
          isOpen={isCommentModalOpen}
          onClose={handleCloseComments}
          taskId={selectedTask.TASKID}
          taskName={selectedTask.NAME}
          updateKanban={updateKanban}
        />
      )}

      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => {
          setCreateTaskModalOpen(false)
          setTaskToEdit(null)
        }}
        projectId={projectId}
        onTaskCreated={handleTaskCreated}
        onTaskUpdated={updateKanban}
        editTask={!!taskToEdit}
        taskData={taskToEdit}
      />
    </div>
  )
}

export default Kanban
