import {Row, Col } from 'react-bootstrap';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message'
import Order from '../components/Order';

const MyOrdersScreen = () => {

  const { data: orders, isLoading, isError, error } = useGetMyOrdersQuery();

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
