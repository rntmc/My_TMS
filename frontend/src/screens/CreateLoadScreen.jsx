import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { useCreateLoadMutation } from '../slices/loadsApiSlice';
import { useGetOrdersQuery } from '../slices/ordersApiSlice';

const CreateLoadScreen = () => {
  const [loadId, setLoadId] = useState('');
  const [carrierName, setCarrierName] = useState('');
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
  const [transportType, setTransportType] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [driver, setDriver] = useState('');
  const [insurance, setInsurance] = useState('');
  const [storageAndTransportConditions, setStorageAndTransportConditions] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  const [createLoad, { isLoading: createLoadLoading }] = useCreateLoadMutation();
  const { data: ordersData, refetch: refetchOrders } = useGetOrdersQuery();
  const navigate = useNavigate();

  useEffect(() => {
    refetchOrders();
  }, []);

  const addOrder = () => {
    if (orderToAdd.trim() === '') {
      return;
    }
    const order = ordersData.find((o) => o.orderId === parseInt(orderToAdd));
    if (order && !orders.find((o) => o.orderId === order.orderId)) {
      setOrders([...orders, order]);
      setOrderToAdd('');
    }
  };

  const removeOrder = (orderId) => {
    const updatedOrders = orders.filter((order) => order.orderId !== orderId);
    setOrders(updatedOrders);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

  // Transform orders to an array of order IDs
    const orderIds = orders.map(order => order.orderId);
    const loadData = {
      loadId,
      status,
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
      carrierName,
      orders: orderIds,
      transportType,
      licensePlate,
      driver,
      insurance,
      storageAndTransportConditions,
      specialNotes,
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
      <Button onClick={() => navigate('/bookings')} >Back</Button>
      <Row>
        {/* Load ID and Status */}
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
            <Form.Control style={{backgroundColor: '#cdcaca5f'}}
              type='text'
              readOnly
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Pickup Date and Delivery Date */}
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
      </Row>

      {/* Origin and Destination Details */}
      <Row>
        {/* Origin Details */}
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
        <Col md={3} className='mt-3'>
        <Card className='p-3'>
          <h4>Orders</h4>
            <Form.Group controlId='orderToAdd' >
              <Form.Label>Add Order by ID</Form.Label>
              <Row >
                <Col md={6} >
                  <Form.Control 
                    type='number'
                    placeholder='Enter Order ID'
                    value={orderToAdd}
                    onChange={(e) => setOrderToAdd(e.target.value)}
                  />
                </Col>
                <Col md={6}>
                  <Button variant='primary' onClick={addOrder}>
                    Add
                  </Button>
                </Col>
            </Row>
          </Form.Group>
        </Card>
        </Col>

        <Col md={9} className='mt-3'>
          <Card className='p-3'>
            <h4>Orders in the load</h4>
            <Form.Label>Orders</Form.Label>
              <ListGroup className='d-flex flex-wrap list-group-horizontal border-0'>
                {orders.map((order) => (
                  <ListGroup.Item key={order.orderId} className='align-items-center square rounded' style={{ padding: '8px 12px' }}>
                    <Row>
                      <Col>{order.orderId}</Col>
                      <Col>
                        <Button
                          size='sm'
                          onClick={() => removeOrder(order.orderId)}
                          style={{backgroundColor:'lightgray', border:'0'}}
                        >
                        <MdDelete style={{color: 'black'}}fontSize={'16px'}/> 
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
          </Card>
        </Col>
      </Row>

      {/* Additional Load Details */}

        <Card className='p-3 mt-3'>
          <h4>Additional Details</h4>
            <Row>
              <Col md={4}>
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
              <Col md={4}>
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
              
              <Col md={4}>
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
            </Row>

            <Row>
              <Col md={3}>
                <Form.Group controlId='carrierName'>
                  <Form.Label>Carrier Name</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter Carrier Name'
                    value={carrierName}
                    onChange={(e) => setCarrierName(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={1}>
                <Form.Group controlId='transportType'>
                  <Form.Label>Type</Form.Label>
                  <Form.Control
                    as='select'
                    value={transportType}
                    onChange={(e) => setTransportType(e.target.value)}
                  >
                    <option value=''>Select Type</option>
                    <option value='LTL'>LTL</option>
                    <option value='FTL'>FTL</option>
                    <option value='MilkRun'>MilkRun</option>
                    <option value='AIR'>AIR</option>
                    <option value='Rail'>Rail</option>
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group controlId='licensePlate'>
                  <Form.Label>License Plate</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter License Plate'
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId='driver'>
                  <Form.Label>Driver</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Driver Name'
                    value={driver}
                    onChange={(e) => setDriver(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group controlId='insurance'>
                  <Form.Label>Insurance</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter Insurance'
                    value={insurance}
                    onChange={(e) => setInsurance(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>




            <Form.Group controlId='storageAndTransportConditions'>
              <Form.Label>Storage and Transport Conditions</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                placeholder='Enter Storage and Transport Conditions'
                value={storageAndTransportConditions}
                onChange={(e) =>
                  setStorageAndTransportConditions(e.target.value)
                }
              />
            </Form.Group>

            <Form.Group controlId='specialNotes'>
              <Form.Label>Special Notes</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                placeholder='Enter Special Notes'
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
              />
            </Form.Group>
          </Card>

      {/* Submit Button */}
      <Row className='mt-4'>
        <Col>
          <Button type='submit' variant='primary' disabled={createLoadLoading}>
            {createLoadLoading ? 'Creating...' : 'Create Load'}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default CreateLoadScreen;
