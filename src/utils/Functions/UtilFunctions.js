import LanguageLocalizer from 'utils/LanguageLocalizer.js'
import * as APIs from 'utils/APIs/APICenter.js'
export const FormatDate = (
  timestamp,
  returnTime = true,
  inputFormat = false
) => {
  const date = new Date(timestamp)

  // Extract date components
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-indexed
  const year = date.getFullYear()

  // Extract time components
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  // Create the readable strings
  var readableDate = `${day}/${month}/${year}`
  var readableTime = `${hours}:${minutes}`
  if (inputFormat) {
    readableDate = `${year}-${month}-${day}`
  } else {
    readableDate = `${day}/${month}/${year}`
    readableTime = `${hours}:${minutes}`
  }

  if (returnTime)
    return (
      <>
        {readableDate} <br></br> {readableTime}{' '}
      </>
    )
  else return readableDate
}
export const GetTimeFromDate = (timestamp) => {
  const date = new Date(timestamp)
  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  const readableTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`
  return readableTime
}

export const RoundDecimal = (value, accuracy = 4) => {
  return Number(value).toFixed(accuracy)
}

export const get_order_status = (status) => {
  switch (status) {
    case -1:
      return LanguageLocalizer['no_approval']
    case 0:
      return LanguageLocalizer['approval_denied']
    case 1:
      return LanguageLocalizer['head_approved']
    case 2:
      return LanguageLocalizer['management_approved']
    case 3:
      return LanguageLocalizer['finished']
    case 4:
      return LanguageLocalizer['purchasing_approved']
    default:
      return ''
  }
}

export const get_order_type = (status) => {
  switch (status) {
    case 0:
      return LanguageLocalizer['orderType0']
    case 1:
      return LanguageLocalizer['orderType1']
    case 2:
      return LanguageLocalizer['orderType2']
    default:
      return ''
  }
}

export const RoundAllNumbers = (lists) => {
  return lists.map((list) => {
    return list.map((record) => {
      let roundedRecord = {}
      Object.keys(record).forEach((key) => {
        if (typeof record[key] === 'number')
          roundedRecord[key] = RoundDecimal(record[key])
        else roundedRecord[key] = record[key]
      })
      return roundedRecord
    })
  })
}

export const CheckEmpty = (s) => {
  return s === null || s === '' || s === undefined ? '---' : s
}

export const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export const subscribeUserToPush = async (registration) => {
  try {
    const publicVapidKey =
      'BEAI1t5XRkyUVc3SIfkn-J5uXHmmBM2R_nZ2UEs3Md6275Sa96J-XoPXUOBJHtT3ge7X41TyulMWXXGWJzthAuU'
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    })
    APIs.SubscribeUserToPush(
      subscription,
      Number(localStorage.getItem('UserID'))
    )
  } catch (error) {
    console.log(error)
  }
}

export const NormalizeText = (text) => {
  return text
    ?.toString()
    .toLowerCase('tr') // Use Turkish locale for case conversion
    .normalize('NFD') // Normalize to decompose combined characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
}
