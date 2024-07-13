import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import { useUpdateUserMutation, useGetUserProfileQuery } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import Loader from '../components/Loader';

const DatabaseUserEditScreen = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const {data: user, isLoading, isError, refetch} = useGetUserProfileQuery(userId);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('')

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setRole(user.role || '')
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const updatedUser = await updateUser({
        userId,
        name,
        email,
        role,
      }).unwrap();

      // Verifica se o usuário atualizado é o mesmo que está logado
      if (userInfo && user && userInfo._id === user._id) {
        dispatch(setCredentials(updatedUser));
      }

      toast.success('Profile updated successfully');
      refetch();
      navigate('/database/users')
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <p>Error loading user profile</p>;
  }

  return (
    <Row>
      <Col md={6}>
        <h2>User Profile</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name' className='my-2'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='email' className='my-2'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder={'Enter email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='role' className='my-2'>
            <Form.Label>Confirm Role</Form.Label>
            <Form.Control
              as='select'
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Admin">Admin</option>
              <option value="User">User</option>
              <option value="Carrier">Carrier</option>
            </Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' className='my-2'>
            Update User
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default DatabaseUserEditScreen;
