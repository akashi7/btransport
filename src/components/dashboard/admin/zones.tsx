/* eslint-disable  @typescript-eslint/no-explicit-any */

import { Col, Form, Row } from 'antd'
import { useEffect, useState } from 'react'
import requiredField from '../../../helpers/requiredField'
import Notify from '../../common/notification/notification'
import {
  useGetZonesQuery,
  useGetAllManagersQuery,
  useRegisterZoneMutation,
  useDeleteZoneMutation,
  useUpdateZoneMutation
} from '../../../lib/api/reports/reportsEndpoints'
import CustomButton from '../../common/button/button'
import CustomInput from '../../common/input/customInput'
import CustomModal from '../../common/modal/customModal'
import Paginator from '../../common/paginator/paginator'
import ZonesTable from '../../tables/zones.table'

const Zones = () => {
  const [form] = Form.useForm()
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingZone, setEditingZone] = useState<any>(null)
  const size = 10
  
  const { data, isFetching, refetch } = useGetZonesQuery({
    page: currentPage.toString(),
    size: size.toString(),
  })

  const { 
    data: managers, 
    refetch: refetchManagers,
    isFetching: isLoadingManagers 
  } = useGetAllManagersQuery()

  const [registerZone, { isLoading }] = useRegisterZoneMutation()
  const [updateZone, { isLoading: isUpdating }] = useUpdateZoneMutation()
  const [deleteZone] = useDeleteZoneMutation()

  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingZone(null)
    form.resetFields()
  }

  useEffect(() => {
    refetch()
    refetchManagers()
  }, [refetch, refetchManagers])

  const managersOptions = managers
    ? managers.data?.items?.map((manager) => ({
        key: manager.id,
        value: manager.id,
        label: manager.user?.fullName || 'Unknown',
      }))
    : []

  const handleEdit = (record) => {
    setEditingZone(record)
    setIsModalVisible(true)
    form.setFieldsValue({
      zoneName: record.zoneName,
      destination: record.destination,
      managerId: record.managerId,
    })
  }

  const handleDelete = (id) => {
    deleteZone(id) 
      .unwrap()
      .then(() => {
        refetch();
        Notify({
          message: 'Success',
          description: 'Zone deleted successfully',
        });
      })
      .catch(() => {
        Notify({
          message: 'Error',
          description: 'Failed to delete zone',
          type: 'error',
        });
      });
  }

  const onFinish = (values) => {
    if (editingZone) {
      updateZone({id: editingZone.id, data: values})
        .unwrap()
        .then(() => {
          handleCancel();
          refetch();
          Notify({
            message: 'Success',
            description: 'Zone updated successfully',
          });
        })
        .catch((err) => {
          Notify({
            message: 'Error',
            description: err?.data?.message || 'Failed to update zone',
            type: 'error',
          });
        });
    } else {
      registerZone(values)
        .unwrap()
        .then(() => {
          handleCancel();
          refetch();
          Notify({
            message: 'Success',
            description: 'Zone created successfully',
          });
        })
        .catch((err) => {
          Notify({
            message: 'Error',
            description: err?.data?.message || 'Failed to create zone',
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
        title={editingZone ? 'Edit Zone' : 'Add Zone'}
        handleCancel={handleCancel}
        width={1000}
        footerContent={
          <CustomButton
            type='primary'
            htmlType='submit'
            form='add-zone-form'
            className='h-[50px] w-fit'
            loading={isLoading || isUpdating}
          >
            {isLoading || isUpdating ? 'Submitting...' : editingZone ? 'Update' : 'Submit'}
          </CustomButton>
        }
      >
        <Form
          className='space-y-6'
          name='add-zone-form'
          form={form}
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col span={24}>
              <CustomInput
                placeholder='Zone Name'
                label='Zone Name'
                inputType='text'
                name='zoneName'
                rules={requiredField('Zone name')}
              />
            </Col>
            <Col span={24}>
              <CustomInput
                placeholder='Destination'
                label='Destination'
                inputType='text'
                name='destination'
                rules={requiredField('Destination')}
              />
            </Col>
            <Col span={24}>
              <CustomInput
                label='Manager'
                name='managerId'
                type='select'
                placeholder='Please select a manager'
                rules={requiredField('Manager')}
                options={managersOptions}
                isLoading={isLoadingManagers}
              />
            </Col>
          </Row>
        </Form>
      </CustomModal>
      <div>
        <div className='flex justify-between items-center'>
          <h1>Zones</h1>
          <CustomButton
            type='primary'
            className='w-fit h-[50px]'
            htmlType='button'
            onClick={() => setIsModalVisible(!isModalVisible)}
          >
            Add Zone
          </CustomButton>
        </div>
        <div className='mt-10'>
          <ZonesTable 
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

export default Zones