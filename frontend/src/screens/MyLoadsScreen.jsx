import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyLoadsQuery } from '../slices/loadsApiSlice';
import { setCredentials } from '../slices/authSlice';
import Loader from '../components/Loader';
import Message from '../components/Message'
import Load from '../components/Load';

const MyLoadsScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  
  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, {isLoading, isError, refetch}] = useProfileMutation();

  const {data: loads, error} = useGetMyLoadsQuery()

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const updatedFields = {};
      if (name !== userInfo.name) updatedFields.name = name;
      if (email !== userInfo.email) updatedFields.email = email;
      if (password) updatedFields.password = password;

      const updatedUser = await updateProfile(updatedFields).unwrap();
      dispatch(setCredentials(updatedUser));
      toast.success('Profile updated successfully');
      refetch();
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
      <Col>
        <h2>My Loads</h2>
          {isLoading ? (
            <Loader/>
           ) : error ? (<Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
        ) : (
          <Load/>
        )}
      </Col>
    </Row>
  );
};

export default MyLoadsScreen;
