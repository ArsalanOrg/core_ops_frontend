import { Request } from 'utils/APIs/APICenter'

//////////////////////////// Inventory Items  ////////////////////////////
export const GetAllInventory = async () => {
  const res = await Request('GET', 'inventory/getAllInventory', null, true)
  if (res.fail) return []
  else return res.response
}
export const CreateInventory = async (data) => {
  const res = await Request('POST', 'inventory/createInventory', data, true)
  //   if (res.fail) return null
  return res
}
export const GetInventory = async (id) => {
  const res = await Request('GET', `inventory/getInventory/${id}`, null, true)
  if (res.fail) return []
  else return res.response
}
export const UpdateInventory = async (data, id) => {
  const res = await Request(
    'PUT',
    `inventory/updateInventory/${id}`,
    data,
    true
  )
  //   if (res.fail) return null
  return res
}

export const DeleteInventory = async (data) => {
  //   console.log(data)

  const res = await Request(
    'POST',
    `inventory/deleteInventory/${data}`,
    null,
    true
  )
  //   if (res.fail) return null
  return res
}

export const SearchInventory = async (query) => {
  const res = await Request(
    'GET',
    `inventory/inventory/search?query=${query}`,
    null,
    true
  )
  if (res.fail) return []
  else return res.response
}
//////////////////////////// Inventory Categories  ////////////////////////////

export const GetAllCategory = async () => {
  const res = await Request('GET', 'inventory/getAllCategory', null, true)
  if (res.fail) return []
  else return res.response
}
// createCategory

export const CreateCategory = async (data) => {
  const res = await Request('POST', 'inventory/createCategory', data, true)
  if (res.fail) return []
  else return res.response
}

// updateCategory/:id

export const UpdateCategory = async (data, id) => {
  const res = await Request('PUT', `inventory/updateCategory/${id}`, data, true)
  if (res.fail) return []
  else return res.response
}

//deleteCategory/:id
export const DeleteCategory = async (id) => {
  const res = await Request(
    'POST',
    `inventory/deleteCategory/${id}`,
    null,
    true
  )
  if (res.fail) return []
  else return res.response
}
///////////////////////////////////// LOCATIONS //////////////////////////

export const GetAllLocations = async () => {
  const res = await Request('GET', 'inventory/getAllLocations', null, true)

  if (res.fail) return []
  else return res.response
}
// createLocation

export const CreateLocation = async (data) => {
  const res = await Request('POST', 'inventory/createLocation', data, true)
  if (res.fail) return []
  else return res.response
}

// updateLocation/:id

export const UpdateLocation = async (data, id) => {
  const res = await Request('PUT', `inventory/updateLocation/${id}`, data, true)
  if (res.fail) return []
  else return res.response
}

// deleteLocation/:id
export const DeleteLocation = async (id) => {
  const res = await Request(
    'POST',
    `inventory/deleteLocation/${id}`,
    null,
    true
  )
  if (res.fail) return []
  else return res.response
}
//////////////////////////// Inventory Authorization  ////////////////////////////

// /checkInventoryAuth
export const CheckInventoryAuth = async () => {
  const res = await Request('GET', 'inventory/checkInventoryAuth', null, true)
  if (res.fail) return []
  else return res.response
}

// /addAuthorizedUser
export const AddAuthorizedUser = async (data) => {
  const res = await Request('POST', 'inventory/addAuthorizedUser', data, true)
  if (res.fail) return []
  else return res.response
}
// getAllAuthorizedUsers
export const GetAllAuthorizedUsers = async () => {
  const res = await Request(
    'GET',
    'inventory/getAllAuthorizedUsers',
    null,
    true
  )
  if (res.fail) return []
  else return res.response
}
//removeAuthorizedUser
export const RemoveAuthorizedUser = async (data) => {
  const res = await Request(
    'POST',
    `inventory/removeAuthorizedUser/${data}`,
    false,
    true
  )
  if (res.fail) return []
  else return res.response
}



export const StockOut = async (data, id) => {
   const payload = {
     quantity: data.quantity,
     purpose: data.purpose
   }
  const res = await Request('POST', `inventory/stockOut/${id}`, payload, true)
  if (res.fail) return null
  return res
}