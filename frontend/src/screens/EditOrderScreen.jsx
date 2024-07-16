import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col, Card, FormGroup } from 'react-bootstrap';
import { useGetOrderDetailsQuery, useUpdateOrderMutation } from '../slices/ordersApiSlice';
import { FaPlus } from "react-icons/fa";
import calculateSingleVolume from '../utils/calculateSingleVolume';

const EditOrderScreen = () => {
  const { id: orderId } = useParams();
  const { data: order, isLoading, isError } = useGetOrderDetailsQuery(orderId);
  const [updateOrder] = useUpdateOrderMutation();
  console.log(order)

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
  const [packageQty, setPackageQty] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [freightCost, setFreightCost] = useState('');
  const [productId, setProductId] = useState('');
  const [productQuantity, setProductQuantity] = useState(0);
  const [dangerousGoods, setDangerousGoods] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setPickupDate(order.pickupDate ? order.pickupDate.split('T')[0] : '');
      setDeliveryDate(order.deliveryDate ? order.deliveryDate.split('T')[0] : '');
      setOriginEntityNumber(order.origin.entityNumber);
      setOriginEntityName(order.origin.entityName);
      setOriginAddress(order.origin.entityLocation.address);
      setOriginCity(order.origin.entityLocation.city);
      setOriginState(order.origin.entityLocation.state);
      setOriginPostcode(order.origin.entityLocation.postcode);
      setOriginCountry(order.origin.entityLocation.country);
      setDestinationEntityNumber(order.destination.entityNumber);
      setDestinationEntityName(order.destination.entityName);
      setDestinationAddress(order.destination.entityLocation.address);
      setDestinationCity(order.destination.entityLocation.city);
      setDestinationState(order.destination.entityLocation.state);
      setDestinationPostcode(order.destination.entityLocation.postcode);
      setDestinationCountry(order.destination.entityLocation.country);
      setPackageQty(order.packageQty);
      setLength(order.length);
      setWidth(order.width);
      setHeight(order.height);
      setWeight(order.weight);
      setFreightCost(order.freightCost);
      setProductId(order.productId);
      setProductQuantity(order.productQuantity);
      setDangerousGoods(order.dangerousGoods);
    }
  }, [order]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const volume = calculateSingleVolume(packageQty, length, width, height);
    const updatedOrderData = {
      orderId,
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
      packageQty,
      length,
      width,
      height,
      volume,
      weight,
      freightCost,
      productId,
      productQuantity,
      dangerousGoods,
      status,
    };

    try {
      const data = await updateOrder(updatedOrderData).unwrap();
      console.log('Order updated:', data);
      navigate('/bookings');
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading order.</p>;
  }

  return (
    <Form onSubmit={submitHandler}>
      <Button onClick={() => navigate('/bookings')}>Back</Button>
      <Row>
        <Col md={3}>
          <Form.Group controlId='orderId'>
            <Form.Label>Order ID</Form.Label>
            <Form.Control style={{backgroundColor: '#cdcaca5f'}}
              type='text'
              value={order.orderNumber}
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
            <Row>
              <Col md={4}>
                <Form.Group controlId='originEntityNumber'>
                  <Form.Label>Entity Number</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter Entity number'
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
                    placeholder='Enter Entity name'
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
                placeholder='Enter address'
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
                    placeholder='Enter city'
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
                    placeholder='Enter origin state'
                    value={originState}
                    onChange={(e) => setOriginState(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Group controlId='originCountry'>
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter origin country'
                    value={originCountry}
                    onChange={(e) => setOriginCountry(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId='originPostcode'>
                  <Form.Label>Postcode</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter origin postcode'
                    value={originPostcode}
                    onChange={(e) => setOriginPostcode(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col md={6}>
          <Card className='mt-3 p-4'>
            <Row>
              <Col md={4}>
                <Form.Group controlId='destinationEntityNumber'>
                  <Form.Label>Entity Number</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter Entity number'
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
                    placeholder='Enter Entity name'
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
                placeholder='Enter address'
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
                    placeholder='Enter city'
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
                    placeholder='Enter destination state'
                    value={destinationState}
                    onChange={(e) => setDestinationState(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Group controlId='destinationCountry'>
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter destination country'
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId='destinationPostcode'>
                  <Form.Label>Postcode</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter destination postcode'
                    value={destinationPostcode}
                    onChange={(e) => setDestinationPostcode(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row className='mt-2'>
      <Col md={1} className='d-flex justify-content-start align-items-start'>
      <Button
        style={{
          padding: '0.3rem',
          backgroundColor: '#a5a9ad',
          color: 'white',
          display: 'flex',
          alignItems: 'start',
        }}

      >
        <FaPlus style={{ fontSize: '1rem' }} />
      </Button>
      </Col>
        <Col md={1}>
          <Form.Group controlId='productQuantity'>
            <Form.Label>Product Qty</Form.Label>
            <Form.Control
              type='number'
              placeholder='Enter product quantity'
              value={productQuantity}
              onChange={(e) => setProductQuantity(e.target.value)}
            ></Form.Control>
          </Form.Group>
        </Col>
        <Col md ={2}>
          <Form.Group controlId='productId'>
            <Form.Label>Product ID</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter product ID'
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
          </Form.Group>
        </Col>
    </Row>


  <React.Fragment>
  <Row >
    <Col md={1} className='d-flex justify-content-start align-items-start'>
    <Button
      style={{
        padding: '0.3rem',
        backgroundColor: '#a5a9ad',
        color: 'white',
        display: 'flex',
        alignItems: 'start',
      }}

    >
      <FaPlus style={{ fontSize: '1rem' }} />
    </Button>
    </Col>
    <Col md={1}>
      <Form.Label>Nº PCs</Form.Label>
    </Col>
    <Col md={1}>
      <Form.Label>Length (cm)</Form.Label>
    </Col>
    <Col md={1}>
      <Form.Label>Width (cm)</Form.Label>
    </Col>
    <Col md={1}>
      <Form.Label>Height (cm)</Form.Label>
    </Col>
    <Col md={2}>
      <Form.Label>Total Volume (m³)</Form.Label>
    </Col>
    <Col md={2}>
      <Form.Label>Weight (kg)</Form.Label>
    </Col>
  </Row>
  <Row>
    <Col md={1}>
    </Col>
    <Col md={1}>
      <FormGroup>
        <Form.Control
          type='number'
          placeholder='0'
          value={packageQty}
          onChange={(e) => setPackageQty(e.target.value)}
        ></Form.Control>
      </FormGroup>
    </Col>
    <Col md={1}>
      <FormGroup>
        <Form.Control
          type='number'
          placeholder='0'
          value={length}
          onChange={(e) => setLength(e.target.value)}
        ></Form.Control>
      </FormGroup>
    </Col>
    <Col md={1}>
      <FormGroup>
        <Form.Control
          type='number'
          placeholder='0'
          value={width}
          onChange={(e) => setWidth(e.target.value)}
        ></Form.Control>
      </FormGroup>
    </Col>
    <Col md={1}>
      <FormGroup>
        <Form.Control
          type='number'
          placeholder='0'
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        ></Form.Control>
      </FormGroup>
    </Col>
    <Col md={2}>
      <FormGroup>
        <Form.Control style={{backgroundColor: '#cdcaca5f'}}
          type='number'
          readOnly
          value={calculateSingleVolume(packageQty, length, width, height)}
          placeholder='Volume'
        />
      </FormGroup>
    </Col>
    <Col md={2}>
      <FormGroup>
        <Form.Control
          type='number'
          placeholder='0'
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        ></Form.Control>
      </FormGroup>
    </Col>

  </Row>
</React.Fragment>

      <Form.Group controlId='dangerousGoods' className='mt-2'>
        <Form.Check
          type='checkbox'
          label='Dangerous Goods'
          checked={dangerousGoods}
          onChange={(e) => setDangerousGoods(e.target.checked)}
        ></Form.Check>
      </Form.Group>

      <Form.Group controlId='freightCost'>
        <Form.Label>Freight Cost</Form.Label>
        <Form.Control
          type='number'
          placeholder='Enter freight cost'
          value={freightCost}
          onChange={(e) => setFreightCost(e.target.value)}
        ></Form.Control>
      </Form.Group>

      <Button type='submit' className='mt-3'>
        Update Order <FaPlus />
      </Button>
    </Form>
  );
};

export default EditOrderScreen;
