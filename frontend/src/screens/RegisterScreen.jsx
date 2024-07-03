import { useState, useEffect } from "react"
import {Link, useLocation, useNavigate } from 'react-router-dom'
import {Form, Button, Row, Col} from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux"
import FormContainer from "../components/FormContainer"
import Loader from "../components/Loader"
import { useRegisterMutation } from "../slices/usersApiSlice"
import { setCredentials } from "../slices/authSlice"
import { toast } from "react-toastify"

const RegisterScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [register, {isLoading}] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth) // this info can be seen in Redux tool( in auth state, we have userInfo)

  const { search } = useLocation();
  const sp = new URLSearchParams(search) //check params in URL
  const redirect = sp.get('redirect') || '/'

  useEffect(() => { //check if we are logged in. If so, we are redirected
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate])

  const submitHandler = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return;
    } else {
      try {
        const res = await register({name, email, password}).unwrap();// call login and get the response back
        dispatch(setCredentials({...res, })) // then send that response (userInfo) into setCredentials, which will set the localStorage
        navigate(redirect)
      } catch (error) {
        toast.error(error?.data?.message || error.error)
      }
    }  
  }

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name' className="my-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type='text' placeholder='Enter name' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group controlId='email' className="my-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group controlId='password' className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group controlId='confirmPassword' className="my-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type='password' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className="mt-2" disabled={isLoading}>Register</Button>

        {isLoading && <Loader/>}
      </Form>


      <Row className='py-3'>
        <Col>
          Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login' }>Login</Link> {/*REMOVE THIS???*/}
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen