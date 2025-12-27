import { Request } from "utils/APIs/APICenter"

export const GetLogs = async (data) => {
  const response = await Request('POST', 'pm/log/activityLog', data, true)
  return response
}
