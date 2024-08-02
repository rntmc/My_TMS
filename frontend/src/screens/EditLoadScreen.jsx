import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { useGetLoadDetailsQuery, useUpdateLoadMutation } from '../slices/loadsApiSlice';
import { useGetOrdersQuery } from '../slices/ordersApiSlice';
import { useGetEntityByNumberQuery } from '../slices/entitiesApiSlice';

const EditLoadScreen = () => {
  const { id: loadId } = useParams();
  const [loadNumber, setLoadNumber] = useState('');
  const [carrierName, setCarrierName] = useState('');
  const [status, setStatus] = useState('');
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
  const [totalVolume, setTotalVolume] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalFreightCost, setTotalFreightCost] = useState(0);
  const [orders, setOrders] = useState([]);
  const [orderToAdd, setOrderToAdd] = useState('');
  const [transportType, setTransportType] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [driver, setDriver] = useState('');
  const [insurance, setInsurance] = useState('');
  const [storageAndTransportConditions, setStorageAndTransportConditions] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  const { data: loadDetails, refetch: refetchLoadDetails } = useGetLoadDetailsQuery(loadId);
  const { data: ordersData, refetch: refetchOrders } = useGetOrdersQuery();
  const [updateLoad, { isLoading: updateLoadLoading }] = useUpdateLoadMutation();
  const navigate = useNavigate();

  // Fetch entity details for origin and destination
  const { data: originEntity, isFetching: isFetchingOriginEntity } = useGetEntityByNumberQuery(originEntityNumber);
  const { data: destinationEntity, isFetching: isFetchingDestinationEntity } = useGetEntityByNumberQuery(destinationEntityNumber);

  useEffect(() => {
    if (loadDetails) {
      setLoadNumber(loadDetails.loadNumber);
      setCarrierName(loadDetails.carrierName);
      setStatus(loadDetails.status);
      setPickupDate(loadDetails.pickupDate ? loadDetails.pickupDate.split('T')[0] : '');
      setDeliveryDate(loadDetails.deliveryDate ? loadDetails.deliveryDate.split('T')[0] : '');
      setOriginEntityNumber(loadDetails.origin.entityNumber);
      setOriginEntityName(loadDetails.origin.entityName);
      setOriginAddress(loadDetails.origin.entityLocation.address);
      setOriginCity(loadDetails.origin.entityLocation.city);
      setOriginState(loadDetails.origin.entityLocation.state);
      setOriginPostcode(loadDetails.origin.entityLocation.postcode);
      setOriginCountry(loadDetails.origin.entityLocation.country);
      setDestinationEntityNumber(loadDetails.destination.entityNumber);
      setDestinationEntityName(loadDetails.destination.entityName);
      setDestinationAddress(loadDetails.destination.entityLocation.address);
      setDestinationCity(loadDetails.destination.entityLocation.city);
      setDestinationState(loadDetails.destination.entityLocation.state);
      setDestinationPostcode(loadDetails.destination.entityLocation.postcode);
      setDestinationCountry(loadDetails.destination.entityLocation.country);
      setTotalVolume(loadDetails.totalVolume);
      setTotalWeight(loadDetails.totalWeight);
      setTotalFreightCost(loadDetails.totalFreightCost);
      setOrders(loadDetails.orders);
      setTransportType(loadDetails.transportType);
      setLicensePlate(loadDetails.licensePlate);
      setDriver(loadDetails.driver);
      setInsurance(loadDetails.insurance);
      setStorageAndTransportConditions(loadDetails.storageAndTransportConditions);
      setSpecialNotes(loadDetails.specialNotes);
    }
  }, [loadDetails]);

  useEffect(() => {
    if (originEntity) {
      setOriginEntityName(originEntity.name);
      setOriginAddress(originEntity.location.address);
      setOriginCity(originEntity.location.city);
      setOriginState(originEntity.location.state);
      setOriginPostcode(originEntity.location.postcode);
      setOriginCountry(originEntity.location.country);
    }
  }, [originEntity]);

  useEffect(() => {
    if (destinationEntity) {
      setDestinationEntityName(destinationEntity.name);
      setDestinationAddress(destinationEntity.location.address);
      setDestinationCity(destinationEntity.location.city);
      setDestinationState(destinationEntity.location.state);
      setDestinationPostcode(destinationEntity.location.postcode);
      setDestinationCountry(destinationEntity.location.country);
    }
  }, [destinationEntity]);

  useEffect(() => {
    refetchLoadDetails();
    refetchOrders();
  }, []);

  useEffect(() => {
    calculateTotals(orders);
  }, [orders]);

  const calculateTotals = (orders) => {
    let totalWeight = 0;
    let totalVolume = 0;
    let totalFreightCost = 0; // Inicializar totalFreightCost como 0

    orders.forEach(order => {
      order.packages.forEach(pkg => {
        totalWeight += pkg.weight;
        totalVolume += pkg.volume;
      });
      
      totalFreightCost += order.freightCost; // Adicionar totalFreightCost de cada order
    });

    setTotalWeight(totalWeight);
    setTotalVolume(totalVolume);
    setTotalFreightCost(totalFreightCost); // Definir totalFreightCost calculado
  };

  const addOrder = () => {
    if (orderToAdd.trim() === '') {
      return;
    }
    const order = ordersData.find((o) => o.orderNumber === parseInt(orderToAdd));
    if (order && !orders.find((o) => o.orderNumber === order.orderNumber)) {
      const updatedOrders = [...orders, order];
      setOrders(updatedOrders);
      calculateTotals(updatedOrders);
      setOrderToAdd('');
    }
  };

  const removeOrder = (orderNumber) => {
    const updatedOrders = orders.filter((order) => order.orderNumber !== orderNumber);
    setOrders(updatedOrders);
    calculateTotals(updatedOrders);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const loadData = {
      loadNumber,
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
      orders: orders.map(order => order.orderNumber),
      transportType,
      licensePlate,
      driver,
      insurance,
      storageAndTransportConditions,
      specialNotes,
    };


    try {
      const data = await updateLoad({ loadId, ...loadData }).unwrap();
      console.log('Load updated:', data);
      setOrders([]);
      navigate('/bookings');
    } catch (error) {
      console.error('Error updating load:', error);
    }
  };

  return (
    <Form onSubmit={submitHandler}>
      <Button onClick={() => navigate(`/bookings`)}>Back</Button>
      <Row>
        <Col md={3}>
          <Form.Group controlId='loadNumber'>
            <Form.Label>Load ID</Form.Label>
            <Form.Control style={{backgroundColor: '#cdcaca5f'}}
              type='text'
              placeholder='Enter Load ID'
              value={loadNumber}
              readOnly
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId='status'>
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value='open'>Open</option>
              <option value='confirmed'>Confirmed</option>
              <option value='collected'>Collected</option>
              <option value='delivered'>Delivered</option>
              <option value='cancelled'>Cancelled</option>
            </Form.Select>
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
                  <Form.Control style={{backgroundColor: '#cdcaca5f'}}
                    type='text'
                    placeholder='Enter Entity Name'
                    value={originEntityName}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId='originAddress'>
              <Form.Label>Address</Form.Label>
              <Form.Control style={{backgroundColor: '#cdcaca5f'}}
                type='text'
                placeholder='Enter Address'
                value={originAddress}
                readOnly
              />
            </Form.Group>
            <Row>
              <Col md={8}>
                <Form.Group controlId='originCity'>
                  <Form.Label>City</Form.Label>
                  <Form.Control style={{backgroundColor: '#cdcaca5f'}}
                    type='text'
                    placeholder='Enter City'
                    value={originCity}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId='originState'>
                  <Form.Label>State</Form.Label>
                  <Form.Control style={{backgroundColor: '#cdcaca5f'}}
                    type='text'
                    placeholder='Enter State'
                    value={originState}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group controlId='originPostcode'>
                  <Form.Label>Postcode</Form.Label>
                  <Form.Control style={{backgroundColor: '#cdcaca5f'}}
                    type='text'
                    placeholder='Enter Postcode'
                    value={originPostcode}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group controlId='originCountry'>
                  <Form.Label>Country</Form.Label>
                  <Form.Control style={{backgroundColor: '#cdcaca5f'}}
                    type='text'
                    placeholder='Enter Country'
                    value={originCountry}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>
        </Col>

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
                  <Form.Control style={{backgroundColor: '#cdcaca5f'}}
                    type='text'
                    placeholder='Enter Entity Name'
                    value={destinationEntityName}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId='destinationAddress'>
              <Form.Label>Address</Form.Label>
              <Form.Control style={{backgroundColor: '#cdcaca5f'}}
                type='text'
                placeholder='Enter Address'
                value={destinationAddress}
                readOnly
              />
            </Form.Group>
            <Row>
              <Col md={8}>
                <Form.Group controlId='destinationCity'>
                  <Form.Label>City</Form.Label>
                  <Form.Control style={{backgroundColor: '#cdcaca5f'}}
                    type='text'
                    placeholder='Enter City'
                    value={destinationCity}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId='destinationState'>
                  <Form.Label>State</Form.Label>
                  <Form.Control style={{backgroundColor: '#cdcaca5f'}}
                    type='text'
                    placeholder='Enter State'
                    value={destinationState}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group controlId='destinationPostcode'>
                  <Form.Label>Postcode</Form.Label>
                  <Form.Control style={{backgroundColor: '#cdcaca5f'}}
                    type='text'
                    placeholder='Enter Postcode'
                    value={destinationPostcode}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group controlId='destinationCountry'>
                  <Form.Label>Country</Form.Label>
                  <Form.Control style={{backgroundColor: '#cdcaca5f'}}
                    type='text'
                    placeholder='Enter Country'
                    value={destinationCountry}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={3} className='mt-3'>
        <Card className='p-3'>
          <h4>Order Management</h4>
            <Form.Group controlId='orderToAdd' >
              <Form.Label>Add Order Number</Form.Label>
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
                  <ListGroup.Item key={order._id} className='align-items-center square rounded' style={{ padding: '8px 12px' }}>
                    <Row>
                      <Col>{order.orderNumber}</Col>
                      <Col>
                        <Button
                          size='sm'
                          onClick={() => removeOrder(order.orderNumber)}
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

      <Card className='p-3 mt-3'>
          <h4>Additional Details</h4>
            <Row>
              <Col md={4}>
                <Form.Group controlId='totalVolume'>
                  <Form.Label>Total Volume (m³)</Form.Label>
                  <Form.Control style={{backgroundColor: '#cdcaca5f'}}
                    readOnly
                    type='number'
                    placeholder='Enter Total Volume'
                    value={totalVolume}
                    onChange={(e) => setTotalVolume(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId='totalWeight'>
                  <Form.Label>Total Weight (kg)</Form.Label>
                  <Form.Control style={{backgroundColor: '#cdcaca5f'}}
                    readOnly
                    type='number'
                    placeholder='Enter Total Weight'
                    value={totalWeight}
                    onChange={(e) => setTotalWeight(e.target.value)}
                    />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group controlId='totalFreightCost'>
                  <Form.Label>Total Freight Cost ($)</Form.Label>
                  <Form.Control style={{backgroundColor: '#cdcaca5f'}}
                    readOnly
                    type='number'
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

      <Row className='mt-4'>
        <Col>
          <Button type='submit' variant='primary' disabled={updateLoadLoading}>
            {updateLoadLoading ? 'Updating...' : 'Update Load'}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default EditLoadScreen;
