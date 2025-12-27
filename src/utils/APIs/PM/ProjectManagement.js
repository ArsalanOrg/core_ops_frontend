// import request from API
import { Request } from 'utils/APIs/APICenter.js';

export const GetProjects = async () => {
  const apiUrl = 'pm/project/getProjects'
  const res = await Request('GET', apiUrl, null, true)

  if (res.fail) return []
  else return res.response
}
// create project
export const CreateProject = async (data) => {
  const apiUrl = 'pm/project/createProject'
  const payload = {
    // MANAGERID: data.managerID,
    // DEPARTMENTID: data.departmentID,
    NAME: data.projectName,
    DELETE_STATUS: 0,
    DATE: new Date(),
    START_DATE: data.startDate,
    FINISH_DATE: data.finishDate,
  }
  const res = await Request('POST', apiUrl, payload, true)
  if (res.fail) return null
  else return res.response
}
// update Project
export const UpdateProject = async (data) => {
  const apiUrl = 'pm/project/updateProject'
  const payload = {
    PROJECTID: data.id,
    // MANAGERID: data.managerID,
    // DEPARTMENTID: data.departmentID,
    NAME: data.name,
    DELETE_STATUS: 0,
    DATE: new Date(),
    START_DATE: data.startDate,
    FINISH_DATE: data.finishDate,
  }
  const res = await Request('POST', apiUrl, payload, true)
  if (res.fail) return null
  else return res.response
}

export const DeleteProject = async (id) => {
  const apiUrl = 'pm/project/deleteProject'
  const payload = {
    PROJECTID: id,
    CHECK: 0,
  }
  const res = await Request('POST', apiUrl, payload, true)
  if (res.fail) return null
  else return res.response
}

export const GetProject = async (id) => {
  const apiUrl = `pm/project/getProjectById/${id}`
  const res = await Request('GET', apiUrl, false, true)
  if (res.fail) return null
  else return res.response
}