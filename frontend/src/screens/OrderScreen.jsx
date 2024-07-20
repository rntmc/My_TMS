import { useParams, useNavigate } from 'react-router-dom';
import { Link  } from 'react-router-dom';
import { Row, Col, ListGroup, Form, Button, OverlayTrigger, Tooltip  } from 'react-bootstrap';
import { MdOutlineEdit, MdClose  } from "react-icons/md";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from "react-toastify";
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useGetOrderDetailsQuery, useDeleteOrCancelOrderMutation } from '../slices/ordersApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate()

  const { data: order, isLoading, error} = useGetOrderDetailsQuery(orderId);
  const [deleteOrCancelOrder, refetch] = useDeleteOrCancelOrderMutation()

  const cancelDeleteHandler = async (id) => {
    console.log(`Deleting order with id: ${id}`);
    const orderToDeleteOrCancel = order;
  
    if (!orderToDeleteOrCancel) {
      toast.error('Order not found');
      return;
    }
  
    if (orderToDeleteOrCancel.status === 'delivered' || orderToDeleteOrCancel === 'collected') {
      toast.error('Cannot delete orders marked as collected or delivered');
      return;
    }

    if (orderToDeleteOrCancel.status === 'cancelled') {
      toast.error('This order is already cancelled');
      return;
    }
  
    if (window.confirm(`Delete order ${order.orderNumber} ?`)) {
      try {
        await deleteOrCancelOrder(id);
        toast.success(`Order ${order.orderNumber} deleted`)
        navigate('/bookings')
      } catch(error) {
        console.error('Error deleting order:', error);
        toast.error(error?.data?.message || error.error)
      }
    }
  }

  const editOrderNavigator = () => {
    navigate(`/editorder/${order._id}`)
  }

  const calculateTotalWeight = (packages) => {
    return packages.reduce((total, pack) => total + pack.weight, 0);
  };

  const calculateTotalVolume = (packages) => {
    return packages.reduce((total, pack) => total + pack.volume, 0);
  };

  const totalWeight = order ? calculateTotalWeight(order.packages) : 0;
  const totalVolume = order ? calculateTotalVolume(order.packages) : 0;
  const totalFreightCost = order ? order.packages.reduce((total, pack) => total + pack.freightCost, 0) : 0;

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
          <Row className="my-2">
            <Col md={6} >
              <ListGroup style={{ fontSize: '0.875rem' }}>
                <h3>Order Number: {order.orderNumber}</h3>
              </ListGroup>
            </Col>
            <Col md={2} className="text-end">
              <div style={{ display: 'flex', flexDirection: 'row', gap: '0.25rem', justifyContent: 'flex-end' }}>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-edit-${order.orderNumber}`}>Edit</Tooltip>}
                >
                  <Button
                    style={{
                      padding: '0.3rem',
                      backgroundColor: '#a5a9ad',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onClick={() => editOrderNavigator(order._id)}
                  >
                    <MdOutlineEdit style={{ fontSize: '1rem' }} />
                  </Button>
                </OverlayTrigger>

                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-delete-${order.orderNumber}`}>Cancel/Delete</Tooltip>}
                >
                  <Button
                    style={{
                      padding: '0.3rem',
                      backgroundColor: '#a5a9ad',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onClick={() => cancelDeleteHandler(order._id)}
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
                  {`${order.origin.entityNumber} ${order.origin.entityName}`}<br />
                  {`${order.origin.entityLocation.address}`}<br /> 
                  {`${order.origin.entityLocation.city}, ${order.origin.entityLocation.state}`}<br />
                  {`${order.origin.entityLocation.postcode} - ${order.origin.entityLocation.country}`}
            </Col>
            <Col md={4}>
              <strong>Destination:</strong> <br />
                {`${order.destination.entityNumber} ${order.destination.entityName}`}<br />
                {`${order.destination.entityLocation.address}`}<br /> 
                 {`${order.destination.entityLocation.city}, ${order.destination.entityLocation.state}`}<br />
                {`${order.destination.entityLocation.postcode} - ${order.destination.entityLocation.country}`}
            </Col>
          </Row>
          <Row className='mt-2 mb-2'>    
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Volume:</strong> {totalVolume} m³
              </ListGroup.Item>
            </Col>
            <Col md={4}>
              <ListGroup.Item style={{ fontSize: '0.875rem' }}>
                <strong>Total Weight:</strong> {totalWeight} kg
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
          <Row>
            <Col md={4}>
              <strong>Dangerous goods:</strong> {order.dangerousGoods ? 'Yes' : 'No'}
            </Col>
          </Row>
          <Row className="mb-2 mt-2">
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
