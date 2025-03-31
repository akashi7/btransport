import { FC, ReactElement, cloneElement } from 'react'
import { BsCalendar3Week } from 'react-icons/bs'
import { FaBus, FaCalendarDay ,FaUserTie} from 'react-icons/fa'
import { MdLocationOn } from 'react-icons/md' 
import { useMatch, useNavigate } from 'react-router-dom'
import { TbBusStop } from "react-icons/tb";

interface SidebarItemProps {
  icon: ReactElement
  text: string
  url: string
}

const SidebarItem: FC<SidebarItemProps> = ({
  icon,
  text,
  url,
}): ReactElement => {
  const navigate = useNavigate()
  const isMatch = useMatch(url)

  const handleClick = (): void => {
    navigate(url)
  }

  return (
    <div
      className={`flex flex-row gap-5 items-center mb-5 ${
        isMatch ? '' : ''
      } cursor-pointer p-3 rounded-lg w-full`}
      onClick={handleClick}
    >
      {cloneElement(icon, {
        color: isMatch ? '#0e7e15' : 'white',
      })}
      <p
        className={`${
          isMatch ? ' font-bold ' : ' font-medium'
        }  text-base text-white`}
      >
        {text}
      </p>
    </div>
  )
}

const Sidebar: FC = (): ReactElement => {
  const navigate = useNavigate()
  function goToDashboard() {
    navigate('/admin/')
  }
  return (
    <section className='lg:w-[300px] 2xl:w-[300px] h-[100%] lg:flex flex-col py-4 px-5 bg-[#1c4621] border-r border-gray-100 dark:border-gray-600 relative'>
      <h1
        className='text-2xl  text-white text-center font-bold mb-8 cursor-pointer'
        onClick={goToDashboard}
      >
        BTS
      </h1>

      <div className='mt-0 w-full'>
        <SidebarItem
          icon={<BsCalendar3Week size={30} />}
          text='Weekly Reports'
          url='/admin/'
        />
        <SidebarItem
          icon={<FaCalendarDay size={30} />}
          text='Daily Schedule'
          url='/admin/daily'
        />
        <SidebarItem
          icon={<FaBus size={30} />}
          text='Buses'
          url='/admin/buses'
        />
           <SidebarItem
          icon={<MdLocationOn size={30} />}
          text='Zones'
          url='/admin/zones'
        />
           <SidebarItem
          icon={<FaUserTie size={30} />}
          text='Drivers'
          url='/admin/drivers'
        />
           <SidebarItem
          icon={<TbBusStop size={30} />}
          text='Bus Stops'
          url='/admin/busstops'
        />
      </div>
    </section>
  )
}

export default Sidebar
