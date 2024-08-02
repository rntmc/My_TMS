import { useState } from 'react';
import {useSelector} from 'react-redux'
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Form, Button, ListGroup, OverlayTrigger, Tooltip, Collapse  } from 'react-bootstrap';
import { MdOutlineEdit, MdClose, MdExpandMore, MdExpandLess } from "react-icons/md";
import { FaDownload } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from "react-toastify";
import Loader from '../components/Loader'
import Message from '../components/Message'
import LogHistory from '../components/LogHistory';
import { useGetOrderDetailsQuery, useDeleteOrCancelOrderMutation } from '../slices/ordersApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const {userInfo} = useSelector(state=> state.auth)
  const [openDocuments, setOpenDocuments] = useState(false);

  const navigate = useNavigate()

  const { data: order, isLoading, error, refetch} = useGetOrderDetailsQuery(orderId);
  const [deleteOrCancelOrder] = useDeleteOrCancelOrderMutation()  

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
        refetch();
        if(userInfo.role === "Admin") {
          navigate('/bookings')
        } else {
          navigate('/myorders')
        }
      } catch(error) {
        console.error('Error deleting order:', error);
        toast.error(error?.data?.message || error.error)
      }
    }
  }

  const downloadDocumentsHandler = (documents) => {
    documents.forEach((doc) => {
      if (doc.url) {
        const link = document.createElement('a');
        link.href = doc.url;
        link.download = doc.name;
        link.style.display = 'none'; // Hide the link
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error(`Document URL not found for ${doc.name}`);
      }
    });
  };

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

  const totalDocuments = order?.document?.length || 0;

  return (
    <>
      <Row>
        <Col md={12}>
          {userInfo.role === 'Admin' ? (
            <Link className='btn btn-light my-3' to='/bookings'>
              Return
            </Link>
          ) : (
            <Link className='btn btn-light my-3' to='/myorders'>
              Return
            </Link>
          )}
        </Col>
      </Row>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Row>
            <Col md={12}>
              <Card className="order-card mb-3">
                <Card.Header>
                  <Row>
                    <Col md={6} style={{marginBottom: '0.25rem'}}>
                      <h3 style={{marginBottom: '0.2rem'}}>Order Number: {order.orderNumber}</h3>
                      <strong>Status:</strong> {order.status}
                    </Col>
                    <Col md={3}>
                    </Col>
                    {(order.status === 'open' && userInfo.role === 'User') || (userInfo.role === 'Admin') ? (
                      <Col md={3} className="text-end">
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
                    ) : ("")}
                  </Row>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-1">
                    <Col md={6} >
                      <strong>Collection Date:</strong><br />
                      {order.pickupDate ? (
                        <DatePicker selected={new Date(order.pickupDate)} readOnly dateFormat="Pp" />
                      ) : 'N/A'}
                    </Col>
                    <Col md={6}>
                      <strong>Delivery Date:</strong><br />
                      {order.deliveryDate ? (
                        <DatePicker selected={new Date(order.deliveryDate)} readOnly dateFormat="Pp" />
                      ) : 'N/A'}
                    </Col>
                  </Row>

                  <Row className="mb-1">
                    <Col md={6}>
                      <strong>Origin:</strong><br />
                      {`${order.origin.entityNumber} ${order.origin.entityName}`}<br />
                      {`${order.origin.entityLocation.address}`}<br />
                      {`${order.origin.entityLocation.city}, ${order.origin.entityLocation.state}`}<br />
                      {`${order.origin.entityLocation.postcode} - ${order.origin.entityLocation.country}`}
                    </Col>
                    <Col md={6}>
                      <strong>Destination:</strong><br />
                      {`${order.destination.entityNumber} ${order.destination.entityName}`}<br />
                      {`${order.destination.entityLocation.address}`}<br />
                      {`${order.destination.entityLocation.city}, ${order.destination.entityLocation.state}`}<br />
                      {`${order.destination.entityLocation.postcode} - ${order.destination.entityLocation.country}`}
                    </Col>
                  </Row>

                  <Row className="mb-1">
                    <Col md={6}>
                      <strong>Volume:</strong> {totalVolume.toFixed(2)} m³
                    </Col>
                    <Col md={6}>
                      <strong>Total Weight:</strong> {totalWeight.toFixed(2)} kg
                    </Col>
                  </Row>

                  <Row className="mb-1">
                    <Col md={6}>
                      <strong>Distance:</strong> {order.distance.toFixed(0)} km
                    </Col>
                    <Col md={6}>
                      <strong>Freight Cost:</strong> $ {order.freightCost.toFixed(2) || 'N/A'}
                    </Col>
                  </Row>

                  <Row className="mb-1">
                    <Col md={6}>
                      <strong>Dangerous Goods:</strong> {order.dangerousGoods ? 'Yes' : 'No'}
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col md={12}>
                      <strong>Special Notes:</strong>
                      <Form.Control as="textarea" rows={3} defaultValue={order.specialNotes || ''} readOnly />
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col md={12}>
                      <Card>
                        <Card.Body>
                          <Card.Title>
                            <Button
                              variant="link"
                              onClick={() => setOpenDocuments(!openDocuments)}
                              aria-controls="documents-collapse"
                              aria-expanded={openDocuments}
                              style={{ textDecoration: 'none' }}
                            >
                              Documents {totalDocuments > 0 && `(${totalDocuments})`} 
                              {openDocuments ? <MdExpandLess /> : <MdExpandMore />}
                            </Button>
                          </Card.Title>
                          <Collapse in={openDocuments}>
                            <div id="documents-collapse">
                              <ListGroup>
                                {order.document && order.document.length > 0 ? (
                                  order.document.map((doc, index) => (
                                    <ListGroup.Item key={index}>
                                      <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{doc.name}</a>
                                      <Button
                                        variant="outline-primary"
                                        onClick={() => downloadDocumentsHandler([doc])}
                                        style={{ marginLeft: '1rem' }}
                                      >
                                        <FaDownload /> Download
                                      </Button>
                                    </ListGroup.Item>
                                  ))
                                ) : (
                                  <ListGroup.Item>No documents available.</ListGroup.Item>
                                )}
                              </ListGroup>
                            </div>
                          </Collapse>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <LogHistory trackingInfo={order.trackingInfo} />
        </>
      )}
    </>
  );
};

export default OrderScreen;
