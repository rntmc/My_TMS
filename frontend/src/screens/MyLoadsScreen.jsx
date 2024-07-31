import { Row, Col } from 'react-bootstrap';
import { useGetMyLoadsQuery } from '../slices/loadsApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message'
import Load from '../components/Load';

const MyLoadsScreen = () => {
  const { data: loads, isLoading: isLoadsLoading, error: loadsError } = useGetMyLoadsQuery();
  const { data: orders, isLoading: isOrdersLoading, error: ordersError } = useGetMyOrdersQuery();

  let filteredLoads = []; //use this to avoid the "some" undefined error

  if (loads && orders) {
    filteredLoads = loads.filter(load => 
      load.orders.some(order => orders.some(userOrder => userOrder._id === order._id))
    );
  }

  return (
    <>
    {isLoadsLoading || isOrdersLoading ? (
      <Loader />
    ) : loadsError ||  ordersError ? (
      <Message variant='danger'>
        {loadsError?.data?.message || ordersError?.data?.message || loadsError.error || ordersError.error}
      </Message>
    ) : (
      <>
        <Row>
          <Col md={10}>
            <h2>My Loads</h2>
          </Col>
          </Row>
          <Row>
            <Load loads={filteredLoads} />
        </Row>
      </>
    )}
  </>
);
};

export default MyLoadsScreen;
