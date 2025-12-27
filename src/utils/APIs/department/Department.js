import { Request } from 'utils/APIs/APICenter'

export const GetDepartments = async () => {
  const response = await Request('GET', 'department', null, true)
  console.log(`response from API`, response)

  if (response.fail) return []
  else return response.response
}

export const CreateDepartment = async (data) => {
  const response = await Request('POST', 'department', data, true)
  if (response.fail) return null
  else return response.response
}

export const UpdateDepartment = async (data, id) => {
  const response = await Request('PUT', `department/${id}`, data, true)
  if (response.fail) return null
  else return response.response
}

export const DeleteDepartment = async (id) => {
  const response = await Request('POST', `department/${id}`, false, true)
  if (response.fail) return null
  else return response.response
}

export const GetDepartment = async (id) => {
  const response = await Request('GET', `department/${id}`, id, true)
  if (response.fail) return null
  else return response.response
}
