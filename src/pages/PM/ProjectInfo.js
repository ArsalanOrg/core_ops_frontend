import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as APIs from 'utils/APIs/APICenter.js'
import { useGlobalState } from 'utils/GlobalState.ts'

const ProjectInfo = () => {
  const { setTitle, setShowHint } = useGlobalState()
  const [projectMembers, setProjectMembers] = useState([])
  const [newUsers, setNewUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [userName, setUserName] = useState('')
  const [editButtonDisabled, setEditButtonDisabled] = useState(true)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()
  const toast = useToast()
  const { projectId } = useParams()

  useEffect(() => {
    setTitle('Proje Hakkında')
    setShowHint(false)
    fetchProjectMembers()
    fetchAllMembers()
  }, [projectId])

  const fetchProjectMembers = async () => {
    const members = await APIs.GetProjectMembers(projectId)
    setProjectMembers(members)
  }

  const fetchAllMembers = async () => {
    const members = await APIs.GetMembers()
    setAllUsers(members)
    console.log('allUsers:', members)
  }

  const addUserToList = () => {
    if (!userName) {
      return toast({
        title: 'Lütfen bir kullanıcı seçin',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      })
    }

    const selectedUser = allUsers.find((u) => u.ID.toString() === userName)
    if (!selectedUser) {
      return toast({
        title: 'Geçersiz kullanıcı seçimi',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }

    if (newUsers.some((u) => u.ID === selectedUser.ID)) {
      return toast({
        title: 'Bu kullanıcı zaten eklendi',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      })
    }

    setNewUsers((prev) => [...prev, selectedUser])
    setUserName('')
  }

  const submitNewUsers = async () => {
    if (newUsers.length === 0) {
      return toast({
        title: 'Hiç kullanıcı eklenmedi',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      })
    }

    try {
      // now sending array of numeric IDs
      const userIds = newUsers.map((u) => u.ID)
      const res = await APIs.AddMember({
        PROJECTID: projectId,
        USERIDS: userIds,
      })

      if (res) {
        toast({
          title: 'Üyeler başarıyla eklendi',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        setNewUsers([])
        fetchProjectMembers()
        onClose()
      }
    } catch {
      toast({
        title: 'Üyeler eklenirken bir hata oluştu',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  return (
    <>
      <Flex justify='flex-end' gap='1em' m='1em'>
        {['head', 'admin'].includes(localStorage.getItem('role')) && (
          <>
            <Button leftIcon={<AddIcon />} colorScheme='green' onClick={onOpen}>
              Üye Ekle
            </Button>
            <Button
              leftIcon={<EditIcon />}
              colorScheme='yellow'
              onClick={() => setEditButtonDisabled(!editButtonDisabled)}
            >
              Düzenle
            </Button>
          </>
        )}
        <Button
          leftIcon={<ViewIcon />}
          colorScheme='blue'
          onClick={() => navigate(`/tasks/${projectId}`)}
        >
          Görev Listesi
        </Button>
      </Flex>

      <Table variant='striped'>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Ad Soyad</Th>
            <Th>Kullanıcı Adı</Th>
            {['head', 'admin'].includes(localStorage.getItem('role')) &&
              !editButtonDisabled && <Th>Kullanıcı Sil</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {projectMembers.map((member) => (
            <Tr key={member.UserID}>
              <Td>{member.UserID}</Td>
              <Td>{member.FullName}</Td>
              <Td>{member.UserName}</Td>
              {!editButtonDisabled &&
                ['head', 'admin'].includes(localStorage.getItem('role')) && (
                  <Td>
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme='red'
                      onClick={async () => {
                        await APIs.DeleteMember({
                          PROJECTID: projectId,
                          USERID: member.UserID,
                        })
                        fetchProjectMembers()
                      }}
                    />
                  </Td>
                )}
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal for Adding Users */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Yeni Üye Ekle</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Kullanıcı</FormLabel>
                <Select
                  placeholder='Seçiniz...'
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                >
                  {allUsers.map((user) => (
                    <option key={user.ID} value={user.ID}>
                      {user.Name} {user.Surname}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <Button colorScheme='blue' onClick={addUserToList}>
                Kullanıcıyı Ekle
              </Button>

              {newUsers.length > 0 && (
                <Table variant='striped'>
                  <Thead>
                    <Tr>
                      <Th>#</Th>
                      <Th>Ad Soyad</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {newUsers.map((u, i) => (
                      <Tr key={u.ID}>
                        <Td>{i + 1}</Td>
                        <Td>
                          {u.Name} {u.Surname}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={submitNewUsers}>
              Kaydet
            </Button>
            <Button onClick={onClose} ml={3}>
              İptal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProjectInfo
