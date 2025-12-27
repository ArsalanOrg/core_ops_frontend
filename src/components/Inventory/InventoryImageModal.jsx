import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Image,
  Button,
} from '@chakra-ui/react'

const InventoryImageModal = ({
  isOpen,
  onClose,
  imageSrc,
  title = 'Öğe Fotoğrafı',
  alt = 'Full View',
}) => (
  <Modal isOpen={isOpen} onClose={onClose} size='lg'>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{title}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {imageSrc && (
          <Image src={imageSrc} alt={alt} width='100%' borderRadius='md' />
        )}
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} colorScheme='teal'>
          Kapat
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
)

export default InventoryImageModal
