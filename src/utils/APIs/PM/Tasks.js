import { Request } from "utils/APIs/APICenter"

export const GetTasks = async (data) => {
  const apiUrl = 'pm/task/getTasks'
  const payload = {
    PROJECTID: data,
  }
  const res = await Request('POST', apiUrl, payload, true)

  if (res.fail) return []
  else return res.response
}

export const CreateTask = async (data) => {
  const apiUrl = 'pm/task/createTask'

  const res = await Request('POST', apiUrl, data, true)
  if (res.fail) return null
  else return res.response
}

export const UpdateTask = async (data) => {
  const apiUrl = 'pm/task/updateTask'

  const res = await Request('POST', apiUrl, data, true)
  if (res.fail) return null
  else return res.response
}

export const DeleteTask = async (id) => {
  const apiUrl = 'pm/task/deleteTask'
  const payload = {
    TASKID: id,
  }
  const res = await Request('POST', apiUrl, payload, true)
  if (res.fail) return null
  else return res.response
}

export const StageUpdate = async (data) => {
  const apiUrl = 'pm/task/stageUpdate'
  const payload = {
    TASKID: data.id,
    STAGE: data.stage,
  }
  const res = await Request('POST', apiUrl, payload, true)
  if (res.fail) return null
  else return res.response
}
// getMyObservedTasks

export const GetMyObservedTasks = async (data) => {
  const apiUrl = 'pm/task/getMyObservedTasks'

  const res = await Request('POST', apiUrl, data, true)
  if (res.fail) return []
  else return res.response
}

export const AchiveTask = async (id) => {
  const apiUrl = 'pm/task/archiveTask'
  const payload = {
    TASKID: id,
  }
  const res = await Request('POST', apiUrl, payload, true)
  if (res.fail) return null
  else return res.response
}

export const CompleteUpdate = async (data) => {
  const apiUrl = 'pm/task/completeUpdate'

  const res = await Request('POST', apiUrl, data, true)
  if (res.fail) return null
  else return res.response
}
// checkAuthTask

export const CheckAuthTask = async (data) => {
  const apiUrl = 'pm/task/checkAuthTask'
  const payload = {
    PROJECTID: data,
  }
  const res = await Request('POST', apiUrl, payload, true)
  if (res.fail) return null
  else return res.response
}