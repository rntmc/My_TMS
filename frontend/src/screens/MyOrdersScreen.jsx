import {Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import {useSelector} from 'react-redux'
import { Link, useParams } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message'
import Order from '../components/Order';

const MyOrdersScreen = () => {
  const {userInfo} = useSelector(state=> state.auth)
  const {keyword} = useParams()

  const { data: orders, isLoading, error } = useGetMyOrdersQuery({ keyword: keyword || '' });

  return (
<>
    {isLoading ? (
      <Loader />
    ) : error ? (
      <Message variant='danger'>
        {error?.data?.message || error.error}
      </Message>
    ) : (
      <>
        <Row>
          <Col md={10}>
            <h2>My Orders</h2>
          </Col>
          {userInfo.role === 'User' || userInfo.role === 'Admin' ? (
            <Col md={2} className='d-flex justify-content-end'>
              <OverlayTrigger placement="top" overlay={<Tooltip>Create Order</Tooltip>}>
                <Link to='/createorder' style={{ textDecoration: 'none' }}>
                  <Button style={{padding: '0.5rem 1rem',backgroundColor: '#677074',color: '#fff',textDecoration: 'none',display: 'flex',justifyContent: 'center',alignItems: 'center',border: 'none'}}>
                    Order
                    <IoMdAdd style={{fontSize: '1.5rem',marginLeft: '0.5rem',}} />
                  </Button>
                </Link>
              </OverlayTrigger>
              </Col>
          ) : ''}
          </Row>
          <Row>
            <Order orders={orders} />
        </Row>
      </>
    )}
  </>
);
};

export default MyOrdersScreen;


