import { Col, Form, Row } from 'antd'
import { useEffect, useState } from 'react'
import handleAPIRequests from '../../../helpers/handleApiRequest'
import requiredField from '../../../helpers/requiredField'
import {
  BusFormValues,
  useGetAllBusesQuery,
  useGetBusStopsQuery,
  useGetZonesQuery,
  useRegisterBusMutation,
} from '../../../lib/api/reports/reportsEndpoints'
import CustomButton from '../../common/button/button'
import CustomInput from '../../common/input/customInput'
import CustomModal from '../../common/modal/customModal'
import Paginator from '../../common/paginator/paginator'
import BusesTable from '../../tables/buses.table'

const Buses = () => {
  const [form] = Form.useForm()
  const [currentPage, setCurrentPage] = useState<number>(0)
  const size = 10
  const { data, isFetching, refetch } = useGetAllBusesQuery({
    page: currentPage.toString(),
    size: size.toString(),
  })

  const [registerBus, { isLoading }] = useRegisterBusMutation()

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  const {
    data: zones,
    refetch: refetchZones,
    isFetching: zF,
  } = useGetZonesQuery({})
  const {
    data: busStops,
    refetch: refetchBusStops,
    isFetching: BL,
  } = useGetBusStopsQuery({})
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    refetch()
    refetchZones()
    refetchBusStops()
  }, [refetch, refetchZones, refetchBusStops])

  const busesStops = data
    ? busStops?.data?.items?.map((item) => ({
        key: item.id,
        value: item.id,
        label: item.busStopName,
      }))
    : []

  const zonesOptions = data
    ? zones?.data?.items?.map((item) => ({
        key: item.id,
        value: item.id,
        label: item.zoneName,
      }))
    : []

  const onFinish = (values: BusFormValues) => {
    handleAPIRequests({
      request: registerBus,
      ...values,
      onSuccess: handleCancel,
    })
  }

  return (
    <>
      <CustomModal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        title={'Add Bus'}
        handleCancel={handleCancel}
        width={1000}
        footerContent={
          <CustomButton
            type='primary'
            htmlType='submit'
            form='add-bus-form'
            className='h-[50px] w-fit'
            loading={isLoading}
          >
            Submit
          </CustomButton>
        }
      >
        <Form
          className='space-y-6'
          name='add-bus-form'
          form={form}
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col span={24}>
              <CustomInput
                placeholder='Plate No'
                label='Plate No'
                inputType='text'
                name='plateNo'
                rules={requiredField('Plate')}
              />
            </Col>
            <Col span={24}>
              <CustomInput
                label='Zone'
                name='zoneId'
                type='select'
                placeholder='Please select'
                rules={requiredField('Zone')}
                options={zonesOptions}
                isLoading={zF}
              />
            </Col>
            <Col span={24}>
              <CustomInput
                label='Bus stop'
                name='busStopId'
                type='select'
                placeholder='Please select'
                rules={requiredField('Bus stop')}
                options={busesStops}
                isLoading={BL}
              />
            </Col>
          </Row>
        </Form>
      </CustomModal>
      <div>
        <div className='flex justify-between items-center'>
          <h1>Buses</h1>
          <CustomButton
            type='primary'
            className='w-fit h-[50px]'
            htmlType='button'
            onClick={() => setIsModalVisible(!isModalVisible)}
          >
            Add Bus
          </CustomButton>
        </div>
        <div className='mt-10'>
          <BusesTable isFetching={isFetching} data={data?.data?.items} />
          <Paginator
            total={data?.data.totalItems}
            setCurrentPage={setCurrentPage}
            totalPages={data?.data.totalPages}
            currentPage={currentPage}
            pageSize={size}
          />
        </div>
      </div>
    </>
  )
}
export default Buses
