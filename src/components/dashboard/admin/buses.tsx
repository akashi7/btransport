/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Col, Form, Row } from 'antd'
import { useEffect, useState } from 'react'
import Notify from '../../../components/common/notification/notification'
import requiredField from '../../../helpers/requiredField'
import {
  BusFormValues,
  useGetAllBusesQuery,
  useGetBusStopsQuery,
  useGetZonesQuery,
  useRegisterBusMutation,
  useUpdateBusMutation,
  useDeleteBusMutation
} from '../../../lib/api/reports/reportsEndpoints'
import CustomButton from '../../common/button/button'
import CustomInput from '../../common/input/customInput'
import CustomModal from '../../common/modal/customModal'
import Paginator from '../../common/paginator/paginator'
import BusesTable from '../../tables/buses.table'

const Buses = () => {
  const [form] = Form.useForm()
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingBus, setEditingBus] = useState<any>(null)
  const size = 10
  
  const { data, isFetching, refetch } = useGetAllBusesQuery({
    page: currentPage.toString(),
    size: size.toString(),
  })

  const [registerBus, { isLoading }] = useRegisterBusMutation()
  const [updateBus, { isLoading: isUpdating }] = useUpdateBusMutation()
  const [deleteBus] = useDeleteBusMutation()

  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingBus(null)
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

  useEffect(() => {
    refetch()
    refetchZones()
    refetchBusStops()
  }, [refetch, refetchZones, refetchBusStops])

  const busesStops = busStops
    ? busStops?.data?.items?.map((item) => ({
        key: item.id,
        value: item.id,
        label: item.busStopName,
      }))
    : []

  const zonesOptions = zones
    ? zones?.data?.items?.map((item) => ({
        key: item.id,
        value: item.id,
        label: item.zoneName,
      }))
    : []
    
  const statusOptions = [
    { value: 'AVAILABLE', label: 'Available' },
    { value: 'NOT_AVAILABLE', label: 'Not Available' },
    { value: 'IN_USE', label: 'In Use' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
  ]

  const handleEdit = (record) => {
    setEditingBus(record)
    setIsModalVisible(true)
    form.setFieldsValue({
      plateNo: record.plateNo,
      zoneId: record.zoneId,
      busStopId: record.busStopId,
      status: record.status, 
    })
  }

  const handleDelete = (id) => {
    deleteBus(id) 
      .unwrap()
      .then(() => {
        refetch();
        Notify({
          message: 'Success',
          description: 'Bus deleted successfully',
        });
      })
      .catch(() => {
        Notify({
          message: 'Error',
          description: 'Failed to delete bus',
          type: 'error',
        });
      });
  }

  const onFinish = (values: BusFormValues) => {
    if (editingBus) {
      updateBus({id: editingBus.id, data: values})
        .unwrap()
        .then(() => {
          handleCancel();
          refetch();
          Notify({
            message: 'Success',
            description: 'Bus updated successfully',
          });
        })
        .catch((err) => {
          Notify({
            message: 'Error',
            description: err?.data?.message || 'Failed to update bus',
            type: 'error',
          });
        });
    } else {
      const busData = {
        ...values,
        status: "AVAILABLE",
        CarStatus: "GOOD_CONDITION"
      };
      
      registerBus(busData)
        .unwrap()
        .then(() => {
          handleCancel();
          refetch();
          Notify({
            message: 'Success',
            description: 'Bus created successfully',
          });
        })
        .catch((err) => {
          Notify({
            message: 'Error',
            description: err?.data?.message || 'Failed to create bus',
            type: 'error',
          });
        });
    }
  }

  return (
    <>
      <CustomModal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        title={editingBus ? 'Edit Bus' : 'Add Bus'}
        handleCancel={handleCancel}
        width={1000}
        footerContent={
          <CustomButton
            type='primary'
            htmlType='submit'
            form='add-bus-form'
            className='h-[50px] w-fit'
            loading={isLoading || isUpdating}
          >
            {isLoading || isUpdating ? 'Submitting...' : editingBus ? 'Update' : 'Submit'}
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
            {editingBus && (
              <Col span={24}>
                <CustomInput
                  label='Status'
                  name='status'
                  type='select'
                  placeholder='Please select status'
                  rules={requiredField('Status')}
                  options={statusOptions}
                />
              </Col>
            )}
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
          <BusesTable 
            isFetching={isFetching} 
            data={data?.data?.items}
            onEdit={handleEdit}
            onDelete={handleDelete} 
          />
          <Paginator
            total={data?.data?.itemCount}
            setCurrentPage={setCurrentPage}
            totalPages={Math.ceil((data?.data?.itemCount || 0) / size)}
            currentPage={currentPage}
            pageSize={size}
          />
        </div>
      </div>
    </>
  )
}

export default Buses