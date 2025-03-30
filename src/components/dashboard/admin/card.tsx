import { FC, ReactNode } from 'react'

interface AnalyticsCardProps {
  data: string | undefined
  title?: string
  loading?: boolean
  icon: ReactNode
}

const AnalyticsCard: FC<AnalyticsCardProps> = ({ data, title, icon }) => {
  return (
    <div className='h-40 w-[100%] bg-[#1C2834] text-[#C1CF16] rounded-xl p-5 flex justify-center sm:justify-start '>
      <div className='flex 2xl:flex-row xl:gap-5 lg:gap-3 xl:flex-row xl:items-center lg:flex-col  2xl:items-center flex-col'>
        <div className='flex justify-center'>{icon}</div>
        <div>
          <p className='text-3xl text-center sm:text-left'>{data}</p>
          <div className='text-white'>{title}</div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsCard
