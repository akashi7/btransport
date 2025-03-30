import { Table } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { FC, ReactElement, useCallback } from 'react'
import { BusesInterface } from '../../lib/api/reports/reportsEndpoints'

dayjs.extend(utc)
dayjs.extend(timezone)

interface BusesTableProps {
  data: BusesInterface[] | undefined
  isFetching: boolean
}

const { Column } = Table

const BusesTable: FC<BusesTableProps> = ({
  data,
  isFetching,
}): ReactElement => {
  const formatDate = useCallback((date: string) => {
    return dayjs(date).format('DD/MM/YYYY HH:mm')
  }, [])

  const getColumnProps = useCallback(
    (label: string) => ({
      className: 'bg-white c-column',
      onCell: () =>
        ({
          'data-label': label,
        } as React.TdHTMLAttributes<HTMLTableCellElement>),
    }),
    []
  )

  return (
    <Table
      className='data_table border-collapse w-full'
      dataSource={data}
      rowKey={(record) => record.id.toString()}
      rowClassName='shadow'
      pagination={false}
      loading={isFetching}
      bordered={false}
      scroll={{ x: 0 }}
    >
      <Column
        title='Bus Plate Number'
        key='plateNo'
        {...getColumnProps('Bus Plate Number')}
        render={(record: BusesInterface) => <span>{record.plateNo}</span>}
      />

      <Column
        title='Zone Name'
        key='zoneName'
        {...getColumnProps('Zone Name')}
        render={(record: BusesInterface) => <span>{record.zone.zoneName}</span>}
      />

      <Column
        title='Destination'
        key='destination'
        {...getColumnProps('Destination')}
        render={(record: BusesInterface) => (
          <span>{record.zone.destination}</span>
        )}
      />

      <Column
        title='Bus Stop Name'
        key='busStopName'
        {...getColumnProps('Bus Stop Name')}
        render={(record: BusesInterface) => (
          <span>{record.busStop.busStopName}</span>
        )}
      />

      <Column
        title='Status'
        key='status'
        {...getColumnProps('Status')}
        render={(record: BusesInterface) => <span>{record.status}</span>}
      />

      <Column
        title='Created At'
        key='createdAt'
        {...getColumnProps('Created At')}
        render={(record: BusesInterface) => (
          <span>{formatDate(record.busStop.createdAt)}</span>
        )}
      />

      <Column
        title='Updated At'
        key='updatedAt'
        {...getColumnProps('Updated At')}
        render={(record: BusesInterface) => (
          <span>{formatDate(record.busStop.updatedAt)}</span>
        )}
      />
    </Table>
  )
}

export default BusesTable
