/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Col, Form, Row } from 'antd'
import { useEffect, useState } from 'react'
import requiredField from '../../../helpers/requiredField'
import Notify from '../../../components/common/notification/notification'
import {
  useGetAllDriversQuery,
  useRegisterDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
} from '../../../lib/api/reports/reportsEndpoints'
import CustomButton from '../../common/button/button'
import CustomInput from '../../common/input/customInput'
import CustomModal from '../../common/modal/customModal'
import Paginator from '../../common/paginator/paginator'
import DriversTable from '../../tables/drivers.table'

const Drivers = () => {
  const [form] = Form.useForm()
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingDriver, setEditingDriver] = useState<any>(null)
  const [isPasswordVisible, setIsPasswordVisible] = useState(true)
  const size = 10
  
  const { data, isFetching, refetch } = useGetAllDriversQuery()

  const [registerDriver, { isLoading }] = useRegisterDriverMutation()
  const [updateDriver, { isLoading: isUpdating }] = useUpdateDriverMutation()
  const [deleteDriver] = useDeleteDriverMutation()

  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingDriver(null)
    setIsPasswordVisible(true)
    form.resetFields()
  }

  useEffect(() => {
    refetch()
  }, [refetch])

  const statusOptions = [
    { value: 'AVAILABLE', label: 'Available' },
    { value: 'NOT_AVAILABLE', label: 'Not Available' },
    { value: 'ON_DUTY', label: 'On Duty' },
  ]

  const handleEdit = (record) => {
    setEditingDriver(record)
    setIsPasswordVisible(false)
    setIsModalVisible(true)
    form.setFieldsValue({
      fullName: record.user.fullName,
      email: record.user.email,
      status: record.status,
    })
  }

  const handleDelete = (id) => {
    deleteDriver(id) 
      .unwrap()
      .then(() => {
        refetch();
        Notify({
          message: 'Success',
          description: 'Driver deleted successfully',
        });
      })
      .catch(() => {
        Notify({
          message: 'Error',
          description: 'Failed to delete driver',
          type: 'error',
        });
      });
  }

  const onFinish = (values) => {
    if (editingDriver) {
      // Update driver case - Keep the status in the request
      const updateData = {...values};
      if (!updateData.password) {
        delete updateData.password;
      }
      
      // Don't delete the status for updates - driver status can be updated
      
      updateDriver({id: editingDriver.id, data: updateData})
        .unwrap()
        .then(() => {
          handleCancel();
          refetch();
          Notify({
            message: 'Success',
            description: 'Driver updated successfully',
          });
        })
        .catch((err) => {
          Notify({
            message: 'Error',
            description: err?.data?.message || 'Failed to update driver',
            type: 'error',
          });
        });
    } else {
      // Create new driver case - Remove status
      const driverData = {
        ...values,
        role: "DRIVER",
        isActive: true,
      };
      
      // Remove status from the API request when creating a new driver
      delete driverData.status;
      
      registerDriver(driverData)
        .unwrap()
        .then(() => {
          handleCancel();
          refetch();
          Notify({
            message: 'Success',
            description: 'Driver created successfully',
          });
        })
        .catch((err) => {
          Notify({
            message: 'Error',
            description: err?.data?.message || 'Failed to create driver',
            type: 'error',
          });
        });
    }
  }
  const paginatedDrivers = data?.data?.items || [];

  return (
    <>
      <CustomModal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        title={editingDriver ? 'Edit Driver' : 'Add Driver'}
        handleCancel={handleCancel}
        width={1000}
        footerContent={
          <CustomButton
            type='primary'
            htmlType='submit'
            form='add-driver-form'
            className='h-[50px] w-fit'
            loading={isLoading || isUpdating}
          >
            {isLoading || isUpdating ? 'Submitting...' : editingDriver ? 'Update' : 'Submit'}
          </CustomButton>
        }
      >
        <Form
          className='space-y-6'
          name='add-driver-form'
          form={form}
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col span={24}>
              <CustomInput
                placeholder='Full Name'
                label='Full Name'
                inputType='text'
                name='fullName'
                rules={requiredField('Full name')}
              />
            </Col>
            <Col span={24}>
              <CustomInput
                placeholder='Email'
                label='Email'
                inputType='email'
                name='email'
                rules={requiredField('Email')}
              />
            </Col>
            {isPasswordVisible && (
              <Col span={24}>
                <CustomInput
                  placeholder='Password'
                  label='Password'
                  inputType='password'
                  name='password'
                  rules={!editingDriver ? requiredField('Password') : []}
                />
              </Col>
            )}
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
          </Row>
        </Form>
      </CustomModal>
      <div>
        <div className='flex justify-between items-center'>
          <h1>Drivers</h1>
          <CustomButton
            type='primary'
            className='w-fit h-[50px]'
            htmlType='button'
            onClick={() => setIsModalVisible(!isModalVisible)}
          >
            Add Driver
          </CustomButton>
        </div>
        <div className='mt-10'>
          <DriversTable 
            isFetching={isFetching} 
            data={paginatedDrivers}
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

export default Drivers