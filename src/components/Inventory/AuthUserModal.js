// components/Inventory/AuthUserModal.js
import React, { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  VStack,
  Flex,
  useToast,
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import * as APIs from 'utils/APIs/APICenter.js'

export default function AuthUserModal({ isOpen, onClose, onSave }) {
  const toast = useToast()
  const [allUsers, setAllUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [newUsers, setNewUsers] = useState([])

  // whenever modal opens, clear selections and fetch user list
  useEffect(() => {
    if (isOpen) {
      setSelectedUserId('')
      setNewUsers([])
      fetchAllUsers()
    }
  }, [isOpen])

  const fetchAllUsers = async () => {
    try {
      const users = await APIs.GetMembers()
      setAllUsers(users)
    } catch (err) {
      toast({
        title: 'Kullanıcılar yüklenemedi',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const addUserToList = () => {
    if (!selectedUserId) {
      return toast({
        title: 'Lütfen bir kullanıcı seçin',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      })
    }
    const user = allUsers.find((u) => u.ID.toString() === selectedUserId)
    if (!user) {
      return toast({
        title: 'Geçersiz kullanıcı seçimi',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
    if (newUsers.some((u) => u.ID === user.ID)) {
      return toast({
        title: 'Bu kullanıcı zaten eklendi',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      })
    }
    setNewUsers((prev) => [...prev, user])
    setSelectedUserId('')
  }

  const removeUser = (id) => {
    setNewUsers((prev) => prev.filter((u) => u.ID !== id))
  }

  const handleSave = () => {
    if (newUsers.length === 0) {
      return toast({
        title: 'Hiç kullanıcı eklenmedi',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      })
    }
    // pass array of IDs back to parent
    onSave({ userIds: newUsers.map((u) => u.ID) })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Yetkili Kullanıcı Ekle</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align='stretch'>
            <FormControl>
              <FormLabel>Kullanıcı</FormLabel>
              <Flex>
                <Select
                  placeholder='Seçiniz...'
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  {allUsers.map((user) => (
                    <option key={user.ID} value={user.ID}>
                      {user.Name} {user.Surname}
                    </option>
                  ))}
                </Select>
                <IconButton
                  ml={2}
                  colorScheme='blue'
                  icon={<AddIcon />}
                  aria-label='Kullanıcıyı ekle'
                  onClick={addUserToList}
                />
              </Flex>
            </FormControl>

            {newUsers.length > 0 && (
              <Table variant='striped' size='sm'>
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Ad Soyad</Th>
                    <Th>İşlem</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {newUsers.map((u, i) => (
                    <Tr key={u.ID}>
                      <Td>{i + 1}</Td>
                      <Td>
                        {u.Name} {u.Surname}
                      </Td>
                      <Td>
                        <IconButton
                          size='sm'
                          icon={<DeleteIcon />}
                          aria-label='Sil'
                          onClick={() => removeUser(u.ID)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            İptal
          </Button>
          <Button colorScheme='green' onClick={handleSave}>
            Ekle
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
