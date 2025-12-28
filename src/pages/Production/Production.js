// pages/Production/Production.js
import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Input,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  Select,
  HStack,
} from '@chakra-ui/react'
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { useGlobalState } from 'utils/GlobalState.ts'

// IMPORTANT: adjust the import path to match your project
import * as APIs from 'utils/APIs/production/production'

// You will create these modals similar to Inventory modals
import MachineFormModal from '../../components/Production/MachineFormModal'
import MaterialFormModal from '../../components/Production/MaterialFormModal'
import ProductionRecordModal from '../../components/Production/ProductionRecordModal'
import ProductionAuthUserModal from '../../components/Production/ProductionAuthUserModal'

const ProductionDashboard = () => {
  const toast = useToast()
  const { setTitle, setShowHint } = useGlobalState()

  // data
  const [machines, setMachines] = useState([])
  const [materials, setMaterials] = useState([])
  const [records, setRecords] = useState([])
  const [authUsers, setAuthUsers] = useState([])

  // analytics
  const [dailyTotals, setDailyTotals] = useState([])
  const [topMachines, setTopMachines] = useState([])
  const [materialTotals, setMaterialTotals] = useState([])

  // ui state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasAuth, setHasAuth] = useState(false)

  // filters
  const [filterMachineId, setFilterMachineId] = useState('')
  const [filterMaterialId, setFilterMaterialId] = useState('')
  const [filterShift, setFilterShift] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // edit state
  const [editMachine, setEditMachine] = useState(null)
  const [editMaterial, setEditMaterial] = useState(null)
  const [editRecord, setEditRecord] = useState(null)
  const [editAuth, setEditAuth] = useState(null)

  // modals
  const { isOpen: openMachine, onOpen: openMachineM, onClose: closeMachineM } = useDisclosure()
  const { isOpen: openMaterial, onOpen: openMaterialM, onClose: closeMaterialM } = useDisclosure()
  const { isOpen: openRecord, onOpen: openRecordM, onClose: closeRecordM } = useDisclosure()
  const { isOpen: openAuth, onOpen: openAuthM, onClose: closeAuthM } = useDisclosure()

  const handleError = (err) => {
    toast({
      title: 'Hata',
      description: err?.message || String(err),
      status: 'error',
      duration: 3000,
    })
  }

  const fetchAuth = async () => {
    try {
      const can = await APIs.CheckProductionAuth()
      setHasAuth(!!can)
    } catch (err) {
      toast({
        title: 'Yetki alınamadı',
        description: err?.message || String(err),
        status: 'warning',
        duration: 3000,
      })
      setHasAuth(false)
    }
  }

  const fetchBasics = async () => {
    setLoading(true)
    try {
      const [m, mat, auth] = await Promise.all([
        APIs.GetAllMachines(),
        APIs.GetAllMaterials(),
        APIs.GetAllProductionAuthorizedUsers(),
      ])
      setMachines(m)
      setMaterials(mat)
      setAuthUsers(auth)
      setError('')
    } catch (err) {
      setError('Yükleme hatası')
    } finally {
      setLoading(false)
    }
  }

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const filters = {}
      if (filterMachineId) filters.machineId = filterMachineId
      if (filterMaterialId) filters.materialId = filterMaterialId
      if (filterShift) filters.shift = filterShift
      if (dateFrom) filters.dateFrom = dateFrom
      if (dateTo) filters.dateTo = dateTo

      const r = await APIs.GetProductionRecords(filters)
      setRecords(r)
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const filters = {}
      if (filterMachineId) filters.machineId = filterMachineId
      if (filterMaterialId) filters.materialId = filterMaterialId
      if (dateFrom) filters.dateFrom = dateFrom
      if (dateTo) filters.dateTo = dateTo

      const [d, top, mt] = await Promise.all([
        APIs.GetDailyTotals(filters),
        APIs.GetTopMachines({ ...filters, limit: 10 }),
        APIs.GetMaterialTotals(filters),
      ])

      setDailyTotals(d)
      setTopMachines(top)
      setMaterialTotals(mt)
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setTitle('Production')
    setShowHint(false)
    fetchBasics()
    fetchAuth()
    fetchRecords()
  }, [])

  // Re-fetch records when filters change (optional behavior)
  // If you prefer a manual "Search" button, remove this.
  // useEffect(() => { fetchRecords() }, [filterMachineId, filterMaterialId, filterShift, dateFrom, dateTo])

  const onSaveMachine = async (data) => {
    try {
      const res = editMachine
        ? await APIs.UpdateMachine(data, editMachine.ID)
        : await APIs.CreateMachine(data)

      if (res.fail) throw new Error(res.response?.data?.message)
      toast({ title: editMachine ? 'Güncellendi' : 'Eklendi', status: 'success', duration: 3000 })
      closeMachineM()
      setEditMachine(null)
      fetchBasics()
    } catch (err) {
      handleError(err)
    }
  }

  const onDeleteMachine = async (id) => {
    try {
      const res = await APIs.DeleteMachine(id)
      if (res.fail) throw new Error(res.response?.data?.message)
      toast({ title: 'Silindi', status: 'success', duration: 3000 })
      fetchBasics()
    } catch (err) {
      handleError(err)
    }
  }

  const onSaveMaterial = async (data) => {
    try {
      const res = editMaterial
        ? await APIs.UpdateMaterial(data, editMaterial.ID)
        : await APIs.CreateMaterial(data)

      if (res.fail) throw new Error(res.response?.data?.message)
      toast({ title: editMaterial ? 'Güncellendi' : 'Eklendi', status: 'success', duration: 3000 })
      closeMaterialM()
      setEditMaterial(null)
      fetchBasics()
    } catch (err) {
      handleError(err)
    }
  }

  const onDeleteMaterial = async (id) => {
    try {
      const res = await APIs.DeleteMaterial(id)
      if (res.fail) throw new Error(res.response?.data?.message)
      toast({ title: 'Silindi', status: 'success', duration: 3000 })
      fetchBasics()
    } catch (err) {
      handleError(err)
    }
  }

  // Upsert record (create or update same row)
  const onSaveRecord = async (data) => {
    try {
      const payload = {
        MACHINE_ID: data.MACHINE_ID,
        MATERIAL_ID: data.MATERIAL_ID,
        PROD_DATE: data.PROD_DATE, // YYYY-MM-DD
        SHIFT: data.SHIFT, // A/B/C
        QUANTITY: data.QUANTITY,
        NOTES: data.NOTES,
      }

      const res = await APIs.UpsertProductionRecord(payload)
      if (res.fail) throw new Error(res.response?.data?.message)

      toast({ title: editRecord ? 'Güncellendi' : 'Kaydedildi', status: 'success', duration: 3000 })
      closeRecordM()
      setEditRecord(null)
      fetchRecords()
      // analytics can also refresh if you want
      // fetchAnalytics()
    } catch (err) {
      handleError(err)
    }
  }

  const onDeleteRecord = async (id) => {
    try {
      const res = await APIs.DeleteProductionRecord(id)
      if (res.fail) throw new Error(res.response?.data?.message)
      toast({ title: 'Silindi', status: 'success', duration: 3000 })
      fetchRecords()
    } catch (err) {
      handleError(err)
    }
  }

  const onSaveAuth = async (data) => {
    try {
      // expected shape: { userIds: [1,2,3] }
      const res = await APIs.AddProductionAuthorizedUser(data)
      // res.response might be {success, data,...} depending on your APICenter
      toast({ title: 'Yetkili Kullanıcı Eklendi', status: 'success', duration: 3000 })
      closeAuthM()
      setEditAuth(null)
      fetchBasics()
      fetchAuth()
    } catch (err) {
      handleError(err)
    }
  }

  const onDeleteAuth = async (userId) => {
    try {
      await APIs.RemoveProductionAuthorizedUser(userId)
      toast({ title: 'Yetkili Kullanıcı Kaldırıldı', status: 'success', duration: 3000 })
      fetchBasics()
      fetchAuth()
    } catch (err) {
      handleError(err)
    }
  }

  const recordRows = useMemo(() => records || [], [records])

  if (loading) return <Spinner size='lg' />
  if (error) return <Text color='red.500'>{error}</Text>

  return (
    <Box p={5}>
      <Tabs variant='enclosed'>
        <TabList mb='1em' justifyContent='center'>
          <Tab>Üretim Kayıtları</Tab>
          <Tab>Makineler</Tab>
          <Tab>Malzemeler</Tab>
          <Tab>Analitik</Tab>
          <Tab>Yetkili Listesi</Tab>
        </TabList>

        <TabPanels>
          {/* Production Records */}
          <TabPanel>
            <Box mb={4}>
              <HStack spacing={2} flexWrap='wrap'>
                <Select
                  placeholder='Makine'
                  value={filterMachineId}
                  onChange={(e) => setFilterMachineId(e.target.value)}
                  maxW='240px'
                >
                  {machines.map((m) => (
                    <option key={m.ID} value={m.ID}>
                      {m.NAME}
                    </option>
                  ))}
                </Select>

                <Select
                  placeholder='Malzeme'
                  value={filterMaterialId}
                  onChange={(e) => setFilterMaterialId(e.target.value)}
                  maxW='240px'
                >
                  {materials.map((m) => (
                    <option key={m.ID} value={m.ID}>
                      {m.NAME}
                    </option>
                  ))}
                </Select>

                <Select
                  placeholder='Vardiya'
                  value={filterShift}
                  onChange={(e) => setFilterShift(e.target.value)}
                  maxW='160px'
                >
                  <option value='A'>A</option>
                  <option value='B'>B</option>
                  <option value='C'>C</option>
                </Select>

                <Input
                  type='date'
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  maxW='190px'
                />
                <Input
                  type='date'
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  maxW='190px'
                />

                <Button colorScheme='teal' onClick={fetchRecords}>
                  Ara
                </Button>

                <Button variant='outline' onClick={() => {
                  setFilterMachineId('')
                  setFilterMaterialId('')
                  setFilterShift('')
                  setDateFrom('')
                  setDateTo('')
                }}>
                  Temizle
                </Button>

                {hasAuth && (
                  <Button
                    leftIcon={<AddIcon />}
                    colorScheme='green'
                    onClick={() => {
                      setEditRecord(null)
                      openRecordM()
                    }}
                  >
                    Kayıt Ekle
                  </Button>
                )}
              </HStack>
            </Box>

            <Table variant='striped'>
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Tarih</Th>
                  <Th>Vardiya</Th>
                  <Th>Makine</Th>
                  <Th>Malzeme</Th>
                  <Th isNumeric>Miktar</Th>
                  <Th>Not</Th>
                  {hasAuth && <Th>İşlemler</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {recordRows.map((r) => (
                  <Tr key={r.ID}>
                    <Td>{r.ID}</Td>
                    <Td>{r.PROD_DATE}</Td>
                    <Td>{r.SHIFT}</Td>
                    <Td>{r.machine?.NAME}</Td>
                    <Td>
                      {r.material?.NAME}
                      {r.material?.UNIT ? ` (${r.material.UNIT})` : ''}
                    </Td>
                    <Td isNumeric>{r.QUANTITY}</Td>
                    <Td maxW='260px' whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
                      {r.NOTES}
                    </Td>
                    {hasAuth && (
                      <Td>
                        <Button
                          size='sm'
                          mr={2}
                          onClick={() => {
                            setEditRecord({
                              ...r,
                              MACHINE_ID: r.MACHINE_ID,
                              MATERIAL_ID: r.MATERIAL_ID,
                            })
                            openRecordM()
                          }}
                        >
                          <EditIcon />
                        </Button>
                        <Button size='sm' colorScheme='red' onClick={() => onDeleteRecord(r.ID)}>
                          <DeleteIcon />
                        </Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <ProductionRecordModal
              isOpen={openRecord}
              onClose={() => {
                closeRecordM()
                setEditRecord(null)
              }}
              onSave={onSaveRecord}
              initialData={editRecord}
              machines={machines}
              materials={materials}
            />
          </TabPanel>

          {/* Machines */}
          <TabPanel>
            <Box mb={4} display='flex'>
              {hasAuth && (
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme='green'
                  onClick={() => {
                    setEditMachine(null)
                    openMachineM()
                  }}
                >
                  Makine Ekle
                </Button>
              )}
            </Box>

            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Ad</Th>
                  <Th>Kod</Th>
                  <Th>Seri No</Th>
                  <Th>Durum</Th>
                  {hasAuth && <Th>İşlemler</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {machines.map((m) => (
                  <Tr key={m.ID}>
                    <Td>{m.ID}</Td>
                    <Td>{m.NAME}</Td>
                    <Td>{m.MACHINE_CODE}</Td>
                    <Td>{m.SERIAL_NO}</Td>
                    <Td>{m.STATUS === 1 ? 'Aktif' : 'Pasif'}</Td>
                    {hasAuth && (
                      <Td>
                        <Button
                          size='sm'
                          mr={2}
                          onClick={() => {
                            setEditMachine(m)
                            openMachineM()
                          }}
                        >
                          <EditIcon />
                        </Button>
                        <Button size='sm' colorScheme='red' onClick={() => onDeleteMachine(m.ID)}>
                          <DeleteIcon />
                        </Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <MachineFormModal
              isOpen={openMachine}
              onClose={() => {
                closeMachineM()
                setEditMachine(null)
              }}
              onSave={onSaveMachine}
              initialData={editMachine}
            />
          </TabPanel>

          {/* Materials */}
          <TabPanel>
            <Box mb={4} display='flex'>
              {hasAuth && (
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme='green'
                  onClick={() => {
                    setEditMaterial(null)
                    openMaterialM()
                  }}
                >
                  Malzeme Ekle
                </Button>
              )}
            </Box>

            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Ad</Th>
                  <Th>Birim</Th>
                  <Th>Açıklama</Th>
                  {hasAuth && <Th>İşlemler</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {materials.map((m) => (
                  <Tr key={m.ID}>
                    <Td>{m.ID}</Td>
                    <Td>{m.NAME}</Td>
                    <Td>{m.UNIT}</Td>
                    <Td maxW='320px' whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
                      {m.DESCRIPTION}
                    </Td>
                    {hasAuth && (
                      <Td>
                        <Button
                          size='sm'
                          mr={2}
                          onClick={() => {
                            setEditMaterial(m)
                            openMaterialM()
                          }}
                        >
                          <EditIcon />
                        </Button>
                        <Button size='sm' colorScheme='red' onClick={() => onDeleteMaterial(m.ID)}>
                          <DeleteIcon />
                        </Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <MaterialFormModal
              isOpen={openMaterial}
              onClose={() => {
                closeMaterialM()
                setEditMaterial(null)
              }}
              onSave={onSaveMaterial}
              initialData={editMaterial}
            />
          </TabPanel>

          {/* Analytics */}
          <TabPanel>
            <Box mb={4}>
              <HStack spacing={2} flexWrap='wrap'>
                <Select
                  placeholder='Makine'
                  value={filterMachineId}
                  onChange={(e) => setFilterMachineId(e.target.value)}
                  maxW='240px'
                >
                  {machines.map((m) => (
                    <option key={m.ID} value={m.ID}>
                      {m.NAME}
                    </option>
                  ))}
                </Select>

                <Select
                  placeholder='Malzeme'
                  value={filterMaterialId}
                  onChange={(e) => setFilterMaterialId(e.target.value)}
                  maxW='240px'
                >
                  {materials.map((m) => (
                    <option key={m.ID} value={m.ID}>
                      {m.NAME}
                    </option>
                  ))}
                </Select>

                <Input type='date' value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} maxW='190px' />
                <Input type='date' value={dateTo} onChange={(e) => setDateTo(e.target.value)} maxW='190px' />

                <Button colorScheme='blue' onClick={fetchAnalytics}>
                  Analitiği Getir
                </Button>
              </HStack>
            </Box>

            <Text fontWeight='bold' mb={2}>Günlük Toplam Üretim</Text>
            <Table variant='simple' mb={6}>
              <Thead>
                <Tr>
                  <Th>Tarih</Th>
                  <Th isNumeric>Toplam</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dailyTotals.map((d, idx) => (
                  <Tr key={idx}>
                    <Td>{d.PROD_DATE}</Td>
                    <Td isNumeric>{d.TOTAL_QUANTITY}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <Text fontWeight='bold' mb={2}>En Çok Üreten Makineler</Text>
            <Table variant='simple' mb={6}>
              <Thead>
                <Tr>
                  <Th>Makine</Th>
                  <Th isNumeric>Toplam</Th>
                </Tr>
              </Thead>
              <Tbody>
                {topMachines.map((x, idx) => (
                  <Tr key={idx}>
                    <Td>{x.machine?.NAME}</Td>
                    <Td isNumeric>{x.TOTAL_QUANTITY}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <Text fontWeight='bold' mb={2}>Malzeme Bazlı Toplam</Text>
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th>Malzeme</Th>
                  <Th>Birim</Th>
                  <Th isNumeric>Toplam</Th>
                </Tr>
              </Thead>
              <Tbody>
                {materialTotals.map((x, idx) => (
                  <Tr key={idx}>
                    <Td>{x.material?.NAME}</Td>
                    <Td>{x.material?.UNIT}</Td>
                    <Td isNumeric>{x.TOTAL_QUANTITY}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TabPanel>

          {/* Auth Users */}
          <TabPanel>
            <Box mb={4} display='flex'>
              {hasAuth && (
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme='green'
                  onClick={() => {
                    setEditAuth(null)
                    openAuthM()
                  }}
                >
                  Yetkili Kullanıcı Ekle
                </Button>
              )}
            </Box>

            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th>Kullanıcı No</Th>
                  <Th>Kullanıcı Adı</Th>
                  {hasAuth && <Th>İşlemler</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {authUsers.map((u) => (
                  <Tr key={u.USER_ID}>
                    <Td>{u.USER_ID}</Td>
                    <Td>{u.FullName}</Td>
                    {hasAuth && (
                      <Td>
                        <Button size='sm' colorScheme='red' onClick={() => onDeleteAuth(u.USER_ID)}>
                          <DeleteIcon />
                        </Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <ProductionAuthUserModal
              isOpen={openAuth}
              onClose={() => {
                closeAuthM()
                setEditAuth(null)
              }}
              onSave={onSaveAuth}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default ProductionDashboard
