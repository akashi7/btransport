import { Table } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { FC, ReactElement, useCallback } from 'react'
import { WeekInterface } from '../../lib/api/reports/reportsEndpoints'

dayjs.extend(utc)
dayjs.extend(timezone)

interface WeeklyTableProps {
  data: WeekInterface[] | undefined
  isFetching: boolean
}

const { Column } = Table

const WeeklyTable: FC<WeeklyTableProps> = ({
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
      className={`data_table border-collapse w-full`}
      dataSource={data}
      rowKey={(record) => record?.id.toString()}
      rowClassName='shadow'
      pagination={false}
      loading={isFetching}
      bordered={false}
      scroll={{ x: 0 }}
    >
      <Column
        title='Start of Week'
        key='startOfWeek'
        {...getColumnProps('Start of Week')}
        render={(record: WeekInterface) => (
          <span>{formatDate(record.startOfWeek)}</span>
        )}
      />

      <Column
        title='End of Week'
        key='endOfWeek'
        {...getColumnProps('End of Week')}
        render={(record: WeekInterface) => (
          <span>{formatDate(record.endOfWeek)}</span>
        )}
      />

      <Column
        title='Day of Week'
        key='dayOfWeek'
        {...getColumnProps('Day of Week')}
        render={(record: WeekInterface) => <span>{record.dayOfWeek}</span>}
      />

      <Column
        title='Bus Plate Number'
        key='plateNo'
        {...getColumnProps('Bus Plate Number')}
        render={(record: WeekInterface) => <span>{record.bus.plateNo}</span>}
      />

      <Column
        title='Driver Name'
        key='driverName'
        {...getColumnProps('Driver Name')}
        render={(record: WeekInterface) => (
          <span>{record.driver.fullName}</span>
        )}
      />
    </Table>
  )
}

export default WeeklyTable
