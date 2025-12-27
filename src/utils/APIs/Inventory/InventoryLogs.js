import { Request } from 'utils/APIs/APICenter'

// utils/APIs/APICenter.js
export const GetAllLogs = async (filters = {}) => {
  const qs = new URLSearchParams(filters).toString()
  const url = `inventory/getAllInventoryLogs${qs ? `?${qs}` : ''}`
  const res = await Request('GET', url, null, true)
  if (res.fail) return []
  // assume res.response = { success, message, data: [...] }
  return res.response   // ← return the array directly
}

