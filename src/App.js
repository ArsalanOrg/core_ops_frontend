import { Box, ChakraProvider, Flex } from '@chakra-ui/react'
import React, { useEffect, useRef } from 'react'
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import ProjectList from './pages/PM/ProjectList.js'
import TaskList from './pages/PM/TaskList.js'
import ActivityLogs from './pages/PM/ActivityLog.js'
import ObserverTasks from './pages/PM/ObserverTasks.js'
import { subscribeUserToPush } from './utils/Functions/UtilFunctions.js'
import ProjectInfo from './pages/PM/ProjectInfo.js'
import UpdatePassword from './pages/UpdatePassword.js'
import { useGlobalState } from './utils/GlobalState.ts'
import ToDoList from './pages/PM/TodoList.js'
import ChatSidebar from './components/chat/ChatSidebar.js'
import ChatList from './pages/chat/ChatList.js'
import Inventory from 'pages/inventory/Inventory'
import InventoryLogs from 'pages/inventory/InventoryLogs'
import { GetChatSocket } from 'utils/Functions/GetChatSocket'
import ChatListMob from 'pages/chat/ChatListMobile'
import User from 'pages/User/User'
import Departments from 'pages/departments/Department'

const App = () => {
  const { userName, setUserName } = useGlobalState()
  const socketRef = useRef(null) // Store socket instance

  useEffect(() => {
    const jwt = localStorage.getItem('jwt')
    if (jwt != null) {
      setUserName(localStorage.getItem('username'))

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                subscribeUserToPush(registration)
              }
            })
          })
      }
    } else {
      setUserName(null)
    }

    socketRef.current = GetChatSocket()
    const socket = socketRef.current

    socket.on('connect', () => {
      console.log('Connected to server')
      socket.emit('online')
    })
    const handleBeforeUnload = (event) => {
      socket.emit('offline')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    // Cleanup socket connection on unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      socket.disconnect()
    }
  }, [userName, setUserName])

  return (
    <ChakraProvider>
      <Router>
        <Flex minHeight='100vh'>
          <Box position={'fixed'} top={0} left={0}>
            {userName && <Sidebar />}
          </Box>
          <Flex
            flex={1}
            flexDir='column'
            maxHeight={'100vh'}
            marginLeft={userName ? '72px' : '0px'}
            // marginRight={userName ? '60px' : '0px'}
          >
            {userName && <Header />}
            <Routes>
              <Route
                path='/'
                element={
                  <Navigate to={userName ? '/projectList' : '/login'} replace />
                }
              />
              <Route
                path='/login'
                element={!userName ? <Login /> : <ProjectList />}
              />
              <Route
                path='/userPanel'
                element={!userName ? <Login /> : <User />}
              />
              <Route
                path='/departmentPanel'
                element={!userName ? <Login /> : <Departments />}
              />

              <Route
                path='/projectList'
                element={userName ? <ProjectList /> : <Login />}
              />
              <Route
                path='/myTasks'
                element={userName ? <TaskList /> : <Login />}
              ></Route>
              <Route
                path='/observerPanel'
                element={userName ? <ObserverTasks /> : <Login />}
              ></Route>
              <Route
                path='/tasks/:projectId'
                element={userName ? <TaskList /> : <Login />}
              />
              <Route
                path='/activityLog'
                element={userName ? <ActivityLogs /> : <Login />}
              />
              <Route
                path='/todoList'
                element={userName ? <ToDoList /> : <Login />}
              />
              <Route
                path='/projectInfo/:projectId'
                element={userName ? <ProjectInfo /> : <Login />}
              />
              <Route
                path='/updatePassword'
                element={userName ? <UpdatePassword /> : <Login />}
              />
              <Route
                path='/chatList'
                element={userName ? <ChatList /> : <Login />}
              />
              <Route
                path='/inventoryList'
                element={userName ? <Inventory /> : <Login />}
              />
              <Route
                path='/inventoryLogs'
                element={userName ? <InventoryLogs /> : <Login />}
              />
              <Route
                path='/mobchat'
                element={userName ? <ChatListMob /> : <Login />}
              />
            </Routes>
            <Box flex={1}></Box>
            <Box>{userName && <Footer />}</Box>
          </Flex>
          {/* <Box position={'fixed'} top={0} right={0}>
            {userName && <ChatSidebar />}
          </Box> */}
        </Flex>
      </Router>
    </ChakraProvider>
  )
}

export default App
