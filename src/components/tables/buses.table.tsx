import { Table, Popconfirm, Tag } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { FC, ReactElement, useCallback } from 'react'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { BusesInterface } from '../../lib/api/reports/reportsEndpoints'

dayjs.extend(utc)
dayjs.extend(timezone)

interface BusesTableProps {
  data: BusesInterface[] | undefined
  isFetching: boolean
  onEdit?: (record: BusesInterface) => void
  onDelete?: (id: number) => void
}

const { Column } = Table

const BusesTable: FC<BusesTableProps> = ({
  data,
  isFetching,
  onEdit,
  onDelete,
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
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'green';
      case 'NOT_AVAILABLE':
        return 'red';
      case 'IN_USE':
        return 'blue';
      case 'MAINTENANCE':
        return 'orange';
      default:
        return 'gray';
    }
  }, []);

  const getCarStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'GOOD_CONDITION':
        return 'green';
      case 'MAINTENANCE':
        return 'orange';
      case 'DAMAGED':
        return 'red';
      default:
        return 'gray';
    }
  }, []);

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
  render={(record: BusesInterface) => (
    <Tag color={getStatusColor(record.status)}>
      {record.status}
    </Tag>
  )}
/>

      <Column
        title='Car Condition'
        key='carCondition'
        {...getColumnProps('Car Condition')}
        render={(record: BusesInterface) => (
          <Tag color={getCarStatusColor(record.CarStatus)}>
            {record.CarStatus.replace('_', ' ')}
          </Tag>
        )}
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

      {(onEdit || onDelete) && (
        <Column
          title='Actions'
          key='actions'
          {...getColumnProps('Actions')}
          render={(record: BusesInterface) => (
            <div className='flex gap-3'>
              {onEdit && (
                <EditOutlined
                  className='text-blue-500 cursor-pointer'
                  onClick={() => onEdit(record)}
                />
              )}
              {onDelete && (
                <Popconfirm
                  title='Are you sure you want to delete this bus?'
                  onConfirm={() => onDelete(record.id)}
                  okText='Yes'
                  cancelText='No'
                >
                  <DeleteOutlined className='text-red-500 cursor-pointer' />
                </Popconfirm>
              )}
            </div>
          )}
        />
      )}
    </Table>
  )
}

export default BusesTable