import { Request } from 'utils/APIs/APICenter'

export const GetTodoList = async () => {
  const res = await Request('GET', 'pm/todo/getAllTodo', null, true)
  if (res.fail) return []
  else return res.response
}

export const CreateTodo = async (data) => {
  const res = await Request('POST', 'pm/todo/createTodo', data, true)
  if (res.fail) return []
  else return res.response
}

export const UpdateTodo = async (data) => {
  const res = await Request('POST', 'pm/todo/updateCompleteStatus', data, true)
  if (res.fail) return []
  else return res.response
}

export const DeleteTodo = async (data) => {
  const payload = {
    id: data,
  }
  const res = await Request('POST', 'pm/todo/deleteTodo', payload, true)
  if (res.fail) return []
  else return res.response
}

export const UpdatePriorityLevel = async (data) => {
  const res = await Request('POST', 'pm/todo/updatePriorityLevel', data, true)
  if (res.fail) return []
  else return res.response
}
