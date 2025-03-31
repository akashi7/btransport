/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Table, Popconfirm, Tag } from 'antd'
import { FC, ReactElement, useCallback } from 'react'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

const { Column } = Table

interface DriversTableProps {
  data: any[] | undefined
  isFetching: boolean
  onEdit?: (record: any) => void
  onDelete?: (id: number) => void
}

const DriversTable: FC<DriversTableProps> = ({
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'green';
      case 'NOT_AVAILABLE':
        return 'red';
      case 'ON_DUTY':
        return 'blue';
      default:
        return 'gray';
    }
  };

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
        title='Full Name'
        key='fullName'
        {...getColumnProps('Full Name')}
        render={(record) => <span>{record.user?.fullName}</span>}
      />

      <Column
        title='Email'
        key='email'
        {...getColumnProps('Email')}
        render={(record) => <span>{record.user?.email}</span>}
      />

      <Column
        title='Status'
        key='status'
        {...getColumnProps('Status')}
        render={(record) => (
          <Tag color={getStatusColor(record.status)}>
            {record.status}
          </Tag>
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
                  title='Are you sure you want to delete this driver?'
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

export default DriversTable