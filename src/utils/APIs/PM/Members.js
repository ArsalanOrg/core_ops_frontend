import { Request } from "utils/APIs/APICenter"

export const GetProjectMembers = async (data) => {
  const apiUrl = 'pm/member/projectMembersList'
  const payload = {
    PROJECTID: data,
  }
  const res = await Request('POST', apiUrl, payload, true)

  if (res.fail) return []
  else return res.response
}
// AddMember

export const AddMember = async (data) => {
  const apiUrl = 'pm/member/addMember'
  const res = await Request('POST', apiUrl, data, true)
  if (res.fail) return null
  else return res.response
}
// GetMembers

export const GetMembers = async (data) => {
  const apiUrl = 'pm/member/getMembers'

  const res = await Request('GET', apiUrl, data, true)

  if (res.fail) return []
  else return res.response
}
// DeleteMember

export const DeleteMember = async (data) => {
  const apiUrl = 'pm/member/deleteMember'

  const res = await Request('POST', apiUrl, data, true)
  if (res.fail) return null
  else return res.response
}
