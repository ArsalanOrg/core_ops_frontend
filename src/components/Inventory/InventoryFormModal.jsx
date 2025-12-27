// components/Inventory/InventoryFormModal.jsx
import React, { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  HStack,
  IconButton,
  Button,
  Text,
  Image,
} from '@chakra-ui/react'
import { AddIcon, MinusIcon } from '@chakra-ui/icons'
import imageCompression from 'browser-image-compression'

const defaultItem = {
  ITEM_NAME: '',
  CATEGORY: '',
  LOCATION: '',
  DESCRIPTION: '',
  QUANTITY_IN_STOCK: 0,
  PRODUCT_IMAGE: '',
}

export default function InventoryFormModal({
  isOpen,
  onClose,
  onSave,
  loading,
  initialData = null,
  categories = [],
  locations = [],
}) {
  const [form, setForm] = useState(defaultItem)
  const [catDesc, setCatDesc] = useState('')

  // Reset / populate on open or when initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          ITEM_NAME: initialData.ITEM_NAME || '',
          CATEGORY: initialData.CATEGORY?.toString() || '',
          LOCATION: initialData.LOCATION?.toString() || '',
          DESCRIPTION: initialData.DESCRIPTION || '',
          QUANTITY_IN_STOCK: initialData.QUANTITY_IN_STOCK ?? 0,
          PRODUCT_IMAGE: initialData.PRODUCT_IMAGE || '',
        })
        const c = categories.find((c) => c.ID === initialData.CATEGORY)
        setCatDesc(c?.DESCRIPTION || '')
      } else {
        setForm(defaultItem)
        setCatDesc('')
      }
    }
  }, [isOpen, initialData, categories])

  const handleInput = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }
  const handleCategoryChange = (e) => {
    const id = e.target.value
    setForm((f) => ({ ...f, CATEGORY: id }))
    const c = categories.find((c) => c.ID.toString() === id)
    setCatDesc(c?.DESCRIPTION || '')
  }
  const handleIncrement = () =>
    setForm((f) => ({
      ...f,
      QUANTITY_IN_STOCK: Number(f.QUANTITY_IN_STOCK) + 1,
    }))
  const handleDecrement = () =>
    setForm((f) => ({
      ...f,
      QUANTITY_IN_STOCK: Math.max(0, Number(f.QUANTITY_IN_STOCK) - 1),
    }))
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const opts = { maxSizeMB: 1, useWebWorker: true }
      const compressed = await imageCompression(file, opts)
      const reader = new FileReader()
      reader.onloadend = () => {
        setForm((f) => ({ ...f, PRODUCT_IMAGE: reader.result.toString() }))
      }
      reader.readAsDataURL(compressed)
    } catch (err) {
      console.error(err)
    }
  }
  const submit = () => onSave(form)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {initialData ? 'Envanter Öğesini Düzenle' : 'Envanter Öğesi Oluştur'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3} isRequired>
            <FormLabel>Öğe Adı</FormLabel>
            <Input
              name='ITEM_NAME'
              value={form.ITEM_NAME}
              onChange={handleInput}
            />
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Kategori</FormLabel>
            <Select
              name='CATEGORY'
              value={form.CATEGORY}
              onChange={handleCategoryChange}
            >
              <option value=''>Kategori seç</option>
              {categories.map((cat) => (
                <option key={cat.ID} value={cat.ID.toString()}>
                  {cat.NAME}
                </option>
              ))}
            </Select>
            {catDesc && (
              <Text fontSize='sm' color='gray.500' mt={2}>
                {catDesc}
              </Text>
            )}
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Lokasyon</FormLabel>
            <Select
              name='LOCATION'
              value={form.LOCATION}
              onChange={handleInput}
            >
              <option value=''>Lokasyonu seç</option>
              {locations.map((loc) => (
                <option key={loc.ID} value={loc.ID.toString()}>
                  {loc.NAME}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Açıklama</FormLabel>
            <Input
              name='DESCRIPTION'
              value={form.DESCRIPTION}
              onChange={handleInput}
            />
          </FormControl>

          <FormControl mb={3} isRequired>
            <FormLabel>Miktar</FormLabel>
            <HStack>
              <IconButton
                icon={<MinusIcon />}
                aria-label='Azalt'
                onClick={handleDecrement}
              />
              <Input
                name='QUANTITY_IN_STOCK'
                type='number'
                textAlign='center'
                value={form.QUANTITY_IN_STOCK}
                onChange={handleInput}
                w='80px'
              />
              <IconButton
                icon={<AddIcon />}
                aria-label='Arttır'
                onClick={handleIncrement}
              />
            </HStack>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Ürün Resmi</FormLabel>
            <HStack spacing={4}>
              <Button
                leftIcon={<AddIcon />}
                onClick={() => document.getElementById('camera-input').click()}
              >
                Kameradan
              </Button>
              <Button
                leftIcon={<AddIcon />}
                onClick={() => document.getElementById('gallery-input').click()}
              >
                Galeriden
              </Button>
            </HStack>
            <Input
              id='camera-input'
              type='file'
              accept='image/*'
              capture='environment'
              onChange={handleFileChange}
              display='none'
            />
            <Input
              id='gallery-input'
              type='file'
              accept='image/*'
              onChange={handleFileChange}
              display='none'
            />
            {form.PRODUCT_IMAGE && (
              <Image
                src={form.PRODUCT_IMAGE}
                boxSize='100px'
                objectFit='cover'
                mt={2}
              />
            )}
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='teal' onClick={submit} isLoading={loading}>
            Kaydet
          </Button>
          <Button variant='ghost' onClick={onClose} ml={2}>
            İptal
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
