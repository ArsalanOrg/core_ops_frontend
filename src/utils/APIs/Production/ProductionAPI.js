// utils/APIs/production/production.js
import { Request } from 'utils/APIs/APICenter'

//////////////////////////// Production Authorization ////////////////////////////

// /checkProductionAuth
export const CheckProductionAuth = async () => {
  const res = await Request('GET', 'production/checkProductionAuth', null, true)
  if (res.fail) return []
  return res.response
}

// /addAuthorizedUser
export const AddProductionAuthorizedUser = async (data) => {
  const res = await Request('POST', 'production/addAuthorizedUser', data, true)
  if (res.fail) return []
  return res.response
}

// /getAllAuthorizedUsers
export const GetAllProductionAuthorizedUsers = async () => {
  const res = await Request(
    'GET',
    'production/getAllAuthorizedUsers',
    null,
    true
  )
  if (res.fail) return []
  return res.response
}

// /removeAuthorizedUser/:userId
export const RemoveProductionAuthorizedUser = async (userId) => {
  const res = await Request(
    'POST',
    `production/removeAuthorizedUser/${userId}`,
    null,
    true
  )
  if (res.fail) return []
  return res.response
}

//////////////////////////// Machines ////////////////////////////

export const GetAllMachines = async () => {
  const res = await Request('GET', 'production/getAllMachines', null, true)
  if (res.fail) return []
  return res.response
}

export const GetMachineById = async (id) => {
  const res = await Request('GET', `production/getMachineById/${id}`, null, true)
  if (res.fail) return []
  return res.response
}

export const CreateMachine = async (data) => {
  const res = await Request('POST', 'production/createMachine', data, true)
  return res
}

export const UpdateMachine = async (data, id) => {
  const res = await Request('PUT', `production/updateMachine/${id}`, data, true)
  return res
}

export const DeleteMachine = async (id) => {
  const res = await Request('POST', `production/deleteMachine/${id}`, null, true)
  return res
}

//////////////////////////// Materials ////////////////////////////

export const GetAllMaterials = async () => {
  const res = await Request('GET', 'production/getAllMaterials', null, true)
  if (res.fail) return []
  return res.response
}

export const CreateMaterial = async (data) => {
  const res = await Request('POST', 'production/createMaterial', data, true)
  return res
}

export const UpdateMaterial = async (data, id) => {
  const res = await Request('PUT', `production/updateMaterial/${id}`, data, true)
  return res
}

export const DeleteMaterial = async (id) => {
  const res = await Request('POST', `production/deleteMaterial/${id}`, null, true)
  return res
}

//////////////////////////// Production Records ////////////////////////////

// Upsert (create if not exists else update) per MACHINE_ID + MATERIAL_ID + PROD_DATE + SHIFT
export const UpsertProductionRecord = async (data) => {
  const res = await Request(
    'POST',
    'production/upsertProductionRecord',
    data,
    true
  )
  return res
}

// Raw list with filters:
// machineId, materialId, shift, dateFrom, dateTo
export const GetProductionRecords = async (filters = {}) => {
  const qs = new URLSearchParams(filters).toString()
  const url = `production/getProductionRecords${qs ? `?${qs}` : ''}`
  const res = await Request('GET', url, null, true)
  if (res.fail) return []
  return res.response
}

// Soft delete by record id
export const DeleteProductionRecord = async (id) => {
  const res = await Request(
    'POST',
    `production/deleteProductionRecord/${id}`,
    null,
    true
  )
  return res
}

//////////////////////////// Analytics ////////////////////////////

export const GetDailyTotals = async (filters = {}) => {
  const qs = new URLSearchParams(filters).toString()
  const url = `production/analytics/dailyTotals${qs ? `?${qs}` : ''}`
  const res = await Request('GET', url, null, true)
  if (res.fail) return []
  return res.response
}

export const GetTopMachines = async (filters = {}) => {
  const qs = new URLSearchParams(filters).toString()
  const url = `production/analytics/topMachines${qs ? `?${qs}` : ''}`
  const res = await Request('GET', url, null, true)
  if (res.fail) return []
  return res.response
}

export const GetMaterialTotals = async (filters = {}) => {
  const qs = new URLSearchParams(filters).toString()
  const url = `production/analytics/materialTotals${qs ? `?${qs}` : ''}`
  const res = await Request('GET', url, null, true)
  if (res.fail) return []
  return res.response
}

//////////////////////////// Logs ////////////////////////////

export const GetAllProductionLogs = async (filters = {}) => {
  const qs = new URLSearchParams(filters).toString()
  const url = `production/getAllProductionLogs${qs ? `?${qs}` : ''}`
  const res = await Request('GET', url, null, true)
  if (res.fail) return []
  return res.response
}
