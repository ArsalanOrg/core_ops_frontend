import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as APIs from 'utils/APIs/APICenter.js'
import { useGlobalState } from 'utils/GlobalState.ts'

const UpdatePassword = () => {
  const { setTitle, setShowHint } = useGlobalState()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    setTitle('Şifre Güncelleme')
    setShowHint(false)
  }, [setTitle, setShowHint])

  const handleSubmit = async (e) => {
    var role = localStorage.getItem('role')
    var departmentHeadID = localStorage.getItem('departmentHeadID')
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: ' Şifreler eşleşmiyor.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const res = await APIs.UpdatePassword({
      oldPassword: oldPassword,
      password: newPassword,
    })

    if (res.fail === false) {
      navigate('/projectList')
      toast({
        title: 'Success',
        description: 'Şifre başarılı bir şekilde değiştirildi.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } else {
      toast({
        title: 'Error',
        description:
          res.response.response.data.error || 'Failed to update password.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Box maxW='md' mx='auto' mt='8' p='6' boxShadow='lg' borderRadius='lg'>
      <Heading as='h2' size='lg' mb='6' textAlign='center'>
        Şifre Değiştir
      </Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing='4'>
          <FormControl isRequired>
            <FormLabel> Eski Şifre </FormLabel>
            <Input
              type='password'
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder=' Eski şifreyi girin'
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Yeni Şifre</FormLabel>
            <Input
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder=' Yeni şifreyi girin'
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel> Tekrar Şifre </FormLabel>
            <Input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder=' Şifreyi tekrarla'
            />
          </FormControl>

          <Button colorScheme='blue' type='submit' width='full'>
            Güncelle
          </Button>
        </Stack>
      </form>
    </Box>
  )
}

export default UpdatePassword
