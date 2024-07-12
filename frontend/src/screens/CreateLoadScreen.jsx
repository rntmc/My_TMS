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
      setOrders([...orders, {description: orderToAdd.trim(), isChecked:false}]);
      setOrderToAdd('');
    }
  };

  const removeCheckedOrders = () => {
    const updatedOrders = orders.filter((order) => !order.isChecked);
    setOrders(updatedOrders);
  };

  const toggleOrderCheck = (index) => {
    const updatedOrders = [...orders];
    updatedOrders[index].isChecked = !updatedOrders[index].isChecked;
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
        description: order.description,
        isChecked: order.isChecked,
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
 
    <Form onSubmit={submitHandler}>
      <Row>
        <Col md={3}>
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
        <Col md={3}>
          <Form.Group controlId='status'>
            <Form.Label>Status</Form.Label>
            <Form.Control
              type='text'
              placeholder='status'
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={3}>
          <Form.Group controlId='pickupDate'>
            <Form.Label>Pickup Date</Form.Label>
            <Form.Control
              type='date'
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId='deliveryDate'>
            <Form.Label>Delivery Date</Form.Label>
            <Form.Control
              type='date'
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId='carrier'>
            <Form.Label>Carrier</Form.Label>
            <Form.Control
              type='text'
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>

      <Col md={6}>
        <Card className='mt-3 p-4'>
        <h4>Origin</h4>
          <Row>
            <Col md={4}>
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
            <Col md={8}>
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
            <Col md={8}>
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
            <Col md={4}>
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
            <Col md={8}>
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
            <Col md={4}>
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
        </Card>
      </Col>
      
      {/* Destination Details */}
      <Col md={6}>
        <Card className='mt-3 p-4'>
        <h4>Destination</h4>
          <Row>
            <Col md={4}>
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
            <Col md={8}>
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
            <Col md={8}>
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
            <Col md={4}>
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
            <Col md={8}>
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
            <Col md={4}>
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
        </Card>
      </Col>
      </Row>

    {/* Orders List */}
      <Row>
      <Col md={3}>
        <Card className='mt-3 p-4'>
          <h4>Add Orders</h4>
          <Form.Group controlId='orderToAdd' className='mb-0'>
            <Form.Control
              type='number'
              placeholder='Enter Order Number'
              value={orderToAdd}
              onChange={(e) => setOrderToAdd(e.target.value)}
              className='mb-0'
            />
          </Form.Group>
          <Button variant='primary' className='mt-3' onClick={addOrder}>
            Add
          </Button>
        </Card>
      </Col>

      <Col md={9}>
        <Card className='mt-3 p-4 '>
          <h4>Orders List</h4>
          <ListGroup className='d-flex flex-wrap list-group-horizontal border-0'>
            {orders.map((order, index) => (
              <Col md={2} >
                <ListGroup.Item
                  key={index}
                  className='align-items-center square rounded'
                  style={{ padding: '10px 15px' }}
                >
                  <Form.Check
                    type='checkbox'
                    label={order.description}
                    checked={order.isChecked}
                    onChange={() => toggleOrderCheck(index)}
                    className='mb-0'
                  />
                </ListGroup.Item>
              </Col>
            ))}
          </ListGroup>
          <Button
            variant='danger'
            className='mt-3'
            onClick={removeCheckedOrders}
            disabled={orders.every((order) => !order.isChecked)}
          >
            Remove Checked
          </Button>
        </Card>
      </Col>
    </Row>

        <Row>
          <Col md={2}>
            <Button variant='primary' type='submit' className='mt-2'>
              Create Load
            </Button>
          </Col>
        </Row>

          {/* Submit Button */}
      </Form>
  );
};

export default CreateLoadScreen;
