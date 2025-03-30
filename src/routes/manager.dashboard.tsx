import { FC, ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'
import ContentWrapper from '../components/common/contentwrapper/contentwrapper'
import NavBar from '../components/common/header/navBar'
import DailyActivity from '../components/dashboard/manager/dailyactivity'
import Sidebar from '../components/dashboard/manager/sidebar'
import NotFound from '../components/notfound/notFound'

export const ManagerDashboardRoutes: FC = (): ReactElement => {
  return (
    <div className='h-[100vh] bg-white overflow-y-hidden w-[100%]'>
      <div className='flex h-[100%] w-[100%] '>
        <Sidebar />
        <div className='flex-1 h-[100%] flex flex-col  mb-16 w-[100%] '>
          <NavBar />
          <ContentWrapper>
            <Routes>
              <Route path='/' element={<DailyActivity />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </ContentWrapper>
        </div>
      </div>
    </div>
  )
}

export default ManagerDashboardRoutes
