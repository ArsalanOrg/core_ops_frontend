import { Request } from "utils/APIs/APICenter"

export const GetComments = async (id) => {
  const apiUrl = 'pm/comment/getComments'
  const payload = {
    TASKID: id,
  }
  const res = await Request('POST', apiUrl, payload, true)
  if (res.fail) return []
  else return res.response
}

export const AddComment = async (data) => {
  const apiUrl = 'pm/comment/addComment'
  const payload = {
    TASKID: data.taskId,
    COMMENT: data.comment,
  }
  const res = await Request('POST', apiUrl, payload, true)
  if (res.fail) return null
  else return res.response
}

export const DeleteComment = async (id) => {
  const apiUrl = 'pm/comment/deleteComment'
  const payload = {
    COMMENTID: id,
  }
  const res = await Request('POST', apiUrl, payload, true)
  if (res.fail) return null
  else return res.response
}

export const UpdateComment = async (data) => {
  const apiUrl = 'pm/comment/updateComment'
  const payload = {
    COMMENTID: data.editCommentId,
    COMMENT: data.newComment,
    TASKID: data.taskId,
  }
  const res = await Request('POST', apiUrl, payload, true)
  if (res.fail) return null
  else return res.response
}
