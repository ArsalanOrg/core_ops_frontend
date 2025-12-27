import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Input,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  HStack,
  useToast,
} from '@chakra-ui/react'
import * as APIs from 'utils/APIs/APICenter.js'
import { FormatDate } from 'utils/Functions/UtilFunctions'
import { useGlobalState } from 'utils/GlobalState.ts'

const ACTION_LABELS = {
  EKLEME: 'Ekleme',
  GUNCELLEME: 'Güncelleme',
  SILME: 'Silme',
  DEPO_CIKISI: 'Depo Çıkışı',
}

const InventoryLogs = () => {
  const toast = useToast()
  const { setTitle, setShowHint } = useGlobalState()

  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // filter state
  const [actionFilter, setActionFilter] = useState('')
  const [inventoryNameFilter, setInventoryNameFilter] = useState('')
  const [userNameFilter, setUserNameFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const data = await APIs.GetAllLogs({
        action: actionFilter,
        inventoryName: inventoryNameFilter,
        userName: userNameFilter,
        dateFrom,
        dateTo,
      })
      setLogs(data)
      console.log(data);
      
    } catch (err) {
      console.error(err)
      setError('Envanter logları yüklenemedi.')
      toast({
        title: 'Hata',
        description: err.message || 'Bilinmeyen hata.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setActionFilter('')
    setInventoryNameFilter('')
    setUserNameFilter('')
    setDateFrom('')
    setDateTo('')
    fetchLogs()
  }

  useEffect(() => {
    setTitle('Lojistik Hareketi')
    setShowHint(false)
    fetchLogs()
  }, [])

  return (
    <Box p={5}>
      {/* Filter bar */}
      <HStack spacing={2} mb={4} flexWrap='wrap'>
        <Input
          placeholder='Ürün adı ara'
          value={inventoryNameFilter}
          onChange={(e) => setInventoryNameFilter(e.target.value)}
          maxW='200px'
        />
        <Input
          placeholder='Teslim eden ara'
          value={userNameFilter}
          onChange={(e) => setUserNameFilter(e.target.value)}
          maxW='200px'
        />
        <Select
          placeholder='İşlem tipi'
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          maxW='180px'
        >
          {Object.entries(ACTION_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
        <Input
          type='date'
          placeholder='Başlangıç tarihi'
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          maxW='150px'
        />
        <Input
          type='date'
          placeholder='Bitiş tarihi'
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          maxW='150px'
        />
        <Button colorScheme='teal' onClick={fetchLogs}>
          Filtrele
        </Button>
        <Button variant='outline' onClick={clearFilters}>
          Temizle
        </Button>
      </HStack>

      {/* Table */}
      {loading ? (
        <Spinner size='lg' />
      ) : error ? (
        <Text color='red.500'>{error}</Text>
      ) : logs?.length > 0 ? (
        <Table variant='striped' size='sm'>
          <Thead>
            <Tr>
              <Th>LOG NO</Th>
              <Th>Ürün ADI</Th>
              <Th>Tarih</Th>
              <Th>İşlem TİPİ</Th>
              <Th>Önceki Miktar</Th>
              <Th>Güncel Miktar</Th>
              <Th>Değişem</Th>
              <Th>Teslim Eden</Th>
              <Th>Açıklama</Th>
            </Tr>
          </Thead>
          <Tbody>
            {logs.map((log) => (
              <Tr key={log.ID}>
                <Td>{log.ID}</Td>
                <Td>{log.INVENTORY_NAME}</Td>
                <Td>{FormatDate(log.CREATED_AT)}</Td>
                <Td>{ACTION_LABELS[log.ACTION]}</Td>
                <Td>{log.PREVIOUS_QUANTITY || '-'}</Td>
                <Td>{log.NEW_QUANTITY}</Td>
                <Td>{log.QUANTITY_CHANGED || '-'}</Td>
                <Td>{log.USER_NAME}</Td>
                <Td>{log.DETAILS}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text>Log boş</Text>
      )}
    </Box>
  )
}

export default InventoryLogs
