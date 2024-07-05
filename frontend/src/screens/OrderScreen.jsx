import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Form, Button, OverlayTrigger, Tooltip  } from 'react-bootstrap';
import { MdOutlineEdit, MdClose  } from "react-icons/md";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useGetOrderDetailsQuery } from '../slices/ordersApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const { data: order, isLoading, error} = useGetOrderDetailsQuery(orderId);
  console.log(order)

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Return
      </Link>

      {isLoading ? (
        <Loader/>
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Row className="my-2">
            <Col md={6} >
              <ListGroup style={{ fontSize: '0.875rem' }}>
                <h3>Order Number: {order.orderId}</h3>
              </ListGroup>
            </Col>
            <Col md={2} className="text-end">
              <div style={{ display: 'flex', flexDirection: 'row', gap: '0.25rem', justifyContent: 'flex-end' }}>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-edit-${order.orderId}`}>Editar</Tooltip>}
                >
                  <Button
                    style={{
                      padding: '0.3rem',
                      backgroundColor: '#a5a9ad',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <MdOutlineEdit style={{ fontSize: '1rem' }} />
                  </Button>
                </OverlayTrigger>

                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-delete-${order.orderId}`}>Cancelar</Tooltip>}
                >
                  <Button
                    style={{
                      padding: '0.3rem',
                      backgroundColor: '#a5a9ad',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <MdClose style={{ fontSize: '1rem', color: 'red' }} />
                  </Button>
                </OverlayTrigger>
              </div>
            </Col>
          </Row>
        <Row className='mb-2'>
          <Col md={4}>
            <ListGroup.Item style={{ fontSize: '0.875rem' }}>
              <strong>Status:</strong> {order.status || 'N/A'}
            </ListGroup.Item>
          </Col>
        </Row>
          <Row className="mb-2">
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Collection Date:</strong> {order.pickupDate ? (
                  <DatePicker selected={new Date(order.pickupDate)} readOnly dateFormat="Pp" />
                ) : 'N/A'}
              </ListGroup.Item>
            </Col>
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Delivery Date:</strong> {order.deliveryDate ? (
                  <DatePicker selected={new Date(order.deliveryDate)} readOnly dateFormat="Pp" />
                ) : 'N/A'}
              </ListGroup.Item>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
                <strong>Origin:</strong> <br />
                  {`${order.origin.supplierNumber} ${order.origin.supplierName}`}<br />
                  {`${order.origin.supplierLocation.address}`}<br /> 
                  {`${order.origin.supplierLocation.city}, ${order.origin.supplierLocation.state}`}<br />
                  {`${order.origin.supplierLocation.postcode} - ${order.origin.supplierLocation.country}`}
            </Col>
            <Col md={4}>
              <strong>Destination:</strong> <br />
                {`${order.destination.plantNumber} ${order.destination.plantName}`}<br />
                {`${order.destination.plantLocation.address}`}<br /> 
                 {`${order.destination.plantLocation.city}, ${order.destination.plantLocation.state}`}<br />
                {`${order.destination.plantLocation.postcode} - ${order.destination.plantLocation.country}`}
            </Col>
          </Row>
          <Row className='mt-2 mb-2'>    
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Total Volume:</strong> {order.volume || 'N/A'} m³
              </ListGroup.Item>
            </Col>
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Total Weight:</strong> {order.weight || 'N/A'} kg
              </ListGroup.Item>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Carrier:</strong> {order.carrier || 'N/A'}
              </ListGroup.Item>
            </Col>
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Transport Type:</strong> {'N/A'}
              </ListGroup.Item>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Distance:</strong> {'N/A'} km
              </ListGroup.Item>
            </Col>
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Freight Cost:</strong> $ {order.freightCost || 'N/A'}
              </ListGroup.Item>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Special Notes:</strong>
              </ListGroup.Item>
            </Col>
          </Row>
        <Row className="mb-3">
          <Col md={8}>
            <ListGroup.Item style={{ fontSize: '0.875rem' }}>
              <Form.Control as="textarea" rows={3} defaultValue={order.specialNotes || ''} readOnly />
            </ListGroup.Item>
          </Col>
        </Row>
        </>  
      )}   
    </>
  );
};

export default OrderScreen;
