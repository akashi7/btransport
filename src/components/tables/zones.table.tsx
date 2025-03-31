/* eslint-disable  @typescript-eslint/no-explicit-any */

import { Table, Popconfirm } from 'antd'
import { FC, ReactElement, useCallback } from 'react'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

const { Column } = Table

interface ZonesTableProps {
  data: any[] | undefined
  isFetching: boolean
  onEdit?: (record: any) => void
  onDelete?: (id: number) => void
}

const ZonesTable: FC<ZonesTableProps> = ({
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
        title='Zone Name'
        key='zoneName'
        {...getColumnProps('Zone Name')}
        render={(record) => <span>{record.zoneName}</span>}
      />

      <Column
        title='Destination'
        key='destination'
        {...getColumnProps('Destination')}
        render={(record) => <span>{record.destination}</span>}
      />

      <Column
        title='Manager Name'
        key='managerName'
        {...getColumnProps('Manager Name')}
        render={(record) => (
          <span>
            {record.manager?.user?.fullName || 'Not assigned'}
          </span>
        )}
      />

      <Column
        title='Manager Email'
        key='managerEmail'
        {...getColumnProps('Manager Email')}
        render={(record) => (
          <span>
            {record.manager?.user?.email || 'N/A'}
          </span>
        )}
      />
      
      <Column
        title='Created At'
        key='createdAt'
        {...getColumnProps('Created At')}
        render={(record) => (
          <span>{formatDate(record.createdAt)}</span>
        )}
      />

      <Column
        title='Updated At'
        key='updatedAt'
        {...getColumnProps('Updated At')}
        render={(record) => (
          <span>{formatDate(record.updatedAt)}</span>
        )}
      />

      {(onEdit || onDelete) && (
        <Column
          title='Actions'
          key='actions'
          {...getColumnProps('Actions')}
          render={(record) => (
            <div className='flex gap-3'>
              {onEdit && (
                <EditOutlined
                  className='text-blue-500 cursor-pointer'
                  onClick={() => onEdit(record)}
                />
              )}
              {onDelete && (
                <Popconfirm
                  title='Are you sure you want to delete this zone?'
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

export default ZonesTable