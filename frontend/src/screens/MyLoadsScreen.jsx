import { useParams, useLocation } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { useGetMyLoadsQuery } from '../slices/loadsApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message'
import Load from '../components/Load';
import Paginate from '../components/Paginate';

const MyLoadsScreen = () => {
  const {keyword, pageNumber = 1} = useParams()
  const location = useLocation();

  const { data: loadsData, isLoading: isLoadsLoading, error: loadsError } = useGetMyLoadsQuery({ keyword: keyword || '', pageNumber });
  const { data: ordersData, isLoading: isOrdersLoading, error: ordersError } = useGetMyOrdersQuery({ keyword: keyword || '' });

  const loads = loadsData?.loads || [];
  const page = loadsData?.page || 1;
  const pages = loadsData?.pages || 1;

  const orders = ordersData?.orders || [];

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
        <Row>
          <Paginate pages={pages} page={page} role="User" keyword={keyword} currentPath={location.pathname} />
        </Row>
      </>
    )}
  </>
);
};

export default MyLoadsScreen;
