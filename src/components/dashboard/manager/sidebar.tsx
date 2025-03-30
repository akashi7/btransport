import { FC, ReactElement, cloneElement } from 'react'
import { RxActivityLog } from 'react-icons/rx'
import { useMatch, useNavigate } from 'react-router-dom'

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
    navigate('/manager/')
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
          icon={<RxActivityLog size={30} />}
          text='Daily Activity'
          url='/manager/'
        />
      </div>
    </section>
  )
}

export default Sidebar
