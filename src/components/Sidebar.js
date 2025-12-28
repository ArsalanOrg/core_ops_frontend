import { Box, Button, Icon, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { GoProjectRoadmap } from 'react-icons/go'
import {
  MdOutlineManageSearch,
} from 'react-icons/md'

import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react'
import {
  FaRegMehRollingEyes,
  FaRegUser,
  FaTasks,
  FaTools,
} from 'react-icons/fa'
import { MdFactory } from "react-icons/md";

import { FcTodoList, FcDepartment } from 'react-icons/fc'
import { IoIosChatbubbles, IoIosLock } from 'react-icons/io'
import { MdOutlineManageAccounts } from 'react-icons/md'
import {  PiPasswordFill } from 'react-icons/pi'
import { RxHamburgerMenu } from 'react-icons/rx'
import { FaWarehouse } from 'react-icons/fa6'

import {
  TbActivity,
  TbLogs,
} from 'react-icons/tb'
import { Link, useNavigate } from 'react-router-dom'
import * as APIs from 'utils/APIs/APICenter.js'
import { Seperator } from 'utils/CustomElements.jsx'
import { useGlobalState } from 'utils/GlobalState.ts'
import LanguageLocalizer from 'utils/LanguageLocalizer.js'
import { isMobile } from 'react-device-detect'

const Sidebar = () => {
  const { userName, setUserName } = useGlobalState()
  const navigate = useNavigate()
  const [defaultAccordion, setDefaultAccordion] = useState(0)

  useEffect(() => {}, [userName, setUserName])

  const handleLogout = async () => {
    await APIs.UnSubscribeUserToPush()
    onClose()
    localStorage.removeItem('jwt')
    localStorage.removeItem('username')
    localStorage.removeItem('departmentHead')
    localStorage.removeItem('role')
    localStorage.removeItem('UserID')
    setUserName('')
    navigate('/')
  }

  const { isOpen, onOpen, onClose } = useDisclosure(true)
  const btnRef = React.useRef()
  // open the admin dashboard for all the admins and for MiA and EROLS user
  // const adminAuth = [2, 16, 7]

  const SidebarItem = ({ to, label, icon: IconComponent }) => (
    <Link to={to} onClick={onClose}>
      <Box display='flex' alignItems='center' _hover={{ bg: 'gray.300' }}>
        {IconComponent && <Icon as={IconComponent} mr='2' />}{' '}
        <Text py='2' px='4' borderRadius='md'>
          {label}
        </Text>
      </Box>
    </Link>
  )

  return (
    <>
      {/* When closed */}
      <Flex
        direction='column'
        height='100vh' // Make it take the full viewport height
        bg='orange' // Background for sidebar
      >
        <Box display={'flex'} flexDirection={'column'} h='100%' bg='#34496F'>
          <IconButton
            bg='blue.500'
            p={3}
            m={3}
            colorScheme='orange'
            aria-label='Side bar'
            size='lg'
            onClick={onOpen}
            ref={btnRef}
            icon={<Icon as={RxHamburgerMenu} />}
          />

          <IconButton
            borderRadius='50%'
            bg='blue.500'
            p={3}
            m={3}
            colorScheme='black'
            aria-label='Side bar'
            size='lg'
            onClick={() => navigate('/todoList')}
            icon={<Icon as={FcTodoList} />}
          />

          <IconButton
            borderRadius='50%'
            bg='blue.500'
            p={3}
            m={3}
            colorPalette='#5b6270ff'
            aria-label='Chat'
            size='lg'
            onClick={() =>
              isMobile ? navigate('/mobchat') : navigate('/chatList')
            }
            icon={<Icon as={IoIosChatbubbles} />}
          />
        </Box>
      </Flex>

      {/* When open */}
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {LanguageLocalizer['welcome']} {userName}
            <br />
            {localStorage.getItem('role') === 'user' && (
              <div>
                {LanguageLocalizer['department_head']} :{' '}
                {localStorage.getItem('departmentHead')}
              </div>
            )}
          </DrawerHeader>

          <DrawerBody>
            <Accordion
              onChange={(e) => {
                setDefaultAccordion(e)
              }}
              allowToggle
              defaultIndex={[defaultAccordion]}
            >
              {localStorage.getItem('role') === 'admin' && (
                // || localStorage.getItem('role') === 'head'
                <AccordionItem>
                  <AccordionButton bg='#6e92d4ff' borderRadius={4}>
                    <MdOutlineManageAccounts />
                    <Text ml={2}>{LanguageLocalizer['board_pages']}</Text>
                  </AccordionButton>
                  <AccordionPanel>
                    <SidebarItem
                      to='/userPanel'
                      label={'Kullanıcılar'}
                      icon={FaRegUser}
                    />
                    <SidebarItem
                      to='/departmentPanel'
                      label={'Departmanlar'}
                      icon={FcDepartment}
                    />
                    <Seperator></Seperator>
                    {/* <SidebarItem
                      to='/productCost'
                      label={'Kullanıcı Listesi'}
                      icon={TbZoomMoney}
                    />
                    <Seperator></Seperator>
                    <SidebarItem
                      to='/costRecords'
                      label={LanguageLocalizer['cost_records']}
                      icon={GrMoney}
                    />
                    <Seperator></Seperator> */}
                  </AccordionPanel>
                </AccordionItem>
              )}

              <AccordionItem>
                <AccordionButton bg='#6e92d4ff' borderRadius={4}>
                  <GoProjectRoadmap />
                  <Text ml={2}>Proje Yönetimi</Text>
                </AccordionButton>
                <AccordionPanel>
                  <SidebarItem
                    to='/projectList'
                    label={LanguageLocalizer['projects']}
                    icon={MdOutlineManageSearch}
                  />
                  <Seperator></Seperator>
                  <SidebarItem
                    to='/myTasks'
                    label={LanguageLocalizer['my_tasks']}
                    icon={FaTasks}
                  />
                  <Seperator></Seperator>
                  <SidebarItem
                    to='/observerPanel'
                    label={LanguageLocalizer['observer_panel']}
                    icon={FaRegMehRollingEyes}
                  />
                  <Seperator></Seperator>
                  <SidebarItem
                    to='/activityLog'
                    label={LanguageLocalizer['flow']}
                    icon={TbActivity}
                  />
                  <Seperator></Seperator>
                  <SidebarItem
                    to='/todoList'
                    label={LanguageLocalizer['todo']}
                    icon={FcTodoList}
                  />
                  <Seperator></Seperator>
                  {/* <SidebarItem
                    // to='/myTasks'
                    label={LanguageLocalizer['reporting']}
                    icon={IoIosLock}
                  /> */}
                  {/* <Seperator></Seperator>
                  <SidebarItem
                    // to='/myTasks'
                    // label='İstatistik '
                    label={LanguageLocalizer['statistics']}
                    icon={IoIosLock}
                  /> */}
                  {/* <Seperator></Seperator>
                  <SidebarItem
                    // to='/myTasks'
                    label={LanguageLocalizer['performance']}
                    icon={IoIosLock}
                  />
                  <Seperator></Seperator> */}
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton bg='#6e92d4ff' borderRadius={4}>
                  <FaRegUser />
                  <Text ml={2}>{LanguageLocalizer['user_settings']}</Text>
                </AccordionButton>
                <AccordionPanel>
                  <SidebarItem
                    to='/updatePassword'
                    label={LanguageLocalizer['update_password']}
                    icon={PiPasswordFill}
                  />
                  <Seperator></Seperator>
                </AccordionPanel>
              </AccordionItem>
              {/* Production */}
              <AccordionItem>

                <AccordionButton bg='#6e92d4ff' borderRadius={4}>
                  {/* <FaRegUser /> */}
                  {/* <FaWarehouse /> */}
                  <MdFactory />

                  <Text ml={2}> Üretim </Text>
                </AccordionButton>
                <AccordionPanel>
                  <SidebarItem
                    to='/productionDashboard'
                    label='Üretim Panosu'
                    icon={FaTools}
                  />
                  <Seperator></Seperator>
                  {/* <SidebarItem
                    to='/inventoryLogs'
                    label='Lojistik Hareketi'
                    icon={TbLogs}
                  /> */}
                  <Seperator></Seperator>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>

                <AccordionButton bg='#6e92d4ff' borderRadius={4}>
                  {/* <FaRegUser /> */}
                  <FaWarehouse />

                  <Text ml={2}> Lojistik </Text>
                </AccordionButton>
                <AccordionPanel>
                  <SidebarItem
                    to='/inventoryList'
                    label='Envanter Listesi'
                    icon={FaTools}
                  />
                  <Seperator></Seperator>
                  <SidebarItem
                    to='/inventoryLogs'
                    label='Lojistik Hareketi'
                    icon={TbLogs}
                  />
                  <Seperator></Seperator>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </DrawerBody>

          <DrawerFooter justifyContent='flex-start'>
            <Button mt='4' colorScheme='red' onClick={handleLogout}>
              {LanguageLocalizer['logout']}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default Sidebar
