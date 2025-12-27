import axios from 'axios'
var HOST_IP = ''
if (process.env.NODE_ENV === 'development')
  HOST_IP = 'http://10.1.205.2:5050/api/v1/'
  // HOST_IP = 'https://demoapi.arsalanrehman.online/api/v1/'
else HOST_IP = 'https://coreops.arsalanrehman.online/api/v1/'

export const GetHostIP = () => {
  return HOST_IP
}

export const GetHostWS = () => {
  if (process.env.NODE_ENV === 'development')
    return 'http://10.1.205.2:5050'
  else return 'https://coreops.arsalanrehman.online'
}

export const Request = async (method, url, data = null, use_token = false) => {
  url = `${HOST_IP}${url}`
  let config = {}
  let response = null
  let fail = false

  if (use_token) {
    const token = localStorage.getItem('jwt')
    if (token) {
      config.headers = { Authorization: `Bearer ${token}` }
    }
  }

  try {
    const result = await axios({ method, url, data, ...config })
    response = result.data.data
  } catch (error) {
    console.error(error)
    response = error
    fail = true
  }

  return { response, fail }
}

export * from './user/Login'
export * from './user/Notification'
export * from './department/Department'
export * from './PM/ProjectManagement'
export * from './PM/Tasks'
export * from './PM/Comments'
export * from './PM/Members'
export * from './PM/Logs'
export * from './user/User'
export * from './PM/TodoList'
export * from './chat/Chat'
export * from './Inventory/Inventory'
export * from './Inventory/InventoryLogs'
