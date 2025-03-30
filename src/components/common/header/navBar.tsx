import { Dropdown } from 'antd'
import { FC, ReactElement } from 'react'
import { FaRegUser } from 'react-icons/fa'
import { MdKeyboardArrowDown, MdMenuOpen } from 'react-icons/md'
import { IoIosLogOut } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

const NavBar: FC = (): ReactElement => {
  const navigate = useNavigate()
  const handleLogout = (): void => {
    navigate('/')
  }
  const ProfileDropdown = (
    <div className='w-[100%] rounded shadow-md z-100 bg-white p-2 mt-6'>
      <p className='p-4 px-2 w-[100%] font-medium flex flex-row gap-2'>
        <span className='text-gray-400'>Unknown</span>
      </p>

      <div
        className='flex items-center gap-2 w-[100%] rounded p-2 bg-[#0e7e15] font-[600] cursor-pointer '
        onClick={handleLogout}
      >
        <IoIosLogOut size={20} className='text-white' />
        <p className='flex-1 text-white'>Logout</p>
      </div>
    </div>
  )

  return (
    <div className='flex   justify-between items-center border-b border-gray-300 p-5 bg-white text-black'>
      <MdMenuOpen
        size={25}
        className='text-[#0e7e15] cursor-pointer lg:block hidden'
      />
      <Dropdown overlay={ProfileDropdown} trigger={['click']}>
        <div className='flex items-center gap-2 lg:gap-4 cursor-pointer hover:bg-inherit hover:text-[#0e7e15]  p-2 px-2 rounded'>
          <FaRegUser />
          <div className='flex items-center gap-2'>
            <p className='hidden lg:block'>Unknown</p>
            <MdKeyboardArrowDown
              size={14}
              className='object-cover rounded-full'
            />
          </div>
        </div>
      </Dropdown>
    </div>
  )
}

export default NavBar
