import React, { useEffect, useState } from 'react'
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
  Image,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
} from '@chakra-ui/react'
import { TiLocation } from 'react-icons/ti'
import { MdOutlineShoppingCartCheckout } from 'react-icons/md'

import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { useGlobalState } from 'utils/GlobalState.ts'

import * as APIs from 'utils/APIs/APICenter.js'
import InventoryFormModal from '../../components/Inventory/InventoryFormModal'
import CategoryFormModal from '../../components/Inventory/CategoryFormModal'
import LocationFormModal from '../../components/Inventory/LocationFormModal'
import StockOutModal from '../../components/Inventory/StockOutModal'
import AuthUserModal from '../../components/Inventory/AuthUserModal'
import InventoryImageModal from '../../components/Inventory/InventoryImageModal'

const Dashboard = () => {
  const toast = useToast()
  const { setTitle, setShowHint } = useGlobalState()

  const [inventory, setInventory] = useState([])
  const [categories, setCategories] = useState([])
  const [locations, setLocations] = useState([])
  const [authUsers, setAuthUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [hasAuth, setHasAuth] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  const {
    isOpen: openInv,
    onOpen: openInvM,
    onClose: closeInvM,
  } = useDisclosure()
  const {
    isOpen: openCat,
    onOpen: openCatM,
    onClose: closeCatM,
  } = useDisclosure()
  const {
    isOpen: openLoc,
    onOpen: openLocM,
    onClose: closeLocM,
  } = useDisclosure()
  const {
    isOpen: openAuth,
    onOpen: openAuthM,
    onClose: closeAuthM,
  } = useDisclosure()
  const {
    isOpen: isStockOpen,
    onOpen: onStockOpen,
    onClose: onStockClose,
  } = useDisclosure()

  const {
    isOpen: isImageOpen,
    onOpen: onImageOpen,
    onClose: onImageClose,
  } = useDisclosure()

  const [stockItem, setStockItem] = useState(null)
  const [stockLoading, setStockLoading] = useState(false)

  const [editInv, setEditInv] = useState(null)
  const [editCat, setEditCat] = useState(null)
  const [editLoc, setEditLoc] = useState(null)
  const [editAuth, setEditAuth] = useState(null)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [inv, cat, loc, auth] = await Promise.all([
        APIs.GetAllInventory(),
        APIs.GetAllCategory(),
        APIs.GetAllLocations(),
        APIs.GetAllAuthorizedUsers(),
      ])
      setInventory(inv)
      setCategories(cat)
      setLocations(loc)
      setAuthUsers(auth)
      setError('')
    } catch (err) {
      setError('Yükleme hatası')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    setTitle('Lojistik')
    setShowHint(false)
    fetchAll()
    fetchAuth()
  }, [])

  const handleError = (err) => {
    toast({
      title: 'Hata',
      description: err.message || String(err),
      status: 'error',
      duration: 3000,
    })
  }
  const fetchAuth = async () => {
    try {
      const can = await APIs.CheckInventoryAuth()
      setHasAuth(can)
    } catch (err) {
      toast({
        title: 'Yetki alınamadı',
        description: err.message || String(err),
        status: 'warning',
        duration: 3000,
      })
    }
  }

  // User clicks the cart icon
  const handleStockClick = (item) => {
    setStockItem(item)
    onStockOpen()
  }

  // When user confirms in the modal
  const confirmStockOut = async (quantity, purpose) => {
    setStockLoading(true)
    try {
      await APIs.StockOut({ quantity, purpose }, stockItem.ID)
      toast({
        title: 'Depo çıkışı yapıldı',
        description: `${quantity} adet '${stockItem.ITEM_NAME}' çıkarıldı.`,
        status: 'success',
        duration: 3000,
      })
      onStockClose()
      setStockItem(null)
      fetchAll()
    } catch (err) {
      handleError(err)
    } finally {
      setStockLoading(false)
    }
  }
  const onSearchInv = async () => {
    setLoading(true)
    try {
      const inv = searchQuery.trim()
        ? await APIs.SearchInventory(searchQuery)
        : await APIs.GetAllInventory()
      setInventory(inv)
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }
  const onSaveInv = async (data) => {
    try {
      const res = editInv
        ? await APIs.UpdateInventory(data, editInv.ID)
        : await APIs.CreateInventory(data)
      if (res.fail) throw new Error(res.response?.data?.message)
      toast({
        title: editInv ? 'Güncellendi' : 'Eklendi',
        status: 'success',
        duration: 3000,
      })
      closeInvM()
      setEditInv(null)
      fetchAll()
    } catch (err) {
      handleError(err)
    }
  }

  const onDeleteInv = async (id) => {
    try {
      const res = await APIs.DeleteInventory(id)
      if (res.fail) throw new Error(res.response?.data?.message)
      toast({ title: 'Silindi', status: 'success', duration: 3000 })
      fetchAll()
    } catch (err) {
      handleError(err)
    }
  }

  const onSaveCat = async (data) => {
    try {
      const res = editCat
        ? await APIs.UpdateCategory(data, editCat.ID)
        : await APIs.CreateCategory(data)
      toast({
        title: editCat ? 'Kategori Güncellendi' : 'Kategori Eklendi',
        status: 'success',
        duration: 3000,
      })
      closeCatM()
      setEditCat(null)
      fetchAll()
    } catch (err) {
      handleError(err)
    }
  }

  const onDeleteCat = async (id) => {
    try {
      await APIs.DeleteCategory(id)
      toast({ title: 'Kategori Silindi', status: 'success', duration: 3000 })
      fetchAll()
    } catch (err) {
      handleError(err)
    }
  }

  const onSaveLoc = async (data) => {
    try {
      const res = editLoc
        ? await APIs.UpdateLocation(data, editLoc.ID)
        : await APIs.CreateLocation(data)
      toast({
        title: editLoc ? 'Lokasyon Güncellendi' : 'Lokasyon Eklendi',
        status: 'success',
        duration: 3000,
      })
      closeLocM()
      setEditLoc(null)
      fetchAll()
    } catch (err) {
      handleError(err)
    }
  }

  const onDeleteLoc = async (id) => {
    try {
      await APIs.DeleteLocation(id)
      toast({ title: 'Lokasyon Silindi', status: 'success', duration: 3000 })
      fetchAll()
    } catch (err) {
      handleError(err)
    }
  }

  const onSaveAuth = async (data) => {
    try {
      await APIs.AddAuthorizedUser(data)
      toast({
        title: 'Yetkili Kullanıcı Eklendi',
        status: 'success',
        duration: 3000,
      })
      closeAuthM()
      setEditAuth(null)
      fetchAll()
    } catch (err) {
      handleError(err)
    }
  }

  const onDeleteAuth = async (userId) => {
    try {
      await APIs.RemoveAuthorizedUser(userId)
      toast({
        title: 'Yetkili Kullanıcı Kaldırıldı',
        status: 'success',
        duration: 3000,
      })
      fetchAll()
    } catch (err) {
      handleError(err)
    }
  }
  if (loading) return <Spinner size='lg' />
  if (error) return <Text color='red.500'>{error}</Text>

  return (
    <Box p={5}>
      <Tabs variant='enclosed'>
        <TabList mb='1em' justifyContent='center'>
          <Tab>Lojistik</Tab>
          <Tab>Kategori</Tab>
          <Tab>Konum</Tab>
          <Tab>Yetkili Listesi</Tab>
        </TabList>

        <TabPanels>
          {/* Inventory */}
          <TabPanel>
            <Box mb={4} display='flex' alignItems='center'>
              <Input
                placeholder='Envanter ara…'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && onSearchInv()}
              />
              <Button ml={2} colorScheme='teal' onClick={onSearchInv}>
                Ara
              </Button>

              {hasAuth && (
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme='green'
                  ml={4}
                  onClick={() => {
                    setEditInv(null)
                    openInvM()
                  }}
                >
                  Ekle
                </Button>
              )}
            </Box>

            <Table variant='striped'>
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Ad</Th>
                  <Th>Kategori</Th>
                  <Th>Stok</Th>
                  <Th>Konum</Th>
                  <Th>Fotoğraf</Th>
                  {hasAuth && <Th>İşlemler</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {inventory.map((i) => (
                  <Tr key={i.ID}>
                    <Td>{i.ID}</Td>
                    <Td>{i.ITEM_NAME}</Td>
                    <Td>{i.category?.NAME}</Td>
                    <Td>{i.QUANTITY_IN_STOCK}</Td>
                    <Td>{i.location?.NAME}</Td>
                    <Td>
                      <Image
                        src={i.PRODUCT_IMAGE}
                        boxSize='50px'
                        objectFit='cover'
                        cursor='pointer'
                        onClick={() => {
                          setSelectedImage(i.PRODUCT_IMAGE)
                          onImageOpen()
                        }}
                      />
                    </Td>
                    {hasAuth && (
                      <Td>
                        <Button
                          size='sm'
                          mr={2}
                          onClick={() => {
                            setEditInv(i)
                            openInvM()
                          }}
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          size='sm'
                          colorScheme='red'
                          onClick={() => onDeleteInv(i.ID)}
                        >
                          <DeleteIcon />
                        </Button>
                        <Button size='sm' onClick={() => handleStockClick(i)}>
                          <MdOutlineShoppingCartCheckout
                            size={23}
                            color='green'
                          />
                        </Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <InventoryFormModal
              isOpen={openInv}
              onClose={closeInvM}
              onSave={onSaveInv}
              loading={loading}
              initialData={editInv}
              categories={categories}
              locations={locations}
            />
            <InventoryImageModal
              isOpen={isImageOpen}
              onClose={onImageClose}
              imageSrc={selectedImage}
            />
            {/* StockOut Modal */}
            {stockItem && (
              <StockOutModal
                isOpen={isStockOpen}
                onClose={() => {
                  onStockClose()
                  setStockItem(null)
                }}
                item={stockItem}
                loading={stockLoading}
                onConfirm={confirmStockOut}
              />
            )}
          </TabPanel>

          {/* Categories */}
          <TabPanel>
            <Box mb={4} display='flex'>
              {hasAuth && (
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme='green'
                  onClick={() => {
                    setEditCat(null)
                    openCatM()
                  }}
                >
                  Kategori Ekle
                </Button>
              )}
            </Box>
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Ad</Th>
                  <Th>Açıklama</Th>
                  {hasAuth && <Th>İşlemler</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {categories.map((c) => (
                  <Tr key={c.ID}>
                    <Td>{c.ID}</Td>
                    <Td>{c.NAME}</Td>
                    <Td>{c.DESCRIPTION}</Td>
                    {hasAuth && (
                      <Td>
                        <Button
                          size='sm'
                          mr={2}
                          onClick={() => {
                            setEditCat(c)
                            openCatM()
                          }}
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          size='sm'
                          colorScheme='red'
                          onClick={() => onDeleteCat(c.ID)}
                        >
                          <DeleteIcon />
                        </Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <CategoryFormModal
              isOpen={openCat}
              onClose={closeCatM}
              onSave={onSaveCat}
              initialData={editCat}
            />
          </TabPanel>

          {/* Locations */}
          <TabPanel>
            <Box mb={4} display='flex'>
              {hasAuth && (
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme='green'
                  onClick={() => {
                    setEditLoc(null)
                    openLocM()
                  }}
                >
                  Konum Ekle
                </Button>
              )}
            </Box>
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Ad</Th>
                  <Th>Açıklama</Th>
                  <Th>Konum</Th>
                  {hasAuth && <Th>İşlemler</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {locations.map((l) => (
                  <Tr key={l.ID}>
                    <Td>{l.ID}</Td>
                    <Td>{l.NAME}</Td>
                    <Td>{l.DESCRIPTION}</Td>
                    <Td>
                      <Button
                        onClick={() => window.open(l.COORDINATES, '_blank')}
                      >
                        <TiLocation />
                      </Button>
                    </Td>
                    {hasAuth && (
                      <Td>
                        <Button
                          size='sm'
                          mr={2}
                          onClick={() => {
                            setEditLoc(l)
                            openLocM()
                          }}
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          size='sm'
                          colorScheme='red'
                          onClick={() => onDeleteLoc(l.ID)}
                        >
                          <DeleteIcon />
                        </Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <LocationFormModal
              isOpen={openLoc}
              onClose={closeLocM}
              onSave={onSaveLoc}
              initialData={editLoc}
            />
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
                        <Button
                          size='sm'
                          colorScheme='red'
                          onClick={() => onDeleteAuth(u.USER_ID)}
                        >
                          <DeleteIcon />
                        </Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <AuthUserModal
              isOpen={openAuth}
              onClose={closeAuthM}
              onSave={onSaveAuth}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default Dashboard
