import { Route, Routes } from 'react-router-dom'
import Login from './components/auth/login'
import AdminDashboardRoutes from './routes/admin.dashboard.route'
import ManagerDashboardRoutes from './routes/manager.dashboard'
import SubManagerDashboardRoutes from './routes/submanager.route'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/admin/*' element={<AdminDashboardRoutes />} />
        <Route path='/manager/*' element={<ManagerDashboardRoutes />} />
        <Route path='/sub/*' element={<SubManagerDashboardRoutes />} />
      </Routes>
    </>
  )
}

export default App
