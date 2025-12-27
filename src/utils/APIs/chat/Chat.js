import { Request } from 'utils/APIs/APICenter.js';

export const GetChatableUsers = async () => {
    const apiUrl = 'chat/chatableUserList'

    const res = await Request('GET', apiUrl, null, true)
    if (res.fail) return []
    else {
        const sorted = res.response.sort((a, b) => {
            if (a.UNREAD_MESSAGE_COUNT > 0 && b.UNREAD_MESSAGE_COUNT === 0) return -1
            if (a.UNREAD_MESSAGE_COUNT === 0 && b.UNREAD_MESSAGE_COUNT > 0) return 1
            return a.FullName.localeCompare(b.FullName)
        })
        return sorted
    }
}