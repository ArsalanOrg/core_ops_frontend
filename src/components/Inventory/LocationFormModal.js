// components/Inventory/LocationFormModal.js
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
  Input,
  Textarea,
  useToast,
} from '@chakra-ui/react'

export default function LocationFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}) {
  const toast = useToast()
  const [form, setForm] = useState({
    NAME: '',
    DESCRIPTION: '',
    COORDINATES: '',
  })

  useEffect(() => {
    if (isOpen) {
      setForm({
        NAME: initialData?.NAME || '',
        DESCRIPTION: initialData?.DESCRIPTION || '',
        COORDINATES: initialData?.COORDINATES || '',
      })
    }
  }, [initialData, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    if (!form.NAME.trim()) {
      toast({
        title: 'Hata',
        description: 'Lokasyon adı boş olamaz.',
        status: 'error',
        duration: 3000,
      })
      return
    }
    onSave({
      NAME: form.NAME,
      DESCRIPTION: form.DESCRIPTION,
      COORDINATES: form.COORDINATES,
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {initialData ? 'Lokasyonu Düzenle' : 'Yeni Lokasyon'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3} isRequired>
            <FormLabel>Ad</FormLabel>
            <Input
              name='NAME'
              value={form.NAME}
              onChange={handleChange}
              placeholder='Lokasyon adı'
            />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Açıklama</FormLabel>
            <Textarea
              name='DESCRIPTION'
              value={form.DESCRIPTION}
              onChange={handleChange}
              placeholder='Lokasyon açıklaması'
            />
          </FormControl>
          <FormControl>
            <FormLabel>Koordinatlar</FormLabel>
            <Input
              name='COORDINATES'
              value={form.COORDINATES}
              onChange={handleChange}
              placeholder='Lat,Lng'
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            İptal
          </Button>
          <Button colorScheme='green' onClick={handleSave}>
            {initialData ? 'Güncelle' : 'Ekle'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
