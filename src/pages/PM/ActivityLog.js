import ActivityLogsTable from 'components/PM/LogTable'
import { useEffect, useState } from 'react'
import * as APIs from 'utils/APIs/APICenter.js'
import { useGlobalState } from 'utils/GlobalState.ts'

const ActivityLog = () => {
  const [activityLogs, setActivityLogs] = useState([])
  const { setTitle, setShowHint } = useGlobalState()

  const fetchActivityLogs = async () => {
    const response = await APIs.GetLogs()

    setActivityLogs(response.response)
  }
  useEffect(() => {
    setTitle('Akış')
    setShowHint(false)
    fetchActivityLogs()
  }, [])
  return (
    <>
      <ActivityLogsTable
        activityLogs={activityLogs}
      ></ActivityLogsTable>
    </>
  )
}

export default ActivityLog
