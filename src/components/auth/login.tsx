import { Col, Form, Row } from 'antd'
import { FC, ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.jpg'
import { ERoles } from '../../config/constant'
import handleAPIRequests from '../../helpers/handleApiRequest'
import { setToLocal } from '../../helpers/handleStorage'
import requiredField from '../../helpers/requiredField'
import {
  AuthResponse,
  LoginDTO,
  useLoginMutation,
} from '../../lib/api/Auth/authEndpoints'
import CustomButton from '../common/button/button'
import CustomImage from '../common/image/customImage'
import CustomInput from '../common/input/customInput'

const Login: FC = (): ReactElement => {
  const [form] = Form.useForm()
  const [login, { isLoading }] = useLoginMutation()

  const navigate = useNavigate()

  const onSuccess = (res: AuthResponse): void => {
    if (res.data) {
      if (res.data.token) {
        setToLocal('token', res.data.token)
        switch (res.data.user.role) {
          case ERoles.ADMIN:
            navigate('/admin')
            break
          case ERoles.MANAGER:
            navigate('/manager')
            break
          case ERoles.SUB_MANAGER:
            navigate('/sb')
            break
          default:
            navigate('/ds')
            break
        }
      }
    }
  }

  const onFinish = (values: LoginDTO) => {
    handleAPIRequests({
      request: login,
      ...values,
      onSuccess: onSuccess,
    })
  }

  return (
    <div className='h-[100vh] w-[100%] items-center justify-center flex flex-row background'>
      {/* <div className='xl:w-[40%] 2xl:w-[32%]  md:w-[45%] lg:w-[45%] 2xl:h-[650px] sm:h-[600px] md:h-[600px] xl:h-[650px] lg:h-[650px] hidden sm:flex md:flex lg:flex justify-center items-start flex-col bg-white shadow-md  lg:p-8 bg-login'></div> */}
      <div className='border rounded-lg  border-gray-200 p-4 xl:w-[45%] 2xl:w-[32%]   md:w-[60%]   w-[80%] lg:w-[50%] sm:h-[635px] md:h-[635px]  h-fit 2xl:h-[650px] xl:h-[650px] lg:h-[650px] bg-white    shadow-md sm:p-6 lg:p-8'>
        <section className=' flex justify-center'>
          <div className='flex lg:flex-row md:flex-row flex-col lg:gap-5 md:gap-5 gap-1 items-center '>
            <CustomImage
              src={logo}
              alt='logo'
              className='rounded-xl w-full'
              width={70}
              height={70}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </section>
        <h5 className='lg:text-xl text-base font-bold text-center text-black mt-2 mb-3'>
          Log in
        </h5>
        <Form
          className='space-y-12 mt-5'
          name='login-form'
          form={form}
          onFinish={onFinish}
        >
          <Row className='w-[100%]'>
            <Col className='gutter-row mt-2 w-full'>
              <CustomInput
                placeholder='Email'
                label='Email'
                inputType='eamil'
                name='email'
                rules={requiredField('Email')}
              />
            </Col>
            <Col className='gutter-row mt-2 w-full'>
              <CustomInput
                placeholder='Password'
                label='Password'
                inputType='password'
                name='password'
                rules={requiredField('Password')}
              />
            </Col>
          </Row>
          <div className='flex items-center justify-center'>
            <CustomButton
              type='primary'
              className=' w-[100%] h-[60px]'
              form='login-form'
              htmlType='submit'
              disabled={isLoading}
            >
              {isLoading ? 'LOADING....' : 'LOGIN'}
            </CustomButton>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Login
