import { Col, Form, Row } from 'antd'
import { useEffect, useState } from 'react'
import requiredField from '../../../helpers/requiredField'
import { useGetAllBusesQuery } from '../../../lib/api/reports/reportsEndpoints'
import CustomButton from '../../common/button/button'
import CustomInput from '../../common/input/customInput'
import CustomModal from '../../common/modal/customModal'

const DailyActivity = () => {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }
  const { data, isFetching, refetch } = useGetAllBusesQuery({})
  useEffect(() => {
    refetch()
  }, [refetch])
  const busesOptions = data
    ? data.data?.items?.map((item) => ({
        key: item.id,
        value: item.id,
        label: item.plateNo,
      }))
    : []

  return (
    <>
      <CustomModal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        title={'Add Activity'}
        handleCancel={handleCancel}
        width={1000}
        footerContent={
          <CustomButton
            type='primary'
            htmlType='submit'
            form='add-daily-form'
            className='h-[50px] w-fit'
          >
            Submit
          </CustomButton>
        }
      >
        <Form className='space-y-6' name='add-daily-form' form={form}>
          <Row gutter={16}>
            <Col span={24}>
              <CustomInput
                label='Buses'
                name='busId'
                type='select-multiple'
                placeholder='Please select'
                rules={requiredField('Bus')}
                options={busesOptions}
                isLoading={isFetching}
              />
            </Col>
          </Row>
        </Form>
      </CustomModal>
      <div>
        <div className='flex justify-between mt-10'>
          <h1>Activity</h1>
          <div className=''>
            <CustomButton
              type='primary'
              className='w-fit h-[50px]'
              htmlType='button'
              onClick={() => setIsModalVisible(!isModalVisible)}
            >
              Add Activity
            </CustomButton>
          </div>
        </div>
        <div className='mt-10'></div>
      </div>
    </>
  )
}

export default DailyActivity
