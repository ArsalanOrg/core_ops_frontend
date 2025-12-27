import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
  useToast,
  Input,
  Flex,
} from '@chakra-ui/react'
import Select from 'react-select'
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons'
import * as APIs from 'utils/APIs/APICenter.js'
import { useGlobalState } from 'utils/GlobalState.ts'

const Users = () => {
  // Dropdown options for “Rol” and “Birimdeki Rol”
  const roleOptions = [
    { value: 1, label: 'Üye' },
    { value: 2, label: 'Yönetici' },
    { value: 3, label: 'Yönetim' },
  ]
  const departmentRoleOptions = [
    { value: 1, label: 'Üye' },
    { value: 2, label: 'Yönetici' },
  ]

  // State variables
  const [users, setUsers] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [newUser, setNewUser] = useState({
    Name: '',
    Surname: '',
    Department: '', // number
    Phone: '',
    Mail: '',
    Role: '', // number
    DepartmentRole: '', // number
    Password: '',
    ConfirmPassword: '', // new field
    UserName: '',
  })

  const toast = useToast()
  const { setTitle, setShowHint } = useGlobalState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure()

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await APIs.GetUsers()
      const userArray = Array.isArray(response.data) ? response.data : response
      setUsers(userArray)
    } catch (err) {
      setError('Failed to fetch users.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch department options
  const fetchDepartments = async () => {
    try {
      const response = await APIs.GetDepartments()
      const opts = (response || []).map((dept) => ({
        label: dept.Name,
        value: dept.DepartmentID,
      }))
      setDepartments(opts)
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to fetch departments.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // When component mounts, set title and load data
  useEffect(() => {
    setTitle('Kullanıcı Yönetimi')
    setShowHint(false)
    fetchDepartments()
    fetchUsers()
  }, [])

  // Open modal for new user
  const handleNewUser = () => {
    setSelectedUser(null)
    setNewUser({
      Name: '',
      Surname: '',
      Department: '',
      Phone: '',
      Mail: '',
      Role: '',
      DepartmentRole: '',
      Password: '',
      ConfirmPassword: '',
      UserName: '',
    })
    onOpen()
  }

  // Save (create or update) a user
  const handleSaveUser = async () => {
    setLoading(true)
    try {
      const {
        Name,
        Surname,
        Department,
        Phone,
        Mail,
        Role,
        DepartmentRole,
        Password,
        ConfirmPassword,
        UserName,
      } = newUser

      // 1) Basic required fields
      if (!Name || !Surname || !Department || !UserName || !Password) {
        toast({
          title: 'Hata',
          description: 'Ad, Soyad, Bölüm, Kullanıcı Adı ve Şifre zorunludur.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        setLoading(false)
        return
      }

      // 2) Check password vs. confirm password
      if (Password !== ConfirmPassword) {
        toast({
          title: 'Hata',
          description: 'Şifre ve Şifre (Tekrar) eşleşmiyor.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        setLoading(false)
        return
      }

      // Build payload. UserStatus is hard-coded to 1.
      const payload = {
        Name,
        Surname,
        Department,
        Phone: Phone || null,
        Mail: Mail || null,
        Role: Role || null,
        DepartmentRole: DepartmentRole || null,
        UserStatus: 1, // always 1
        Password,
        UserName,
      }

      if (selectedUser) {
        // Update existing user
        await APIs.UpdateUser(payload, selectedUser.ID)
        toast({
          title: 'Başarılı',
          description: 'Kullanıcı başarıyla güncellendi.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        // Create new user
        await APIs.CreateUser(payload)
        toast({
          title: 'Başarılı',
          description: 'Kullanıcı başarıyla oluşturuldu.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }

      fetchUsers()
      onClose()
      onEditClose()
      setNewUser({
        Name: '',
        Surname: '',
        Department: '',
        Phone: '',
        Mail: '',
        Role: '',
        DepartmentRole: '',
        Password: '',
        ConfirmPassword: '',
        UserName: '',
      })
    } catch (err) {
      toast({
        title: 'Hata',
        description: 'Kullanıcı kaydedilirken bir hata oluştu.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete a user (soft delete)
  const handleDeleteUser = async (id) => {
    try {
      await APIs.DeleteUser(id)
      toast({
        title: 'Başarılı',
        description: 'Kullanıcı başarıyla silindi.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      fetchUsers()
    } catch (err) {
      toast({
        title: 'Hata',
        description: 'Kullanıcı silinirken bir hata oluştu.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Helper to get department label from ID
  const getDeptLabel = (deptId) => {
    const found = departments.find((opt) => opt.value === deptId)
    return found ? found.label : '—'
  }

  return (
    <Box p={5}>
      {/* Header with title and new user button */}
      <Flex
        mb={4}
        justifyContent='space-between'
        alignItems={{ base: 'flex-start', md: 'center' }}
        flexDirection={{ base: 'column', md: 'row' }}
      >
        <Text fontSize='2xl' fontWeight='bold'>
          Kullanıcılar
        </Text>
        <Button
          onClick={handleNewUser}
          colorScheme='green'
          ml={{ base: 0, md: 4 }}
          mt={{ base: 2, md: 0 }}
          w={{ base: '100%', md: 'auto' }}
        >
          <AddIcon mr={2} />
          Yeni Kullanıcı
        </Button>
      </Flex>

      {loading ? (
        <Spinner size='lg' />
      ) : error ? (
        <Text color='red.500'>{error}</Text>
      ) : users.length > 0 ? (
        <Box overflowX='auto'>
          <Table variant='striped' size={{ base: 'sm', md: 'md' }} minW='600px'>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Ad Soyad </Th>
                {/* <Th>Soyad</Th> */}
                <Th>Kullanıcı Adı</Th>
                {/* <Th>Mail</Th> */}
                <Th>Telefon</Th>
                <Th>Bölüm</Th>
                <Th>Rol</Th>
                {/* <Th>Durum</Th> */}
                {['admin'].includes(localStorage.getItem('role')) && (
                  <Th>İşlemler</Th>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user.ID}>
                  <Td fontSize={{ base: 'xs', md: 'sm' }}>{user.ID}</Td>
                  <Td fontSize={{ base: 'xs', md: 'sm' }}>{user.FullName}</Td>
                  {/* <Td>{user.Surname}</Td> */}
                  <Td fontSize={{ base: 'xs', md: 'sm' }}>{user.UserName}</Td>
                  {/* <Td>{user.Mail || '—'}</Td> */}
                  <Td fontSize={{ base: 'xs', md: 'sm' }}>
                    {user.Phone || '—'}
                  </Td>
                  <Td fontSize={{ base: 'xs', md: 'sm' }}>
                    {getDeptLabel(user.Department)}
                  </Td>
                  <Td fontSize={{ base: 'xs', md: 'sm' }}>
                    {roleOptions.find((opt) => opt.value === user.Role)
                      ?.label || '—'}
                  </Td>
                  {/* <Td>{user.UserStatus === 1 ? 'Active' : '—'}</Td> */}
                {['admin'].includes(localStorage.getItem('role')) && (
                  <Td>

                    <Button
                      size='sm'
                      colorScheme='blue'
                      ml={2}
                      onClick={() => {
                        setSelectedUser(user)
                        setNewUser({
                          Name: user.Name || '',
                          Surname: user.Surname || '',
                          Department: user.Department || '',
                          Phone: user.Phone || '',
                          Mail: user.Mail || '',
                          Role: user.Role || '',
                          DepartmentRole: user.DepartmentRole || '',
                          Password: '',
                          ConfirmPassword: '',
                          UserName: user.UserName || '',
                        })
                        onEditOpen()
                      }}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      size='sm'
                      colorScheme='red'
                      onClick={() => handleDeleteUser(user.ID)}
                      ml={2}
                    >
                      <DeleteIcon />
                    </Button>
                  </Td>
                )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Text>Herhangi bir kullanıcı bulunamadı.</Text>
      )}

      {/* Create/Edit User Modal */}
      <Modal
        isOpen={isOpen || isEditOpen}
        onClose={isEditOpen ? onEditClose : onClose}
        size={{ base: 'full', md: 'lg' }}
        scrollBehavior='inside'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isRequired>
              <FormLabel>Ad</FormLabel>
              <Input
                name='Name'
                value={newUser.Name}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, Name: e.target.value }))
                }
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Soyad</FormLabel>
              <Input
                name='Surname'
                value={newUser.Surname}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, Surname: e.target.value }))
                }
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Kullanıcı Adı</FormLabel>
              <Input
                name='UserName'
                value={newUser.UserName}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, UserName: e.target.value }))
                }
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Şifre</FormLabel>
              <Input
                type='password'
                name='Password'
                value={newUser.Password}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, Password: e.target.value }))
                }
              />
            </FormControl>

            {/* New Confirm Password */}
            <FormControl mb={3} isRequired>
              <FormLabel>Şifre (Tekrar)</FormLabel>
              <Input
                type='password'
                name='ConfirmPassword'
                value={newUser.ConfirmPassword}
                onChange={(e) =>
                  setNewUser((prev) => ({
                    ...prev,
                    ConfirmPassword: e.target.value,
                  }))
                }
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Mail</FormLabel>
              <Input
                type='email'
                name='Mail'
                value={newUser.Mail}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, Mail: e.target.value }))
                }
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Telefon</FormLabel>
              <Input
                name='Phone'
                value={newUser.Phone}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, Phone: e.target.value }))
                }
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Bölüm</FormLabel>
              <Select
                name='Department'
                options={departments}
                value={
                  departments.find(
                    (opt) => opt.value === Number(newUser.Department)
                  ) || null
                }
                onChange={(selectedOption) =>
                  setNewUser((prev) => ({
                    ...prev,
                    Department: selectedOption?.value || '',
                  }))
                }
                placeholder='Seçiniz'
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Rol</FormLabel>
              <Select
                name='Role'
                options={roleOptions}
                value={
                  roleOptions.find((opt) => opt.value === newUser.Role) || null
                }
                onChange={(selectedOption) =>
                  setNewUser((prev) => ({
                    ...prev,
                    Role: selectedOption?.value ?? '',
                  }))
                }
                placeholder='Seçiniz'
              />
              <Text fontSize='sm' color='gray.500' mt={1}>
                1: User, 2: Admin, 3: Board
              </Text>
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Birimdeki Rol</FormLabel>
              <Select
                name='DepartmentRole'
                options={departmentRoleOptions}
                value={
                  departmentRoleOptions.find(
                    (opt) => opt.value === newUser.DepartmentRole
                  ) || null
                }
                onChange={(selectedOption) =>
                  setNewUser((prev) => ({
                    ...prev,
                    DepartmentRole: selectedOption?.value ?? '',
                  }))
                }
                placeholder='Seçiniz'
              />
              <Text fontSize='sm' color='gray.500' mt={1}>
                1: User, 2: Admin
              </Text>
            </FormControl>

            {/* UserStatus is always 1 now, so no input field */}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme='teal'
              onClick={handleSaveUser}
              isLoading={loading}
            >
              Kaydet
            </Button>
            <Button
              variant='ghost'
              onClick={isEditOpen ? onEditClose : onClose}
              ml={2}
            >
              Kapat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Users
