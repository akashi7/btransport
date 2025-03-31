/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Col, Form, Row } from 'antd'
import { useEffect, useState } from 'react'
import requiredField from '../../../helpers/requiredField'
import Notify from '../../../components/common/notification/notification'
import {
  useGetBusStopsQuery,
  useGetZonesQuery,
  useRegisterBusStopMutation,
  useUpdateBusStopMutation,
  useDeleteBusStopMutation,
} from '../../../lib/api/reports/reportsEndpoints'
import CustomButton from '../../common/button/button'
import CustomInput from '../../common/input/customInput'
import CustomModal from '../../common/modal/customModal'
import Paginator from '../../common/paginator/paginator'
import BusStopsTable from '../../tables/busstops.table'

const BusStops = () => {
  const [form] = Form.useForm()
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingBusStop, setEditingBusStop] = useState<any>(null)
  const size = 10
  
  const { data, isFetching, refetch } = useGetBusStopsQuery({
    page: currentPage.toString(),
    size: size.toString(),
  })

  const { 
    data: zones, 
    refetch: refetchZones,
    isFetching: isLoadingZones 
  } = useGetZonesQuery({})

  const [registerBusStop, { isLoading }] = useRegisterBusStopMutation()
  const [updateBusStop, { isLoading: isUpdating }] = useUpdateBusStopMutation()
  const [deleteBusStop] = useDeleteBusStopMutation()

  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingBusStop(null)
    form.resetFields()
  }

  useEffect(() => {
    refetch()
    refetchZones()
  }, [refetch, refetchZones])

  const zonesOptions = zones
    ? zones.data?.items?.map((zone) => ({
        key: zone.id,
        value: zone.id,
        label: `${zone.zoneName} - ${zone.destination}`,
      }))
    : []

  const handleEdit = (record) => {
    setEditingBusStop(record)
    setIsModalVisible(true)
    form.setFieldsValue({
      busStopName: record.busStopName,
      zoneId: record.zoneId,
    })
  }

  const handleDelete = (id) => {
    deleteBusStop(id) 
      .unwrap()
      .then(() => {
        refetch();
        Notify({
          message: 'Success',
          description: 'Bus stop deleted successfully',
        });
      })
      .catch(() => {
        Notify({
          message: 'Error',
          description: 'Failed to delete bus stop',
          type: 'error',
        });
      });
  }

  const onFinish = (values) => {
    if (editingBusStop) {
      updateBusStop({id: editingBusStop.id, data: values})
        .unwrap()
        .then(() => {
          handleCancel();
          refetch();
          Notify({
            message: 'Success',
            description: 'Bus stop updated successfully',
          });
        })
        .catch((err) => {
          Notify({
            message: 'Error',
            description: err?.data?.message || 'Failed to update bus stop',
            type: 'error',
          });
        });
    } else {
      registerBusStop(values)
        .unwrap()
        .then(() => {
          handleCancel();
          refetch();
          Notify({
            message: 'Success',
            description: 'Bus stop created successfully',
          });
        })
        .catch((err) => {
          Notify({
            message: 'Error',
            description: err?.data?.message || 'Failed to create bus stop',
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
        title={editingBusStop ? 'Edit Bus Stop' : 'Add Bus Stop'}
        handleCancel={handleCancel}
        width={1000}
        footerContent={
          <CustomButton
            type='primary'
            htmlType='submit'
            form='add-busstop-form'
            className='h-[50px] w-fit'
            loading={isLoading || isUpdating}
          >
            {isLoading || isUpdating ? 'Submitting...' : editingBusStop ? 'Update' : 'Submit'}
          </CustomButton>
        }
      >
        <Form
          className='space-y-6'
          name='add-busstop-form'
          form={form}
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col span={24}>
              <CustomInput
                placeholder='Bus Stop Name'
                label='Bus Stop Name'
                inputType='text'
                name='busStopName'
                rules={requiredField('Bus stop name')}
              />
            </Col>
            <Col span={24}>
              <CustomInput
                label='Zone'
                name='zoneId'
                type='select'
                placeholder='Please select a zone'
                rules={requiredField('Zone')}
                options={zonesOptions}
                isLoading={isLoadingZones}
              />
            </Col>
          </Row>
        </Form>
      </CustomModal>
      <div>
        <div className='flex justify-between items-center'>
          <h1>Bus Stops</h1>
          <CustomButton
            type='primary'
            className='w-fit h-[50px]'
            htmlType='button'
            onClick={() => setIsModalVisible(!isModalVisible)}
          >
            Add Bus Stop
          </CustomButton>
        </div>
        <div className='mt-10'>
          <BusStopsTable 
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

export default BusStops