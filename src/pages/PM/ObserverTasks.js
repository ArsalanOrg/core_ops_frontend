import Kanban from 'components/PM/KanbanDesktop.js'
import React, { useEffect, useState } from 'react'
import * as APIs from 'utils/APIs/APICenter.js'
import { useGlobalState } from 'utils/GlobalState.ts'
import LanguageLocalizer from 'utils/LanguageLocalizer.js'

const ObserverTasks = () => {
  const { setTitle, setShowHint } = useGlobalState()
  const [tasks, setTasks] = useState(null)

  const fetchTasks = async () => {
    const response = await APIs.GetMyObservedTasks()

    // setTasks()
    if (response) {
      const fetchedTasks = response
      // Map tasks into different stages
      const updatedTasks = {
        yapilacak: fetchedTasks.filter((task) => task.STAGE === 0),
        devamEden: fetchedTasks.filter((task) => task.STAGE === 1),
        tamamlanan: fetchedTasks.filter((task) => task.STAGE === 2),
        arsiv: fetchedTasks.filter((task) => task.STAGE === 3),
      }
      setTasks(updatedTasks)
    }
  }

  useEffect(() => {
    setTitle(LanguageLocalizer['observer_panel'])
    setShowHint(false)
    fetchTasks()
  }, [])

  return (
    <div>
      <Kanban tasks={tasks} projectId={null} updateKanban={fetchTasks} />
    </div>
  )
}
export default ObserverTasks
