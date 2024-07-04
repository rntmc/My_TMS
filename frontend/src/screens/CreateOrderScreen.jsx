import React, { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';

const CreateOrderScreen = () => {
  const [orderId, setOrderId] = useState(0);
  const [pickupDate, setPickupDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [originSupplierNumber, setOriginSupplierNumber] = useState('');
  const [originSupplierName, setOriginSupplierName] = useState('');
  const [originAddress, setOriginAddress] = useState('');
  const [originCity, setOriginCity] = useState('');
  const [originState, setOriginState] = useState('');
  const [originPostcode, setOriginPostcode] = useState('');
  const [originCountry, setOriginCountry] = useState('');
  const [destinationPlantNumber, setDestinationPlantNumber] = useState('');
  const [destinationPlantName, setDestinationPlantName] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [destinationState, setDestinationState] = useState('');
  const [destinationPostcode, setDestinationPostcode] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [packages, setPackages] = useState([
    {
      packageQty: 0,
      length: 0,
      width: 0,
      height: 0,
      volume: 0,
      weight: ''
    }
  ]);
  const [freightCost, setFreightCost] = useState('');
  const [productId, setProductId] = useState('');
  const [productQuantity, setProductQuantity] = useState(0);
  const [dangerousGoods, setDangerousGoods] = useState(false);
  const [carrier, setCarrier] = useState('');
  const [status, setStatus] = useState('');

  const [createOrder] = useCreateOrderMutation();

  const handleAddPackage = () => {
    setPackages([
      ...packages,
      {
        packageQty: 0,
        length: 0,
        width: 0,
        height: 0,
        volume: 0,
        weight: 0,
      }
    ]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const orderData = {
      orderId,
      pickupDate,
      deliveryDate,
      origin: {
        supplierNumber: originSupplierNumber,
        supplierName: originSupplierName,
        supplierLocation: {
          address: originAddress,
          city: originCity,
          state: originState,
          postcode: originPostcode,
          country: originCountry,
        },
      },
      destination: {
        plantNumber: destinationPlantNumber,
        plantName: destinationPlantName,
        plantLocation: {
          address: destinationAddress,
          city: destinationCity,
          state: destinationState,
          postcode: destinationPostcode,
          country: destinationCountry,
        },
      },
      packages,
      freightCost,
      productId,
      productQuantity,
      dangerousGoods,
      carrier,
      status,
    };

    try {
      const data = await createOrder(orderData).unwrap();
      console.log('Order created:', data);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <Form onSubmit={submitHandler}>
      <Row>
        <Col md={3}>
        <Form.Group controlId='orderId'>
          <Form.Label>Order ID</Form.Label>
          <Form.Control
            type='text'
            placeholder='Automatically generated'
            disabled
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          ></Form.Control>
        </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group controlId='pickupDate'>
            <Form.Label>Pickup Date</Form.Label>
            <Form.Control
              type='date'
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            ></Form.Control>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group controlId='deliveryDate'>
            <Form.Label>Delivery Date</Form.Label>
            <Form.Control
              type='date'
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            ></Form.Control>
          </Form.Group>
        </Col>
      </Row>
    <Row>
      <Col md={6}>
      <Card className='mt-3 p-4'>
        <Row>
          <Col md={4}>
            <Form.Group controlId='originSupplierNumber'>
              <Form.Label>Supplier Number</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter supplier number'
                value={originSupplierNumber}
                onChange={(e) => setOriginSupplierNumber(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>

          <Col md={8}>
            <Form.Group controlId='originSupplierName'>
              <Form.Label>Supplier Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter supplier name'
                value={originSupplierName}
                onChange={(e) => setOriginSupplierName(e.target.value)}
              ></Form.Control>
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
          ></Form.Control>
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
              ></Form.Control>
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
              ></Form.Control>
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
              ></Form.Control>
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
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      </Col>
      
      <Col md={6}>
        <Card className='mt-3 p-4'>
          <Row>
            <Col md={4}>
              <Form.Group controlId='destinationPlantNumber'>
                <Form.Label>Plant Number</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter plant number'
                  value={destinationPlantNumber}
                  onChange={(e) => setDestinationPlantNumber(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Col>

            <Col md={8}>
              <Form.Group controlId='destinationPlantName'>
                <Form.Label>Plant Name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter plant name'
                  value={destinationPlantName}
                  onChange={(e) => setDestinationPlantName(e.target.value)}
                ></Form.Control>
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
            ></Form.Control>
          </Form.Group>

          <Row>
            <Col md={8}>
              <Form.Group controlId='destinationCity'>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter destination city'
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                ></Form.Control>
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
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={8}>
              <Form.Group controlId='destinationCountry'>
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter country'
                  value={destinationCountry}
                  onChange={(e) => setDestinationCountry(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId='destinationPostcode'>
                <Form.Label>Postcode</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter postcode'
                  value={destinationPostcode}
                  onChange={(e) => setDestinationPostcode(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>

    <Row>
      <Col md ={4}>
        <Form.Group controlId='productId'>
          <Form.Label>Product ID</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter product ID'
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          ></Form.Control>
        </Form.Group>
      </Col>
      <Col md={8}>
        <Form.Group controlId='productQuantity'>
          <Form.Label>Product Quantity</Form.Label>
          <Form.Control
            type='number'
            placeholder='Enter product quantity'
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
          ></Form.Control>
        </Form.Group>
      </Col>
    </Row>


    {packages.map((pkg, index) => (
        <Row key={index} className='mt-3'>
          <Col md={1}>
            <Form.Label>Nº PCs (m)</Form.Label>
            <Form.Control
              type='number'
              placeholder='pieces'
              value={pkg.packageQty}
              onChange={(e) =>
                setPackages(prevPackages =>
                  prevPackages.map((prevPkg, i) =>
                    i === index
                      ? { ...prevPkg, packageQty: parseInt(e.target.value) || 0 }
                      : prevPkg
                  )
                )
              }
            />
          </Col>

          <Col md={1}>
            <Form.Label>Length (m)</Form.Label>
            <Form.Control
              type='number'
              placeholder='length'
              value={pkg.length}
              onChange={(e) =>
                setPackages(prevPackages =>
                  prevPackages.map((prevPkg, i) =>
                    i === index
                      ? { ...prevPkg, length: parseInt(e.target.value) || 0 }
                      : prevPkg
                  )
                )
              }
            />
          </Col>

          <Col md={1}>
            <Form.Label>Width (m)</Form.Label>
            <Form.Control
              type='number'
              placeholder='width'
              value={pkg.width}
              onChange={(e) =>
                setPackages(prevPackages =>
                  prevPackages.map((prevPkg, i) =>
                    i === index
                      ? { ...prevPkg, width: parseInt(e.target.value) || 0 }
                      : prevPkg
                  )
                )
              }
            />
          </Col>

          <Col md={1}>
            <Form.Label>Height (m)</Form.Label>
            <Form.Control
              type='number'
              placeholder='height'
              value={pkg.height}
              onChange={(e) =>
                setPackages(prevPackages =>
                  prevPackages.map((prevPkg, i) =>
                    i === index
                      ? { ...prevPkg, height: parseInt(e.target.value) || 0 }
                      : prevPkg
                  )
                )
              }
            />
          </Col>

          <Col md={2}>
            <Form.Group controlId={`volume-${index}`}>
              <Form.Label>Total Volume</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter volume'
                value={pkg.volume}
                onChange={(e) =>
                  setPackages(prevPackages =>
                    prevPackages.map((prevPkg, i) =>
                      i === index
                        ? { ...prevPkg, volume: parseInt(e.target.value) || 0 }
                        : prevPkg
                    )
                  )
                }
              />
            </Form.Group>
          </Col>

          <Col md={2}>
            <Form.Group controlId={`weight-${index}`}>
              <Form.Label>Weight</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter weight'
                value={pkg.weight}
                onChange={(e) =>
                  setPackages(prevPackages =>
                    prevPackages.map((prevPkg, i) =>
                      i === index
                        ? { ...prevPkg, weight: e.target.value }
                        : prevPkg
                    )
                  )
                }
              />
            </Form.Group>
          </Col>

          {index === packages.length - 1 && (
            <Col md={1} className='align-self-end'>
              <Button variant='primary' onClick={handleAddPackage}>
                Add Package
              </Button>
            </Col>
          )}
        </Row>
      ))}


      <Form.Group controlId='freightCost'>
        <Form.Label>Freight Cost</Form.Label>
        <Form.Control
          type='number'
          placeholder='Enter freight cost'
          value={freightCost}
          onChange={(e) => setFreightCost(e.target.value)}
        ></Form.Control>
      </Form.Group>


      <Form.Group controlId='dangerousGoods'>
        <Form.Check
          type='checkbox'
          label='Dangerous Goods'
          checked={dangerousGoods}
          onChange={(e) => setDangerousGoods(e.target.checked)}
        ></Form.Check>
      </Form.Group>

      <Form.Group controlId='carrier'>
        <Form.Label>Carrier</Form.Label>
        <Form.Control
          type='text'
          placeholder='Enter carrier'
          value={carrier}
          onChange={(e) => setCarrier(e.target.value)}
        ></Form.Control>
      </Form.Group>

      <Form.Group controlId='status'>
        <Form.Label>Status</Form.Label>
        <Form.Control
          type='text'
          placeholder='Enter status'
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        ></Form.Control>
      </Form.Group>

      <Button type='submit' variant='primary mt-3'>
        Create Order
      </Button>

    </Form>
  );
};

export default CreateOrderScreen;
