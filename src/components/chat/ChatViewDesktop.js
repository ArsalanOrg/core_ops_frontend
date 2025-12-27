import {
  Box,
  Divider,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
  Textarea,
  VStack,
  Tooltip,
  Popover,
} from '@chakra-ui/react'
import ChatBackground from 'assets/files/chat-bg.jpg'
import React, { useEffect, useRef, useState } from 'react'
import { BsSendFill } from 'react-icons/bs'
import * as APIs from 'utils/APIs/APICenter.js'
import { FormatDate, GetTimeFromDate } from 'utils/Functions/UtilFunctions'
import LanguageLocalizer from 'utils/LanguageLocalizer'
import { IoCheckmarkOutline, IoInformationCircleOutline } from 'react-icons/io5'
import { IoCheckmarkDoneSharp } from 'react-icons/io5'
import { GetChatSocket } from 'utils/Functions/GetChatSocket'

const ChatViewDesktop = ({ updateList, receiverId, inputRef }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [groupedMessages, setGroupedMessages] = useState([])
  const myID = parseInt(localStorage.getItem('UserID'))

  const socketRef = useRef(null) // Store socket instance
  const bottomRef = useRef(null) // Reference to the last message

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = GetChatSocket()
    const socket = socketRef.current

    // Handle incoming messages
    socket.on('messageReceived', (message) => {
      updateList()
      // console.log("New message received:", message);
      if (
        message.SENDERID === parseInt(receiverId) ||
        message.RECEIVERID === parseInt(receiverId)
      ) {
        setMessages((prev) => [...prev, message])
      }
      if (message.SENDERID === receiverId) {
        socket.emit('messageRead', { messageId: message.ID })
      }
    })

    socket.on('chatHistory', (history) => {
      history.map((message) => {
        if (message.READ_STATUS === 0 && message.SENDERID === receiverId)
          socket.emit('messageRead', { messageId: message.ID })
      })
      setMessages(history)
    })

    socket.on('messageRead', (messageId) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.ID === messageId ? { ...msg, READ_STATUS: 1 } : msg
        )
      )
    })

    socket.on('connect', () => {
      // console.log(`Connected to server as ${socket.id}`);
      socket.emit('getChatHistory', {
        receiverId: parseInt(receiverId),
      })
    })

    // Cleanup socket connection on unmount
    return () => {
      socket.disconnect()
    }
  }, [receiverId]) // Re-run only if receiverId changes

  useEffect(() => {
    setGroupedMessages(groupMessagesByDay(messages))
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [groupedMessages])

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      socketRef.current.emit('sendMessage', {
        message: newMessage,
        receiverId: parseInt(receiverId),
      })
      setNewMessage('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        e.preventDefault()
        setNewMessage((prev) => prev + '\n')
      } else {
        e.preventDefault()
        handleSendMessage()
      }
    }
  }

  const groupMessagesByDay = (messages) => {
    return messages.reduce((acc, message) => {
      const messageDate = new Date(message.DATE)
      messageDate.setDate(messageDate.getDate())
      const formattedDate = FormatDate(messageDate.toDateString(), false) // Get the date as a string
      if (!acc[formattedDate]) {
        acc[formattedDate] = [] // Initialize the group if it doesn't exist
      }
      acc[formattedDate].push(message) // Add the message to the group
      return acc
    }, {})
  }

  return (
    <Flex
      direction='column'
      w='full'
      h='100%'
      maxHeight={'93.5vh'}
      bg='gray.100'
      backgroundImage={`url(${ChatBackground})`}
    >
      {/* Chat Messages */}
      <VStack
        spacing={4}
        align='stretch'
        flex={1}
        overflowY='auto'
        borderRadius='md'
        p={4}
      >
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <>
            <Box display={'flex'} justifyContent={'center'}>
              <Divider />
              <Text
                style={{
                  backgroundColor: '#8696a0',
                  textWrap: 'nowrap',
                  color: 'white',
                  borderRadius: '7.5px',
                  padding: '5px 12px 6px 12px',
                  boxSizing: 'border-box',
                  width: 'max-content',
                  fontSize: 'sm',
                  textAlign: 'center',
                }}
                mt={2}
              >
                {date === FormatDate(new Date().toDateString(), false)
                  ? LanguageLocalizer['today']
                  : date}
              </Text>
              <Divider />
            </Box>
            {messages.map((message) => (
              <HStack
                key={message.ID}
                justify={message.SENDERID === myID ? 'flex-end' : 'flex-start'}
              >
                <Box
                  bg={message.SENDERID === myID ? 'blue.500' : 'gray.300'}
                  color={message.SENDERID === myID ? 'white' : 'black'}
                  px={4}
                  py={2}
                  borderRadius='lg'
                  boxShadow='-6px 6px 4px 0px #0003'
                  maxW='50%'
                  position='relative'
                >
                  <Text whiteSpace={'pre-wrap'}>{message.MESSAGE}</Text>

                  <Flex
                    alignItems={'center'}
                    justifyContent='space-between'
                    gap={2}
                  >
                    {/* <Tooltip whiteSpace={"pre-wrap"} label={"Info:\nRead:"}> */}
                    <Box
                      display='inline'
                      position='relative'
                      cursor='pointer'
                      color={message.SENDERID === myID ? 'white' : 'black'}
                    >
                      <IoInformationCircleOutline />
                    </Box>
                    {/* </Tooltip> */}

                    {/* Message Date */}
                    <Text
                      fontSize='xs'
                      color={message.SENDERID === myID ? 'white' : 'black'}
                      mt={1}
                      textAlign='right'
                    >
                      {GetTimeFromDate(message.DATE)}
                    </Text>

                    {/* Read Status */}
                    {message.SENDERID === myID && (
                      <Box>
                        {message.READ_STATUS ? (
                          <IoCheckmarkDoneSharp color='yellow' />
                        ) : (
                          <IoCheckmarkOutline />
                        )}
                      </Box>
                    )}
                  </Flex>
                </Box>
              </HStack>
            ))}
          </>
        ))}

        {!groupedMessages ||
          (Object.entries(groupedMessages).length === 0 && (
            <Box
              display={'flex'}
              justifyContent={'center'}
              textAlign='center'
              py={4}
            >
              <Text
                style={{
                  backgroundColor: '#8696a0',
                  textWrap: 'nowrap',
                  color: 'white',
                  borderRadius: '7.5px',
                  padding: '5px 12px 6px 12px',
                  boxSizing: 'border-box',
                  width: 'max-content',
                  fontSize: 'sm',
                  textAlign: 'center',
                }}
              >
                {LanguageLocalizer['no_messages_yet']}
              </Text>
            </Box>
          ))}
        <div ref={bottomRef}></div>
      </VStack>

      {/* Input Box */}
      <HStack spacing={2} p={2} position='sticky' bottom={0}>
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={LanguageLocalizer['type_your_message']}
          borderRadius='md'
          resize='none'
          background={'white'}
          ref={inputRef}
        />
        <IconButton
          colorScheme='blue'
          icon={<BsSendFill />}
          onClick={handleSendMessage}
          aria-label='Send Message'
        />
      </HStack>
    </Flex>
  )
}

export default ChatViewDesktop
