import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
import { useNavigate } from 'react-router-dom'
import * as APIs from 'utils/APIs/APICenter.js'
import { FormatDate } from 'utils/Functions/UtilFunctions.js'
import { useGlobalState } from 'utils/GlobalState.ts'
import LanguageLocalizer from 'utils/LanguageLocalizer.js'

function ProjectList() {
  const [projectList, setProjectList] = useState(null)
  const { setTitle, setShowHint } = useGlobalState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const navigate = useNavigate()
  const [startDate, setStartDate] = useState('')
  const [finishDate, setFinishDate] = useState('')
  const [projectName, setProjectName] = useState('')
  const [projectID, setProjectID] = useState(null)

  const isDataValid = () => {
    if (startDate === null || startDate === '') return 0
    if (finishDate === null || finishDate === '') return 0
    if (projectName === null || projectName === '') return 0
    return 1
  }

  const clearData = () => {
    setStartDate('')
    setFinishDate('')
    setProjectName('')
    setProjectID(null)
  }

  const createProject = async () => {
    try {
      if (!isDataValid()) throw new Error(LanguageLocalizer['missing_data'])
      var response
      if (projectID !== null) {
        // EDIT
        response = await APIs.UpdateProject({
          id: projectID,
          name: projectName,
          startDate: startDate,
          finishDate: finishDate,
        })
      } else {
        // CREATE
        response = await APIs.CreateProject({
          startDate: startDate,
          finishDate: finishDate,
          projectName: projectName,
        })
      }

      if (response.fail) throw new Error(response.message)

      toast({
        title: 'Success',
        description: projectID
          ? LanguageLocalizer['project_updated']
          : LanguageLocalizer['project_created'],
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      clearData()
      onClose()
      getProjectList()
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const getProjectList = async () => {
    try {
      const projects = await APIs.GetProjects()
      // for each project, fetch the manager’s name
      const enriched = await Promise.all(
        projects.map(async (project) => {
          const managerName = await APIs.GetUser(project.MANAGERID)
          return { ...project, MANAGERNAME: managerName.FullName }
        })
      )
      setProjectList(enriched)
    } catch (err) {
      toast({
        title: 'Error loading projects',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    setTitle(LanguageLocalizer['project_list'])
    setShowHint(false)
    if (projectList === null) getProjectList()
  }, [projectList, projectID])

  const deleteProject = async (id) => {
    try {
      const response = await APIs.DeleteProject(id)
      if (response.fail) throw new Error(response.message)
      toast({
        title: 'Success',
        description: LanguageLocalizer['project_deleted'],
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      getProjectList()
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const editProject = async (project) => {
    setStartDate(FormatDate(project.START_DATE, false, true))
    setFinishDate(FormatDate(project.FINISH_DATE, false, true))
    setProjectName(project.NAME.trim())
    setProjectID(project.PROJECTID)
    onOpen()
  }

  const renderButton = (button, project) => {
    switch (button) {
      case 'show':
        return (
          <IconButton
            colorScheme='green'
            aria-label='Show'
            icon={<ViewIcon />}
            onClick={() => navigate(`/tasks/${project.PROJECTID}`)} // Navigate to TaskList page
          />
        )
      case 'delete':
        return (
          <IconButton
            colorScheme='red'
            onClick={() => deleteProject(project.PROJECTID)}
            aria-label='Delete'
            icon={<DeleteIcon />}
          />
        )
      case 'edit':
        return (
          <IconButton
            colorScheme='yellow'
            onClick={() => editProject(project)}
            aria-label='Edit'
            icon={<EditIcon />}
          />
        )
      default:
        return <></>
    }
  }

  return (
    <>
      {['head', 'admin'].includes(localStorage.getItem('role')) && (
        <Flex justify='flex-end'>
          <Button onClick={onOpen} colorScheme='blue' m='1em'>
            <AddIcon mr={4} />
            {LanguageLocalizer['create_project']}
          </Button>
        </Flex>
      )}

      <Table variant='striped'>
        <Thead>
          <Tr>
            <Th>{LanguageLocalizer['ID']}</Th>
            <Th>{LanguageLocalizer['project_name']}</Th>
            <Th>{LanguageLocalizer['project_manager']}</Th>
            <Th>{LanguageLocalizer['project_start_date']}</Th>
            <Th>{LanguageLocalizer['project_finish_date']}</Th>
            <Th>{LanguageLocalizer['project_tasks']}</Th>
            {['head', 'admin'].includes(localStorage.getItem('role')) && (
              <Th>{LanguageLocalizer['edit']}</Th>
            )}
            {['head', 'admin'].includes(localStorage.getItem('role')) && (
              <Th>{LanguageLocalizer['delete']}</Th>
            )}
          </Tr>
        </Thead>
        <Tbody>
          {projectList &&
            projectList.map((project) => (
              <Tr key={project.PROJECTID}>
                <Td>{project.PROJECTID}</Td>
                <Td
                  onClick={() => navigate(`/projectInfo/${project.PROJECTID}`)}
                  cursor='pointer'
                  _hover={{ textDecoration: 'underline', color: 'blue' }}
                >
                  {project.NAME}
                </Td>
                <Td>{project.MANAGERNAME}</Td>
                <Td>{FormatDate(project.START_DATE, false)}</Td>
                <Td>{FormatDate(project.FINISH_DATE, false)}</Td>
                <Td>{renderButton('show', project)}</Td>
                {['head', 'admin'].includes(localStorage.getItem('role')) && (
                  <Td>{renderButton('edit', project)}</Td>
                )}
                {['head', 'admin'].includes(localStorage.getItem('role')) && (
                  <Td>{renderButton('delete', project)}</Td>
                )}
              </Tr>
            ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {projectID
              ? LanguageLocalizer['edit_project']
              : LanguageLocalizer['create_project']}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>{LanguageLocalizer['project_name']}</FormLabel>
                <Input
                  type='text'
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>{LanguageLocalizer['project_start_date']}</FormLabel>
                <Input
                  type='date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>
                  {LanguageLocalizer['project_finish_date']}
                </FormLabel>
                <Input
                  type='date'
                  value={finishDate}
                  onChange={(e) => {
                    setFinishDate(e.target.value)
                  }}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
              {LanguageLocalizer['cancel']}
            </Button>
            <Button colorScheme='blue' onClick={createProject}>
              {projectID
                ? LanguageLocalizer['edit_project']
                : LanguageLocalizer['create_project']}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProjectList
