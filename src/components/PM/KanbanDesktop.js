import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Button, Flex, useToast } from '@chakra-ui/react'
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  CheckIcon,
  ArrowForwardIcon,
} from '@chakra-ui/icons'
import CommentModal from 'components/PM/CommentModal.js'
import CreateTaskModal from 'components/PM/CreateTaskModal.js'
import { IoMdArchive } from 'react-icons/io'
import * as APIs from 'utils/APIs/APICenter.js'
import LanguageLocalizer from 'utils/LanguageLocalizer.js'
// import 'style/Kanban.js.css'

const KanbanDesktop = ({ tasks, projectId, updateKanban }) => {
  const toast = useToast()
  const phases = ['yapilacak', 'devamEden', 'tamamlanan', 'arsiv']
  const [kanbanTasks, setKanbanTasks] = useState(tasks || {})
  const [selectedTask, setSelectedTask] = useState(null)
  const [isCommentModalOpen, setCommentModalOpen] = useState(false)
  const [isCreateTaskModalOpen, setCreateTaskModalOpen] = useState(false)
  const [isEditMode, setEditMode] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)
  const [isAuthorized, setIsAuthorized] = useState(false)

  const [projectName, setProjectName] = useState(null)

  useEffect(() => {
    setKanbanTasks(tasks || {})
  }, [tasks])

  useEffect(() => {
    checkAuth()
    fetchProjectInfo()
  }, [])

    const fetchProjectInfo = async () => {
      const project = await APIs.GetProject(projectId)
  
      if (project) {
        setProjectName(project.NAME)
      }
      return project
    }
  const calculateRemainingDays = (date) => {
    return Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))
  }
  const checkAuth = async () => {
    const response = await APIs.CheckAuthTask(projectId)
    setIsAuthorized(response)
    console.log(response)
  }
  const handleDragEnd = async (result) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.droppableId !== destination.droppableId) {
      const response = await APIs.StageUpdate({
        id: parseInt(draggableId),
        stage: phases.indexOf(destination.droppableId),
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
  const handleOpenComments = (task) => {
    setSelectedTask(task)
    setCommentModalOpen(true)
  }

  const handleDeleteTask = async (taskId) => {
    const response = await APIs.DeleteTask(taskId)
    if (response) {
      toast({
        title: 'Task deleted successfully',
        status: 'success',
        duration: 3000,
      })
      updateKanban()
    } else {
      toast({ title: 'Delete failed', status: 'error', duration: 3000 })
    }
  }

  const handleCompleteTask = async (taskId) => {
    const response = await APIs.CompleteUpdate({ TASKID: taskId, COMPLETE: 1 })
    if (response) updateKanban()
  }

  const handleArchiveTask = async (taskId) => {
    const response = await APIs.AchiveTask(taskId)
    if (response) updateKanban()
  }

  return (
    <div className='kanban-container'>
      {isAuthorized && (
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

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className='kanban-board'>
          {phases.map((phase) => (
            <Droppable key={phase} droppableId={phase}>
              {(provided) => (
                <div
                  className='column'
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className={`column-title ${phase}-title`}>
                    {phase === 'yapilacak'
                      ? 'Yapılacak Görevler'
                      : phase === 'devamEden'
                      ? 'Devam Eden'
                      : phase === 'tamamlanan'
                      ? 'Tamamlanan'
                      : 'Arşiv'}
                  </div>
                  <div className='tasks'>
                    {kanbanTasks[phase]?.length ? (
                      kanbanTasks[phase].map((task, index) => (
                        <Draggable
                          key={task.TASKID}
                          draggableId={`${task.TASKID}`}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className='task'
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                backgroundColor: task.COMPLETE_STATUS
                                  ? 'rgb(220,245,225)'
                                  : 'white',
                                ...provided.draggableProps.style,
                              }}
                            >
                              <Flex justify='space-between'>
                                <button
                                  className='task-title'
                                  onClick={() => handleOpenComments(task)}
                                >
                                  {task.NAME}
                                </button>
                                {task.COMMENT_COUNT > 0 && (
                                  <div className='comment-number-badge'>
                                    {task.COMMENT_COUNT}
                                  </div>
                                )}
                              </Flex>

                              {isEditMode && (
                                <Flex gap={2} mb={2}>
                                  <DeleteIcon
                                    color='red.500'
                                    onClick={() =>
                                      handleDeleteTask(task.TASKID)
                                    }
                                  />
                                  <EditIcon
                                    color='yellow.500'
                                    onClick={() => {
                                      setTaskToEdit(task)
                                      setCreateTaskModalOpen(true)
                                    }}
                                  />
                                  <CheckIcon
                                    color='green.500'
                                    onClick={() =>
                                      handleCompleteTask(task.TASKID)
                                    }
                                  />
                                  {phase === 'arsiv' && (
                                    <IoMdArchive
                                      size={20}
                                      onClick={() =>
                                        handleArchiveTask(task.TASKID)
                                      }
                                    />
                                  )}
                                </Flex>
                              )}

                              <p className='task-description'>
                                {task.DESCRIPTION}
                              </p>

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
                                    {new Date(
                                      task.START_DATE
                                    ).toLocaleDateString('tr-TR')}{' '}
                                    –{' '}
                                    {new Date(task.DUE_DATE).toLocaleDateString(
                                      'tr-TR'
                                    )}
                                  </p>
                                  <p>
                                    {calculateRemainingDays(task.DUE_DATE) < 0
                                      ? `${-calculateRemainingDays(
                                          task.DUE_DATE
                                        )} gün geçti`
                                      : `${calculateRemainingDays(
                                          task.DUE_DATE
                                        )} gün kaldı`}
                                  </p>
                                </div>
                              )}

                              <Flex justify='space-between' mt={2}>
                                <div className='task-assignee'>
                                  {task.ASSIGNED_BY}
                                  <ArrowForwardIcon mx={1} />
                                  {task.ASSIGNED_TO}
                                </div>
                                <div className='task-assignee'>
                                  {task.OBSERVER}
                                </div>
                              </Flex>
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <p className='no-tasks'>Görev bulunmamaktadır.</p>
                    )}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {selectedTask && (
        <CommentModal
          isOpen={isCommentModalOpen}
          onClose={() => setCommentModalOpen(false)}
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
        onTaskCreated={updateKanban}
        editTask={!!taskToEdit}
        taskData={taskToEdit}
      />
    </div>
  )
}

export default KanbanDesktop
