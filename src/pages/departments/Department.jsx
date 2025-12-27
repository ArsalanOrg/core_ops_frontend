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
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons'
import * as APIs from 'utils/APIs/APICenter.js'
import { useGlobalState } from 'utils/GlobalState.ts'

const Departments = () => {
  // State variables
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedDept, setSelectedDept] = useState(null)
  const [newDept, setNewDept] = useState({
    Name: '',
    Code: '',
    Description: '',
    Status: '',
  })

  const toast = useToast()
  const { setTitle, setShowHint } = useGlobalState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure()

  // Fetch all departments
  const fetchDepartments = async () => {
    setLoading(true)
    try {
      const response = await APIs.GetDepartments()
      setDepartments(response || [])
    } catch (err) {
      setError('Failed to fetch departments.')
    } finally {
      setLoading(false)
    }
  }

  // On mount, set title and load list
  useEffect(() => {
    setTitle('Bölümler')
    setShowHint(false)
    fetchDepartments()
  }, [])

  // Open modal for new department
  const handleNewDept = () => {
    setSelectedDept(null)
    setNewDept({
      Name: '',
      Code: '',
      Description: '',
      Status: '',})
    onOpen()
  }

  // Save (create or update) department
  const handleSaveDept = async () => {
    setLoading(true)
    try {
      const { Name, Code, Description, Status=1 } = newDept

      // Basic validation: Name & Code required
      if (!Name || !Code) {
        toast({
          title: 'Hata',
          description: 'Bölüm adı ve kodu zorunludur.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        setLoading(false)
        return
      }

      const payload = {
        Name,
        Code,
        Description: Description || null,
        Status: Status !== '' ? Number(Status) : null,
      }

      if (selectedDept) {
        // Update existing
        await APIs.UpdateDepartment(payload, selectedDept.DepartmentID)
        toast({
          title: 'Başarılı',
          description: 'Bölüm başarıyla güncellendi.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        // Create new
        await APIs.CreateDepartment(payload)
        toast({
          title: 'Başarılı',
          description: 'Bölüm başarıyla oluşturuldu.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }

      fetchDepartments()
      onClose()
      onEditClose()
      setNewDept({
        Name: '',
        Code: '',
        Description: '',
        Status: '',
      })
    } catch (err) {
      toast({
        title: 'Hata',
        description: 'Bölüm kaydedilirken bir hata oluştu.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete (soft/delete) a department
  const handleDeleteDept = async (id) => {
    try {
      await APIs.DeleteDepartment(id)
      toast({
        title: 'Başarılı',
        description: 'Bölüm başarıyla silindi.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      fetchDepartments()
    } catch (err) {
        console.log(err);
        
      toast({
        title: 'Hata',
        description: 'Bölüm silinirken bir hata oluştu.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Box p={5}>
      {/* Header */}
      <Flex mb={4} justifyContent='space-between' alignItems='center'>
        <Text fontSize='2xl' fontWeight='bold'>
          Bölümler
        </Text>
        <Button onClick={handleNewDept} colorScheme='green' ml={4}>
          <AddIcon mr={2} />
          Yeni Bölüm
        </Button>
      </Flex>

      {loading ? (
        <Spinner size='lg' />
      ) : error ? (
        <Text color='red.500'>{error}</Text>
      ) : departments.length > 0 ? (
        <Table variant='striped'>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Ad</Th>
              <Th>Kod</Th>
              <Th>Açıklama</Th>
              {/* <Th>Durum</Th> */}
              <Th>Oluşturulma Tarihi</Th>
              {/* <Th>Güncellenme Tarihi</Th> */}
              <Th>İşlemler</Th>
            </Tr>
          </Thead>
          <Tbody>
            {departments.map((dept) => (
              <Tr key={dept.DepartmentID}>
                <Td>{dept.DepartmentID}</Td>
                <Td>{dept.Name}</Td>
                <Td>{dept.Code}</Td>
                <Td>{dept.Description || '—'}</Td>
                {/* <Td>{ dept.Status === 1 ? 'Aktif' : 'Pasif'}</Td> */}
                <Td>
                  {dept.DateCreated
                    ? new Date(dept.DateCreated).toLocaleDateString()
                    : '—'}
                </Td>
                {/* <Td>
                  {dept.DateUpdated
                    ? new Date(dept.DateUpdated).toLocaleDateString()
                    : '—'}
                </Td> */}
                <Td>
                  <Button
                    size='sm'
                    colorScheme='blue'
                    ml={2}
                    onClick={() => {
                      setSelectedDept(dept)
                      setNewDept({
                        Name: dept.Name || '',
                        Code: dept.Code || '',
                        Description: dept.Description || '',
                        Status:
                          typeof dept.Status === 'number'
                            ? dept.Status.toString()
                            : '',
                      })
                      onEditOpen()
                    }}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    size='sm'
                    colorScheme='red'
                    onClick={() => handleDeleteDept(dept.DepartmentID)}
                    ml={2}
                  >
                    <DeleteIcon />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text>Herhangi bir bölüm bulunamadı.</Text>
      )}

      {/* Create/Edit Department Modal */}
      <Modal
        isOpen={isOpen || isEditOpen}
        onClose={isEditOpen ? onEditClose : onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedDept ? 'Bölüm Düzenle' : 'Yeni Bölüm Ekle'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isRequired>
              <FormLabel>Ad</FormLabel>
              <Input
                value={newDept.Name}
                onChange={(e) =>
                  setNewDept((prev) => ({ ...prev, Name: e.target.value }))
                }
              />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Kod</FormLabel>
              <Input
                value={newDept.Code}
                onChange={(e) =>
                  setNewDept((prev) => ({ ...prev, Code: e.target.value }))
                }
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Açıklama</FormLabel>
              <Input
                value={newDept.Description}
                onChange={(e) =>
                  setNewDept((prev) => ({
                    ...prev,
                    Description: e.target.value,
                  }))
                }
              />
            </FormControl>

            {/* <FormControl mb={3}>
              <FormLabel>Durum</FormLabel>
              <NumberInput
                min={0}
                max={1}
                value={newDept.Status}
                onChange={(val) =>
                  setNewDept((prev) => ({ ...prev, Status: val }))
                }
              >
                <NumberInputField placeholder='0 veya 1 giriniz' />
              </NumberInput>
            </FormControl> */}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme='teal'
              onClick={handleSaveDept}
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

export default Departments
