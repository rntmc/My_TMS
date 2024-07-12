import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Card, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useGetLoadDetailsQuery } from '../slices/loadsApiSlice';

const LoadScreen = () => {
  const { id: loadId } = useParams();

  const { data: load, isLoading, error} = useGetLoadDetailsQuery(loadId);
  console.log(load)

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
        <Row className="my-3">
            <ListGroup style={{ fontSize: '0.875rem' }}>
              <h3>Load Number: {load.loadId}</h3>
            </ListGroup>
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
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Origin:</strong> {`${load.origin.address}, ${load.origin.city}, ${load.origin.state}`}
              </ListGroup.Item>
            </Col>
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Destination:</strong> {`${load.destination.address}, ${load.destination.city}, ${load.destination.state}`}
              </ListGroup.Item>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Carrier:</strong> {load.carrierNumber || 'N/A'} {load.carrierName || 'N/A'}
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
                    <Link to={`/load/${order}`}>{order}</Link>
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
                <strong>Total Volume:</strong> {load.totalVolume || 'N/A'}
              </ListGroup.Item>
            </Col>
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Total Weight:</strong> {load.totalWeight || 'N/A'}
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
