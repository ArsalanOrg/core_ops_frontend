import { Avatar, Box, useMediaQuery } from '@chakra-ui/react'
import React, { useEffect } from 'react'

import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  useDisclosure,
} from '@chakra-ui/react'
import * as APIs from 'utils/APIs/APICenter.js'
import LanguageLocalizer from 'utils/LanguageLocalizer.js'
import ChatView from './ChatViewDesktop'

const ChatSidebar = () => {
  const colorPalette = ['blue', 'green', 'purple']
  const pickPalette = (name) => {
    const index = name.charCodeAt(0) % colorPalette.length
    return colorPalette[index]
  }

  const [chatableUserList, setChatableUserList] = React.useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure(true)
  const [selectedAvatar, setSelectedAvatar] = React.useState(null)
  const inputRef = React.useRef(null)

  const getChatableUsers = async () => {
    setChatableUserList(await APIs.GetChatableUsers())
  }

  useEffect(() => {
    if (chatableUserList === null) getChatableUsers()
  }, [chatableUserList])

  const openChat = (e, avatar) => {
    console.log(avatar)
    setSelectedAvatar(avatar)
    e.stopPropagation()
    onOpen()
  }

  return (
    <>
      {/* When closed */}
      <Flex direction='column' bg='orange' height='100vh'>
        <Box
          display={'flex'}
          flexDirection={'column'}
          h='100%'
          alignItems={'center'}
          p={3}
          overflow={'scroll'}
          maxHeight={'100vh'}
        >
          {chatableUserList &&
            chatableUserList.map((avatar, index) => (
              <Avatar
                cursor={'pointer'}
                mb={2}
                key={index}
                // src={avatar}
                colorPalette={pickPalette(avatar.FullName)}
                size='md'
                name={avatar.FullName}
                onClick={(e) => {
                  openChat(e, avatar)
                }}
              ></Avatar>
            ))}
        </Box>
      </Flex>

      {/* When open */}
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        size='md'
        initialFocusEl={() => inputRef.current}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {selectedAvatar && <p>{selectedAvatar.FullName}</p>}
          </DrawerHeader>

          <DrawerBody p={0}>
            {selectedAvatar && (
              <ChatView
                senderId={localStorage.getItem('userId')}
                receiverId={selectedAvatar.UserID}
                inputRef={inputRef}
              />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default ChatSidebar
