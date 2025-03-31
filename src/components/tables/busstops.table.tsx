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

interface BusStopsTableProps {
  data: any[] | undefined
  isFetching: boolean
  onEdit?: (record: any) => void
  onDelete?: (id: number) => void
}

const BusStopsTable: FC<BusStopsTableProps> = ({
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
        title='Bus Stop Name'
        key='busStopName'
        {...getColumnProps('Bus Stop Name')}
        render={(record) => <span>{record.busStopName}</span>}
      />

      <Column
        title='Zone Name'
        key='zoneName'
        {...getColumnProps('Zone Name')}
        render={(record) => <span>{record.zone?.zoneName || 'N/A'}</span>}
      />

      <Column
        title='Destination'
        key='destination'
        {...getColumnProps('Destination')}
        render={(record) => <span>{record.zone?.destination || 'N/A'}</span>}
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

<Column
  title='Buses Count'
  key='busesCount'
  {...getColumnProps('Buses Count')}
  render={(record) => (
    <span className="block w-full text-center">{record.buses?.length || 0}</span>
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
                  title='Are you sure you want to delete this bus stop?'
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

export default BusStopsTable