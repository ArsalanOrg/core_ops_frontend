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
import ChatViewDesktop from 'components/chat/ChatViewDesktop'
import React, { useEffect, useRef, useState } from 'react'
import 'style/ChatList.css'
import * as APIs from 'utils/APIs/APICenter.js'
import { GetChatSocket } from 'utils/Functions/GetChatSocket'
import { NormalizeText } from 'utils/Functions/UtilFunctions.js'
import { useGlobalState } from 'utils/GlobalState.ts'
import LanguageLocalizer from 'utils/LanguageLocalizer.js'

const ChatList = () => {
  const { setTitle, setShowHint, setHideFooter } = useGlobalState()

  const [chatableUserList, setChatableUserList] = React.useState(null)
  const [filteredUsers, setFilteredUsers] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAvatar, setSelectedAvatar] = React.useState(null)
  const inputRef = React.useRef(null)
  const socketRef = useRef(null) // Store socket instance

  const getChatableUsers = async () => {
    setChatableUserList(await APIs.GetChatableUsers())
    setFilteredUsers(await APIs.GetChatableUsers())
  }

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = GetChatSocket()
    const socket = socketRef.current

    // Handle incoming messages
    socket.on('messageReceived', () => {
      getChatableUsers()
    })

    socket.on('onlineUpdated', (online_users) => {
      setChatableUserList((prevUsers) =>
        prevUsers.map((user) =>
          online_users.includes(user.USERID)
            ? { ...user, ONLINE_STATUS: true }
            : user
        )
      )
    })

    // Cleanup socket connection on unmount
    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    setHideFooter(true)
    if (selectedAvatar !== null)
      setTitle(
        selectedAvatar.FullName + ' ' + LanguageLocalizer['chatting_with']
      )
    else setTitle(LanguageLocalizer['chat_list'])
    setShowHint(false)
    if (chatableUserList === null) getChatableUsers()
    return () => {
      setHideFooter(false)
    }
  }, [chatableUserList, filteredUsers])

  const handleUserSelect = (user) => {
    setSelectedAvatar(user)
    setChatableUserList(
      chatableUserList.map((u) =>
        u.USERID === user.USERID ? { ...u, UNREAD_MESSAGE_COUNT: 0 } : u
      )
    )
    setFilteredUsers(
      filteredUsers.map((u) =>
        u.USERID === user.USERID ? { ...u, UNREAD_MESSAGE_COUNT: 0 } : u
      )
    )
  }

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
    console.log(query.length)
    console.log(chatableUserList)

    if (query && query.length > 0) {
      const filtered = chatableUserList.filter((user) =>
        NormalizeText(user.FullName).includes(NormalizeText(query))
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(chatableUserList)
    }
  }

  return (
    <>
      <Flex direction={'row'} maxHeight={'100vh'}>
        <Flex
          minWidth={'300px'}
          width={'100%'}
          height={'93.5vh'}
          flex={0.25}
          direction={'column'}
          borderRight='1px solid #80808082'
          borderTop='1px solid #80808082'
          backgroundColor={'gray.100'}
        >
          <Box display={'flex'} justifyContent={'center'}>
            <Input
              width={'90%'}
              placeholder={LanguageLocalizer['search_users']}
              value={searchQuery}
              onChange={handleSearch}
              my={4}
              p={2}
              borderRadius='md'
              border='1px solid gray'
            />
          </Box>
          <List spacing={3} overflowY={'scroll'}>
            {filteredUsers &&
              filteredUsers.map((user) => (
                <>
                  <ListItem
                    key={user.UserID}
                    p={4}
                    borderRadius='md'
                    cursor='pointer'
                    borderBottom='1px solid gray'
                    marginTop={'0 !important'}
                    bg={
                      selectedAvatar?.UserID === user.UserID
                        ? 'blue.200'
                        : 'gray.100'
                    }
                    _hover={{ bg: 'blue.300' }}
                    onClick={() => handleUserSelect(user)}
                  >
                    <HStack justifyContent='space-between' alignItems='center'>
                      <HStack>
                        <Avatar name={user.FullName} size='md' />
                        <Text fontSize='md' fontWeight='medium'>
                          {user.FullName}
                        </Text>
                        {user.ONLINE_STATUS && (
                          <Box
                            as='span'
                            bg='green.400'
                            borderRadius='50%'
                            width='10px'
                            height='10px'
                            animation='blinker 1s infinite'
                            ml={2}
                          />
                        )}
                      </HStack>
                      {user.UNREAD_MESSAGE_COUNT &&
                        user.UNREAD_MESSAGE_COUNT > 0 && (
                          <Badge colorScheme='red' fontSize='0.8em'>
                            {user.UNREAD_MESSAGE_COUNT}{' '}
                            {LanguageLocalizer['new_messages']}
                          </Badge>
                        )}
                    </HStack>
                  </ListItem>
                </>
              ))}
          </List>
        </Flex>

        {selectedAvatar && (
          <Box flex={0.75}>
            <ChatViewDesktop
              updateList={getChatableUsers}
              receiverId={selectedAvatar.ID}
              inputRef={inputRef}
            ></ChatViewDesktop>
          </Box>
        )}
      </Flex>
    </>
  )
}

export default ChatList
