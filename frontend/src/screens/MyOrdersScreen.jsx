import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';
import Loader from '../components/Loader';
import Message from '../components/Message'
import Order from '../components/Order';

const MyOrdersScreen = () => {

  const { data: orders, isLoading, isError, error, refetch } = useGetMyOrdersQuery();

  return (
    <Row>
      <Col>
        <h2>My orders</h2>
          {isLoading ? (
            <Loader/>
           ) : isError ? (<Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
        ) : (
          <Order orders={orders}/>
        )}
      </Col>
    </Row>
  );
};

export default MyOrdersScreen;
