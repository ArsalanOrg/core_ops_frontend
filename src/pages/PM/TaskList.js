import KanbanDesktop from 'components/PM/KanbanDesktop.js'
import KanbanMobile from 'components/PM/KanbanMobile.js'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import 'style/TaskList.js.css'
import * as APIs from 'utils/APIs/APICenter.js'
import { useGlobalState } from 'utils/GlobalState.ts'
import LanguageLocalizer from 'utils/LanguageLocalizer.js'
import { isMobile } from 'react-device-detect'

const TaskList = () => {
  const { setTitle, setShowHint } = useGlobalState()
  const [tasks, setTasks] = useState(null)
  const [projectName, setProjectName] = useState('')
  const { projectId } = useParams()

  const fetchTasks = async () => {
    const task_list = await APIs.GetTasks(projectId)
    if (task_list) {
      setTasks({
        yapilacak: task_list.filter((task) => task.STAGE === 0),
        devamEden: task_list.filter((task) => task.STAGE === 1),
        tamamlanan: task_list.filter((task) => task.STAGE === 2),
        arsiv: task_list.filter((task) => task.STAGE === 3),
      })
    }
  }

  useEffect(() => {
    setShowHint(false)

    const run = async () => {
      // fetch project name
      try {
        const project = await APIs.GetProject(projectId)
        setProjectName(project?.NAME?.trim() || '')
      } catch (e) {
        setProjectName('')
      }

      // fetch tasks
      await fetchTasks()
    }

    run()
  }, [projectId])

  useEffect(() => {
    setTitle(
      `${LanguageLocalizer['kanban']}${projectName ? ` / ${projectName}` : ''}`
    )
  }, [projectName, setTitle])

  return (
    <div className='kanban-container'>
      {isMobile ? (
        <KanbanMobile tasks={tasks} projectId={projectId} updateKanban={fetchTasks} />
      ) : (
        <KanbanDesktop tasks={tasks} projectId={projectId} updateKanban={fetchTasks} />
      )}
    </div>
  )
}

export default TaskList
