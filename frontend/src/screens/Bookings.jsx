import { useParams } from 'react-router-dom';
import { Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import Load from '../components/Load';
import Order from '../components/Order';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetLoadsQuery } from '../slices/loadsApiSlice';
import { useGetOrdersQuery } from '../slices/ordersApiSlice';

const Bookings = () => {
  const {keyword} = useParams()
  const { data: orders } = useGetOrdersQuery({ keyword: keyword || '' });
  const { data: loads, isLoading, error } = useGetLoadsQuery({ keyword: keyword || '' });

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
              <h3>Loads</h3>
            </Col>
            <Col md={2} className='d-flex justify-content-end'>
              <OverlayTrigger placement="top" overlay={<Tooltip>Create Load</Tooltip>}>
                <Link to='/createload' style={{ textDecoration: 'none' }}>
                  <Button style={{padding: '0.5rem 1rem',backgroundColor: '#677074',color: '#fff',textDecoration: 'none',display: 'flex',justifyContent: 'center',alignItems: 'center',border: 'none'}}>
                    Load
                    <IoMdAdd style={{fontSize: '1.5rem',marginLeft: '0.5rem',}} />
                  </Button>
                </Link>
              </OverlayTrigger>
            </Col>
          </Row>
          <Row>
            <Load loads={loads} />
          </Row>
          <Row className='mt-2'>
            <Col md={10}>
              <h3>Orders</h3>
            </Col>
            <Col md={2} className='d-flex justify-content-end'>
                <OverlayTrigger placement="top" overlay={<Tooltip>Create Order</Tooltip>}>
                  <Link to='/createorder' style={{ textDecoration: 'none' }}>
                    <Button style={{padding: '0.5rem 1rem',backgroundColor: '#677074',color: '#fff',textDecoration: 'none',display: 'flex', justifyContent: 'center',alignItems: 'center',border: 'none'}}>
                      Order <IoMdAdd style={{fontSize: '1.5rem',marginLeft: '0.5rem',}} />
                    </Button>
                  </Link>
                </OverlayTrigger>
              </Col>
          </Row>
          <Row>
            <Order orders={orders} />
          </Row>
        </>
      )}
    </>
  );
};

export default Bookings;
