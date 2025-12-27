import { Request } from 'utils/APIs/APICenter'

export const SubscribeUserToPush = async (subscription, UserID) => {
  const apiUrl = 'notification/subscribe'
  const body = {
    subscription: subscription,
    // UserID: UserID,
  }
  const res = await Request('POST', apiUrl, body, true)
  if (res.fail) return false
  else return true
}
export const UnSubscribeUserToPush = async (subscription, UserID) => {
  const apiUrl = 'notification/unSubscribe'

  const res = await Request('POST', apiUrl, null, true)
  if (res.fail) return false
  else return true
}
