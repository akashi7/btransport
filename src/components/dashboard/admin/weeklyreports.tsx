import { useEffect } from 'react'
import { FaBus, FaUserCog, FaUsers, FaUserTie } from 'react-icons/fa'
import { useGetWeeklyTimetableQuery } from '../../../lib/api/reports/reportsEndpoints'
import WeeklyTable from '../../tables/weekly.table'
import AnalyticsCard from './card'

const WeeklyReports = () => {
  const { data, isFetching, refetch } = useGetWeeklyTimetableQuery()
  useEffect(() => {
    refetch()
  }, [refetch])
  return (
    <div>
      <h1>Weekly Reports</h1>
      <div className='mt-10'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          <AnalyticsCard data='12' title='Buses' icon={<FaBus size={50} />} />
          <AnalyticsCard
            data='15'
            title='Drivers'
            icon={<FaUserTie size={50} />}
          />
          <AnalyticsCard
            data='5'
            title='Managers'
            icon={<FaUserCog size={50} />}
          />
          <AnalyticsCard
            data='8'
            title='Sub-Managers'
            icon={<FaUsers size={50} />}
          />
        </div>
      </div>
      <div className='mt-10'>
        <WeeklyTable isFetching={isFetching} data={data?.data} />
      </div>
    </div>
  )
}

export default WeeklyReports
