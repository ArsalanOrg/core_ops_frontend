// components/Inventory/StockOutModal.jsx
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
  Textarea,
  Button,
  HStack,
  IconButton,
} from '@chakra-ui/react'
import { AddIcon, MinusIcon } from '@chakra-ui/icons'

export default function StockOutModal({
  isOpen,
  onClose,
  item, // the inventory item being withdrawn
  onConfirm, // (qty, purpose) => Promise
  loading,
}) {
  const [quantity, setQuantity] = useState(1)
  const [purpose, setPurpose] = useState('')

  useEffect(() => {
    if (isOpen) {
      setQuantity(1)
      setPurpose('')
    }
  }, [isOpen, item])

  const inc = () => setQuantity((q) => Math.min(item.QUANTITY_IN_STOCK, q + 1))
  const dec = () => setQuantity((q) => Math.max(1, q - 1))

  const submit = () => onConfirm(quantity, purpose)

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Depo Çıkışı — {item?.ITEM_NAME}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Miktar (stokta: {item?.QUANTITY_IN_STOCK})</FormLabel>
            <HStack>
              <IconButton icon={<MinusIcon />} onClick={dec} />
              <Input
                type='number'
                textAlign='center'
                value={quantity}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10) || 0
                  setQuantity(Math.min(Math.max(1, v), item.QUANTITY_IN_STOCK))
                }}
                min={1}
                max={item?.QUANTITY_IN_STOCK}
                w='80px'
              />
              <IconButton icon={<AddIcon />} onClick={inc} />
            </HStack>
          </FormControl>

          <FormControl>
            <FormLabel>Amacı</FormLabel>
            <Textarea
              placeholder='Lütfen depo çıkışının amacını giriniz...'
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme='red'
            mr={3}
            onClick={submit}
            isLoading={loading}
            isDisabled={!purpose.trim() || quantity < 1}
          >
            Onayla
          </Button>
          <Button variant='ghost' onClick={onClose}>
            İptal
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
