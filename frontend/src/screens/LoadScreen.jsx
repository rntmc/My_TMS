import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Card, Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MdOutlineEdit, MdClose  } from "react-icons/md";
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useGetLoadDetailsQuery } from '../slices/loadsApiSlice';

const LoadScreen = () => {
  const { id: loadId } = useParams();

  const { data: load, isLoading, error} = useGetLoadDetailsQuery(loadId);
  console.log(load)

  return (
    <>
      <Link className='btn btn-light my-3' to='/bookings'>
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
        <Row className="my-3">
          <Col md={6}>
            <ListGroup style={{ fontSize: '0.875rem' }}>
              <h3>Load Number: {load.loadNumber}</h3>
            </ListGroup>
            </Col>
            <Col md={2} className="text-end">
              <div style={{ display: 'flex', flexDirection: 'row', gap: '0.25rem', justifyContent: 'flex-end' }}>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-edit-${load.loadNumber}`}>Editar</Tooltip>}
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
                  overlay={<Tooltip id={`tooltip-delete-${load.loadNumber}`}>Cancelar</Tooltip>}
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
          <Row className="mb-3">
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Collection Date:</strong> {load.pickupDate ? (
                  <DatePicker selected={new Date(load.pickupDate)} readOnly dateFormat="Pp" />
                ) : 'N/A'}
              </ListGroup.Item>
            </Col>
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Delivery Date:</strong> {load.deliveryDate ? (
                  <DatePicker selected={new Date(load.deliveryDate)} readOnly dateFormat="Pp" />
                ) : 'N/A'}
              </ListGroup.Item>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <strong>Origin:</strong> <br />
                {`${load.origin.entityNumber} ${load.origin.entityName}`}<br />
                {`${load.origin.entityLocation.address}`}<br /> 
                {`${load.origin.entityLocation.city}, ${load.origin.entityLocation.state}`}<br />
                {`${load.origin.entityLocation.postcode} - ${load.origin.entityLocation.country}`}
            </Col>
            <Col md={4}>
              <strong>Destination:</strong> <br />
                {`${load.destination.entityNumber} ${load.destination.entityName}`}<br />
                {`${load.destination.entityLocation.address}`}<br /> 
                {`${load.destination.entityLocation.city}, ${load.destination.entityLocation.state}`}<br />
                {`${load.destination.entityLocation.postcode} - ${load.destination.entityLocation.country}`}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Carrier:</strong> {load.carrierName || 'N/A'}
              </ListGroup.Item>
            </Col>
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Transport Type:</strong> {load.transportType || 'N/A'}
              </ListGroup.Item>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Orders Included:</strong> {load.orders.map((order, index) => (
                  <span key={index}>
                    <Link to={`/load/${order._id}`}>{order.orderNumber}</Link>
                    {index !== load.orders.length - 1 && ', '}
                  </span>
                ))}
              </ListGroup.Item>
            </Col>
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Freight Cost:</strong> $ {load.totalFreightCost || 'N/A'}
              </ListGroup.Item>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Total Volume:</strong> {load.totalVolume || 'N/A'} m³
              </ListGroup.Item>
            </Col>
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Total Weight:</strong> {load.totalWeight || 'N/A'} kg
              </ListGroup.Item>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>License Plate:</strong> {load.licensePlate || 'N/A'}
              </ListGroup.Item>
            </Col>
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Driver:</strong> {load.driver || 'N/A'}
              </ListGroup.Item>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Insurance:</strong> {load.insurance || 'N/A'}
              </ListGroup.Item>
            </Col>
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Storage and Transport Conditions:</strong> {load.storageAndTransportConditions || 'N/A'}
              </ListGroup.Item>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Special Notes:</strong>
              </ListGroup.Item>
            </Col>
          </Row>
        <Row className="mb-3">
          <Col md={8}>
            <ListGroup.Item style={{ fontSize: '0.875rem' }}>
              <Form.Control as="textarea" rows={3} defaultValue={load.specialNotes || ''} readOnly />
            </ListGroup.Item>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <ListGroup.Item style={{ fontSize: '0.875rem' }}>
              <strong>Status:</strong> {load.status || 'N/A'}
            </ListGroup.Item>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={8}>
            <Card className='my-3'>
              <Card.Header>Tracking History</Card.Header>
              <Card.Body>
                <ListGroup variant='flush'>
                  {load.trackingInfo && load.trackingInfo.history.length > 0 ? (
                    load.trackingInfo.history.map((event, index) => (
                      <ListGroup.Item key={index} style={{ fontSize: '0.875rem' }}>
                        <strong>Location:</strong> {event.location} <br />
                        <strong>Timestamp:</strong> {new Date(event.timestamp).toLocaleString()}
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item style={{ fontSize: '0.875rem' }}>No tracking history available</ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        </>  
      )}   
    </>
  );
};

export default LoadScreen;
