import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import React from 'react'
import { FormatDate } from 'utils/Functions/UtilFunctions.js'

const ActivityLogTable = ({ activityLogs }) => {
  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }
  const defaultTaskStage = [
    'Yapılacak Görevler',
    'Devam Eden',
    'Tamamlanan',
    'Arşiv',
  ]
  return (
    <>
      {activityLogs && activityLogs.length > 0 ? (
        <Table variant='striped' size='md'>
          <Thead>
            <Tr>
              <Th>Tarih</Th>
              <Th>Log No</Th>
              <Th>Görev No</Th>
              <Th>GÖREV ADI</Th>
              <Th>TİP</Th>
              <Th>Açıklama</Th>
              <Th>Aşama</Th>
              <Th>Atanan</Th>
              <Th>sorumlu</Th>
              <Th>Tetikleyen</Th>
            </Tr>
          </Thead>
          <Tbody>
            {activityLogs.map((log) => (
              <Tr key={log.LOGID}>
                <Td>{formatDate(log.DATE)}</Td>
                <Td>{log.LOGID}</Td>
                <Td>{log.TASKID}</Td>
                <Td>{log.TASK_NAME}</Td>
                <Td>{log.TYPE === 1 ? 'Görev Logu' : 'Yorum Logu'}</Td>
                <Td>{log.DESCRIPTION}</Td>
                <Td>{defaultTaskStage[log.STAGE] || log.STAGE}</Td>
                <Td>{log.ASSIGNED_BY}</Td>
                <Td>{log.ASSIGNED_TO}</Td>
                <Td>{log.TRIGGERED_BY}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <p>No activity logs available.</p>
      )}
    </>
  )
}

export default ActivityLogTable
