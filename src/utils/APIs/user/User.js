// updatePassword
import { Request } from 'utils/APIs/APICenter'

export const UpdatePassword = async (data) => {
  const response = await Request('POST', 'user/updatePassword', data, true)
  //   if (response.fail) return null
  return response
}
// getUsersByDepartment
export const GetUsersByDepartment = async (data) => {
  const response = await Request('GET', 'user/getUsersByDepartment', data, true)
  if (response.fail) return null
  else return response.response
}

// create User
export const CreateUser = async (data) => {
  const response = await Request('POST', 'user', data, true)
  if (response.fail) return null
  else return response.response
}
export const GetUsers = async (data) => {
  const response = await Request('GET', 'user', data, true)
  if (response.fail) return null
  else return response.response
}
export const GetUser = async (id) => {
  const response = await Request('GET', `user/${id}`, false, true)
  if (response.fail) return null
  else return response.response
}
export const DeleteUser = async (id) => {
  const response = await Request('DELETE', `user/${id}`, null, true)
  if (response.fail) return null
  else return response.response
}
export const UpdateUser = async (data, id) => {
  const response = await Request('PUT', `user/${id}`, data, true)
  if (response.fail) return null
  else return response.response
}
