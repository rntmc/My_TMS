import React, { useState } from 'react';
import { Form, Button, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCreateLoadMutation } from '../slices/loadsApiSlice';

const CreateLoadScreen = () => {
  const [loadId, setLoadId] = useState('');
  const [carrier, setCarrier] = useState('');
  const [status, setStatus] = useState('open');
  const [pickupDate, setPickupDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [originEntityNumber, setOriginEntityNumber] = useState('');
  const [originEntityName, setOriginEntityName] = useState('');
  const [originAddress, setOriginAddress] = useState('');
  const [originCity, setOriginCity] = useState('');
  const [originState, setOriginState] = useState('');
  const [originPostcode, setOriginPostcode] = useState('');
  const [originCountry, setOriginCountry] = useState('');
  const [destinationEntityNumber, setDestinationEntityNumber] = useState('');
  const [destinationEntityName, setDestinationEntityName] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [destinationState, setDestinationState] = useState('');
  const [destinationPostcode, setDestinationPostcode] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [totalVolume, setTotalVolume] = useState('');
  const [totalWeight, setTotalWeight] = useState('');
  const [totalFreightCost, setTotalFreightCost] = useState('');
  const [orders, setOrders] = useState([]);
  const [orderToAdd, setOrderToAdd] = useState('');

  const [createLoad] = useCreateLoadMutation();
  const navigate = useNavigate();

  const addOrder = () => {
    if (orderToAdd.trim() !== '') {
      setOrders([...orders, orderToAdd.trim()]);
      setOrderToAdd('');
    }
  };

  const removeOrder = (index) => {
    const updatedOrders = [...orders];
    updatedOrders.splice(index, 1);
    setOrders(updatedOrders);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const loadData = {
      loadId,
      pickupDate,
      deliveryDate,
      origin: {
        entityNumber: originEntityNumber,
        entityName: originEntityName,
        entityLocation: {
          address: originAddress,
          city: originCity,
          state: originState,
          postcode: originPostcode,
          country: originCountry,
        },
      },
      destination: {
        entityNumber: destinationEntityNumber,
        entityName: destinationEntityName,
        entityLocation: {
          address: destinationAddress,
          city: destinationCity,
          state: destinationState,
          postcode: destinationPostcode,
          country: destinationCountry,
        },
      },
      totalVolume,
      totalWeight,
      totalFreightCost,
      carrier,
      status,
      orders: orders.map((order, index) => ({
        orderId: `Order${index + 1}`,
        description: order,
        // Add more order details as needed
      })),
    };

    try {
      const data = await createLoad(loadData).unwrap();
      console.log('Load created:', data);
      navigate('/bookings');
    } catch (error) {
      console.error('Error creating load:', error);
    }
  };

  return (
    <Card>
      <Card.Body>
        <h2>Create New Load</h2>
        <Form onSubmit={submitHandler}>
          {/* Load ID and Carrier */}
          <Row>
            <Col>
              <Form.Group controlId='loadId'>
                <Form.Label>Load ID</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Load ID'
                  value={loadId}
                  onChange={(e) => setLoadId(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId='carrier'>
                <Form.Label>Carrier</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Carrier'
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Pickup Date and Delivery Date */}
          <Row>
            <Col>
              <Form.Group controlId='pickupDate'>
                <Form.Label>Pickup Date</Form.Label>
                <Form.Control
                  type='date'
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId='deliveryDate'>
                <Form.Label>Delivery Date</Form.Label>
                <Form.Control
                  type='date'
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Origin Details */}
          <h4>Origin</h4>
          <Row>
            <Col>
              <Form.Group controlId='originEntityNumber'>
                <Form.Label>Entity Number</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Entity Number'
                  value={originEntityNumber}
                  onChange={(e) => setOriginEntityNumber(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId='originEntityName'>
                <Form.Label>Entity Name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Entity Name'
                  value={originEntityName}
                  onChange={(e) => setOriginEntityName(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId='originAddress'>
            <Form.Label>Address</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter Address'
              value={originAddress}
              onChange={(e) => setOriginAddress(e.target.value)}
            />
          </Form.Group>
          <Row>
            <Col>
              <Form.Group controlId='originCity'>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter City'
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId='originState'>
                <Form.Label>State</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter State'
                  value={originState}
                  onChange={(e) => setOriginState(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId='originPostcode'>
                <Form.Label>Postcode</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Postcode'
                  value={originPostcode}
                  onChange={(e) => setOriginPostcode(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId='originCountry'>
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Country'
                  value={originCountry}
                  onChange={(e) => setOriginCountry(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Destination Details */}
          <h4>Destination</h4>
          <Row>
            <Col>
              <Form.Group controlId='destinationEntityNumber'>
                <Form.Label>Entity Number</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Entity Number'
                  value={destinationEntityNumber}
                  onChange={(e) => setDestinationEntityNumber(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId='destinationEntityName'>
                <Form.Label>Entity Name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Entity Name'
                  value={destinationEntityName}
                  onChange={(e) => setDestinationEntityName(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId='destinationAddress'>
            <Form.Label>Address</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter Address'
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
            />
          </Form.Group>
          <Row>
            <Col>
              <Form.Group controlId='destinationCity'>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter City'
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId='destinationState'>
                <Form.Label>State</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter State'
                  value={destinationState}
                  onChange={(e) => setDestinationState(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId='destinationPostcode'>
                <Form.Label>Postcode</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Postcode'
                  value={destinationPostcode}
                  onChange={(e) => setDestinationPostcode(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId='destinationCountry'>
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Country'
                  value={destinationCountry}
                  onChange={(e) => setDestinationCountry(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Orders List */}
          <h4>Orders</h4>
          <Form.Group controlId='orderToAdd'>
            <Form.Label>Add Order</Form.Label>
            <Row>
              <Col>
                <Form.Control
                  type='text'
                  placeholder='Enter Order Description'
                  value={orderToAdd}
                  onChange={(e) => setOrderToAdd(e.target.value)}
                />
              </Col>
              <Col>
                <Button variant='secondary' onClick={addOrder}>
                  Add Order
                </Button>
              </Col>
            </Row>
          </Form.Group>
          <ListGroup>
            {orders.map((order, index) => (
              <ListGroup.Item key={index}>
                {order}
                <Button
                  variant='danger'
                  size='sm'
                  className='ml-2'
                  onClick={() => removeOrder(index)}
                >
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>

          {/* Total Volume, Total Weight, Total Freight Cost */}
          <Row>
            <Col>
              <Form.Group controlId='totalVolume'>
                <Form.Label>Total Volume</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Total Volume'
                  value={totalVolume}
                  onChange={(e) => setTotalVolume(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId='totalWeight'>
                <Form.Label>Total Weight</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Total Weight'
                  value={totalWeight}
                  onChange={(e) => setTotalWeight(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Total Freight Cost and Status */}
          <Row>
            <Col>
              <Form.Group controlId='totalFreightCost'>
                <Form.Label>Total Freight Cost</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter Total Freight Cost'
                  value={totalFreightCost}
                  onChange={(e) => setTotalFreightCost(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId='status'>
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as='select'
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value='open'>Open</option>
                  <option value='in_progress'>In Progress</option>
                  <option value='completed'>Completed</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          {/* Submit Button */}
          <Button variant='primary' type='submit'>
            Create Load
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreateLoadScreen;
