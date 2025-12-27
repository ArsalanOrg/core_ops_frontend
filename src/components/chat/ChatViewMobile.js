import {
  Box,
  Divider,
  Flex,
  HStack,
  IconButton,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import {
  IoArrowBack,
  IoCheckmarkOutline,
  IoCheckmarkDoneSharp,
} from 'react-icons/io5'
import { BsSendFill } from 'react-icons/bs'
import * as APIs from 'utils/APIs/APICenter.js'
import { GetChatSocket } from 'utils/Functions/GetChatSocket'
import { FormatDate, GetTimeFromDate } from 'utils/Functions/UtilFunctions'

const ChatViewMobile = ({ receiverId, onBack }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [groupedMessages, setGroupedMessages] = useState([])
  const myID = parseInt(localStorage.getItem('UserID'))

  const socketRef = useRef(null) // Socket instance
  const bottomRef = useRef(null) // Reference to scroll to the last message

  useEffect(() => {
    socketRef.current = GetChatSocket()

    // Fetch chat history
    socketRef.current.emit('getChatHistory', {
      receiverId: parseInt(receiverId),
    })

    // Handle new messages
    socketRef.current.on('messageReceived', (message) => {
      if (
        message.SENDERID === parseInt(receiverId) ||
        message.RECEIVERID === parseInt(receiverId)
      ) {
        setMessages((prev) => [...prev, message])
        // Mark as read if the message is from the current receiver
        if (message.SENDERID === parseInt(receiverId)) {
          socketRef.current.emit('messageRead', { messageId: message.ID })
        }
      }
    })

    // Load chat history
    socketRef.current.on('chatHistory', (history) => {
      // Mark unread messages from the receiver as read
      history.forEach((message) => {
        if (
          message.READ_STATUS === 0 &&
          message.SENDERID === parseInt(receiverId)
        ) {
          socketRef.current.emit('messageRead', { messageId: message.ID })
        }
      })
      setMessages(history)
    })

    // Handle message read status updates
    socketRef.current.on('messageRead', (messageId) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.ID === messageId ? { ...msg, READ_STATUS: 1 } : msg
        )
      )
    })

    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect()
    }
  }, [receiverId])

  useEffect(() => {
    setGroupedMessages(groupMessagesByDay(messages))
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const groupMessagesByDay = (messages) => {
    return messages.reduce((acc, message) => {
      const messageDate = new Date(message.DATE).toDateString()
      const formattedDate = FormatDate(messageDate, false)
      if (!acc[formattedDate]) {
        acc[formattedDate] = []
      }
      acc[formattedDate].push(message)
      return acc
    }, {})
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      socketRef.current.emit('sendMessage', {
        message: newMessage,
        receiverId: parseInt(receiverId),
      })
      setNewMessage('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Flex direction='column' height='100vh'>
      {/* Header */}
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        p={4}
        borderBottom='1px solid gray'
      >
        <IconButton
          icon={<IoArrowBack />}
          onClick={onBack}
          aria-label='Go back'
        />
        <Text fontWeight='bold'>Chat</Text>
      </Box>

      {/* Chat Messages */}
      <VStack flex={1} spacing={4} align='stretch' overflowY='auto' p={4}>
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <React.Fragment key={date}>
            <Box textAlign='center' mb={2}>
              <Divider />
              <Text
                bg='gray.300'
                borderRadius='lg'
                px={2}
                py={1}
                display='inline-block'
                fontSize='sm'
                color='black'
              >
                {date}
              </Text>
              <Divider />
            </Box>
            {messages.map((message) => (
              <HStack
                key={message.ID}
                justify={message.SENDERID === myID ? 'flex-end' : 'flex-start'}
                w='100%'
              >
                <Box
                  bg={message.SENDERID === myID ? 'blue.500' : 'gray.300'}
                  color={message.SENDERID === myID ? 'white' : 'black'}
                  px={4}
                  py={2}
                  borderRadius='lg'
                  maxWidth='70%'
                  boxShadow='lg'
                >
                  <Text whiteSpace='pre-wrap'>{message.MESSAGE}</Text>
                  <Flex
                    alignItems='center'
                    justifyContent='space-between'
                    fontSize='xs'
                    color={
                      message.SENDERID === myID
                        ? 'whiteAlpha.800'
                        : 'blackAlpha.700'
                    }
                    mt={1}
                  >
                    <Text>{GetTimeFromDate(message.DATE)}</Text>
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
          </React.Fragment>
        ))}
        <div ref={bottomRef}></div>
      </VStack>

      {/* Input Box */}
      <Box p={4} borderTop='1px solid gray'>
        <HStack spacing={4}>
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Type your message...'
            resize='none'
            size='sm'
            bg='white'
          />
          <IconButton
            icon={<BsSendFill />}
            colorScheme='blue'
            onClick={handleSendMessage}
            aria-label='Send message'
          />
        </HStack>
      </Box>
    </Flex>
  )
}

export default ChatViewMobile
