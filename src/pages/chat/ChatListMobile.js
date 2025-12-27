import {
  Avatar,
  Badge,
  Box,
  Flex,
  HStack,
  Input,
  List,
  ListItem,
  Text,
} from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import ChatViewMobile from 'components/chat/ChatViewMobile' // Import your ChatView component
import * as APIs from 'utils/APIs/APICenter'
import { NormalizeText } from 'utils/Functions/UtilFunctions'
import { GetChatSocket } from 'utils/Functions/GetChatSocket'

const ChatListMobile = () => {
  const [chatableUserList, setChatableUserList] = useState(null)
  const [filteredUsers, setFilteredUsers] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState(null) // State to handle selected user
  const socketRef = useRef(null)

  const getChatableUsers = async () => {
    const users = await APIs.GetChatableUsers()
    setChatableUserList(users)
    setFilteredUsers(users)
  }

  useEffect(() => {
    socketRef.current = GetChatSocket()

    // Update list on receiving a message
    socketRef.current.on('messageReceived', getChatableUsers)

    return () => {
      socketRef.current.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!chatableUserList) getChatableUsers()
  }, [chatableUserList])

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    if (query) {
      const filtered = chatableUserList.filter((user) =>
        NormalizeText(user.FullName).includes(NormalizeText(query))
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(chatableUserList)
    }
  }

  return (
    <Flex height='100vh'>
      {selectedUser ? (
        // Chat view for the selected user
        <ChatViewMobile
          receiverId={selectedUser.ID}
          onBack={() => setSelectedUser(null)} // Pass a callback to go back to the list
        />
      ) : (
        // Chatable user list
        <Flex
          direction='column'
          minWidth='300px'
          width='100%'
          borderRight='1px solid gray'
        >
          <Box p={4}>
            <Input
              placeholder='Search users'
              value={searchQuery}
              onChange={handleSearch}
            />
          </Box>
          <List spacing={3} overflowY='auto'>
            {filteredUsers?.map((user) => (
              <ListItem
                key={user.USERID}
                p={4}
                cursor='pointer'
                bg='gray.100'
                _hover={{ bg: 'blue.200' }}
                onClick={() => setSelectedUser(user)} // Set the selected user
              >
                <HStack spacing={3}>
                  <Avatar name={user.FullName} />
                  <Box>
                    <Text fontWeight='bold'>{user.FullName}</Text>
                    <Text fontSize='sm' color='gray.500'>
                      {user.ONLINE_STATUS ? 'Online' : 'Offline'}
                    </Text>
                  </Box>
                </HStack>
              </ListItem>
            ))}
          </List>
        </Flex>
      )}
    </Flex>
  )
}

export default ChatListMobile
