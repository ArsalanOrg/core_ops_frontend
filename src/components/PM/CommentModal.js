import { CheckIcon, CloseIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import * as APIs from 'utils/APIs/APICenter.js'
import { FormatDate } from 'utils/Functions/UtilFunctions'
import LanguageLocalizer from 'utils/LanguageLocalizer.js'

const CommentModal = ({ isOpen, onClose, taskId, taskName, updateKanban }) => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editedComment, setEditedComment] = useState('')
  const toast = useToast()

  useEffect(() => {
    if (isOpen && taskId) fetchComments()
  }, [isOpen, taskId])

  const fetchComments = async () => {
    try {
      const response = await APIs.GetComments(taskId)
      if (response) {
        setComments(response) // Reverse the comments to show recent ones first
        console.log(response)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
      toast({
        title: 'Failed to fetch comments.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      const response = await APIs.AddComment({ taskId, comment: newComment })
      if (response) {
        setNewComment('')
        fetchComments() // Refresh the comments after adding a new one
        updateKanban()
        toast({
          title: LanguageLocalizer['comment_added'],
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error) {
      toast({
        title: 'Failed to add comment.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleEditComment = (commentId, currentComment) => {
    setEditingCommentId(commentId)
    setEditedComment(currentComment)
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditedComment('')
  }

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await APIs.DeleteComment(commentId)
      if (response) {
        fetchComments() // Refresh the comments after deleting
        updateKanban()
        toast({
          title: LanguageLocalizer['comment_deleted'],
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error) {
      toast({
        title: 'Failed to delete comment.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }
  const handleSaveEdit = async () => {
    if (!editedComment.trim()) return

    try {
      const response = await APIs.UpdateComment({
        editCommentId: editingCommentId,
        newComment: editedComment,
        taskId,
      })
      if (response) {
        setEditingCommentId(null)
        setEditedComment('')
        fetchComments() // Refresh the comments after editing
        toast({
          title: LanguageLocalizer['comment_updated'],
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error) {
      toast({
        title: 'Failed to update comment.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Yorumlar: {taskName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align='stretch' spacing={4}>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={LanguageLocalizer['comment_placeholder']}
              resize='none'
            />
            <Button colorScheme='blue' onClick={handleAddComment}>
              {LanguageLocalizer['add_comment']}
            </Button>
          </VStack>

          {/* Comments Display Section */}
          <VStack align='stretch' spacing={4} mt={6} mb={6}>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Box
                  key={comment.COMMENTID}
                  p={4}
                  borderWidth='1px'
                  borderRadius='md'
                  boxShadow='md'
                >
                  <HStack justifyContent='space-between'>
                    <HStack>
                      {/* <Avatar name={comment.authorName} size="sm" /> */}
                      <Text fontWeight='bold'>{comment.UserName}</Text>
                    </HStack>
                    {editingCommentId === comment.COMMENTID ? (
                      <HStack>
                        <IconButton
                          icon={<CheckIcon />}
                          size='sm'
                          onClick={handleSaveEdit}
                          colorScheme='green'
                        />
                        <IconButton
                          icon={<CloseIcon />}
                          size='sm'
                          onClick={handleCancelEdit}
                          colorScheme='red'
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          size='sm'
                          onClick={() => handleDeleteComment(comment.COMMENTID)}
                          colorScheme='red'
                        />
                      </HStack>
                    ) : (
                      <IconButton
                        icon={<EditIcon />}
                        size='sm'
                        onClick={() =>
                          handleEditComment(comment.COMMENTID, comment.COMMENT)
                        }
                      />
                    )}
                  </HStack>
                  {editingCommentId === comment.COMMENTID ? (
                    <Textarea
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                      mt={2}
                    />
                  ) : (
                    <Text mt={2}>{comment.COMMENT}</Text>
                  )}
                  <Text fontSize='sm' color='gray.500' mt={2}>
                    {/* {new Date(comment.DATE).toLocaleString()} */}
                    {`${new Date(comment.DATE).toLocaleString('tr-TR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })} ${new Date(comment.DATE).toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}`}
                  </Text>
                </Box>
              ))
            ) : (
              <Text>{LanguageLocalizer['no_comment']}</Text>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default CommentModal
