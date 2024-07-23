import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card, InputGroup } from 'react-bootstrap';
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import calculateSingleVolume from '../utils/calculateSingleVolume';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';

const CreateOrderScreen = () => {
  const [orderNumber, setOrderNumber] = useState('');
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
  const [products, setProducts] = useState([
    {productId: '', productQuantity: ''}
  ]);
  const [packages, setPackages] = useState([
    { packageQty: '', length: '', width: '', height: '', weight: '', volume: '' }
  ]);
  const [freightCost, setFreightCost] = useState('');
  const [dangerousGoods, setDangerousGoods] = useState(false);
  const [document, setDocument] = useState([]);

  const [createOrder] = useCreateOrderMutation();
  const navigate = useNavigate();

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const addProduct = () => {
    setProducts([
      ...products,
      { productId: '', productQuantity: '' },
    ]);
  };

  const removeProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const handlePackageChange = (index, field, value) => {
    const updatedPackages  = [...packages];
    updatedPackages[index][field] = value;

    if (field === 'length' || field === 'width' || field === 'height') {
      const { packageQty, length, width, height } = updatedPackages[index];
      const volume = calculateSingleVolume(packageQty, length, width, height);
      updatedPackages[index].volume = volume;
    }

    setPackages(updatedPackages);
  };

  const addPackage = () => {
    setPackages([
      ...packages,
      { packageQty: '', length: '', width: '', height: '', weight: '', volume: '' },
    ]);
  };

  const removePackage = (index) => {
    const updatedPackages = [...packages];
    updatedPackages.splice(index, 1);
    setPackages(updatedPackages);
  };

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    const fileData = files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setDocument(prevDocuments => [...prevDocuments, ...fileData]);
  };

  const removeDocument = (index) => {
    const updatedDocuments = [...document];
    updatedDocuments.splice(index, 1);
    setDocument(updatedDocuments);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const orderData = {
      orderNumber,
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
      products,
      packages,
      freightCost,
      dangerousGoods,
      document,
    };

    try {
      const data = await createOrder(orderData).unwrap();
      console.log('Order created:', data);
      navigate('/bookings');
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <Form onSubmit={submitHandler}>
      <Button onClick={() => navigate('/bookings')} >Back</Button>
      <Row>
        <Col md={3}>
          <Form.Group controlId='orderNumber'>
            <Form.Label>Order ID</Form.Label>
            <Form.Control style={{backgroundColor: '#cdcaca5f'}}
              type='number'
              placeholder='Automatically generated'
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId='status'>
            <Form.Label>Status</Form.Label>
            <Form.Control style={{backgroundColor: '#cdcaca5f'}}
              type='text'
              placeholder='Enter status'
              readOnly
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
                    placeholder='Enter destination city'
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

      <Row>
  <Col md={12} >
    <Card className='mt-3 p-4'>
      <Card.Title>Products</Card.Title>
      <Row className='p-2 mt-2'>
        <Col md={12}>
          <Button onClick={addProduct} className='d-flex flex-row align-items-center' style={{ fontSize: '10px' }}>
            <FaPlus style={{ marginRight: '5px' }} />Add product
          </Button>
        </Col>
        <Row className='p-2'>
          <Col md={1}>Qty</Col>
          <Col md={2}>Product ID</Col>
        </Row>
        {products.map((product, index) => (
          <Row className='px-2' key={index}>
            <Col md={1}>
              <Form.Control
                type='number'
                placeholder='Qty'
                value={product.productQuantity}
                onChange={(e) => handleProductChange(index, 'productQuantity', e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Form.Control
                type='text'
                placeholder='Enter Product ID'
                value={product.productId}
                onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
              />
            </Col>
            {index > 0 && (
              <Col md={1}>
                <Button onClick={() => removeProduct(index)}>
                  <FaMinus />
                </Button>
              </Col>
            )}
          </Row>
        ))}
      </Row>
    </Card>
  </Col>
</Row>

      <Row>
        <Col md={12}>
          <Card className='mt-3 p-4'>
            <Card.Title>Packages</Card.Title>
            <Row className='p-2 mt-2'>
              <Col md={12}>
                <Button onClick={addPackage} className='d-flex flex-row align-items-center'style={{fontSize: '10px'}}>
                  <FaPlus style={{ marginRight: '5px' }}/>Add package
                </Button>
              </Col>
              <Row className='p-2 mt-2'>
                <Col md={1}>Qty</Col>
                <Col md={2}>Length (cm)</Col>
                <Col md={2}>Width (cm)</Col>
                <Col md={2}>Height (cm)</Col>
                <Col md={2}>Volume (m³)</Col>
                <Col md={2}>Weight (kg)</Col>
                <Col md={1}></Col>
              </Row>
              {packages.map((pkg, index) => (
                <Row key={index} className='px-2'>
                  <Col md={1}>
                    <Form.Control
                      type='number'
                      placeholder='Qty'
                      value={pkg.packageQty}
                      onChange={(e) => handlePackageChange(index, 'packageQty', e.target.value)}
                    />
                  </Col>
                  <Col md={2}>
                    <Form.Control
                      type='number'
                      placeholder='Enter length'
                      value={pkg.length}
                      onChange={(e) => handlePackageChange(index, 'length', e.target.value)}
                    />
                  </Col>
                  <Col md={2}>
                    <Form.Control
                      type='number'
                      placeholder='Enter width'
                      value={pkg.width}
                      onChange={(e) => handlePackageChange(index, 'width', e.target.value)}
                    />
                  </Col>
                  <Col md={2}>
                    <Form.Control
                      type='number'
                      placeholder='Enter height'
                      value={pkg.height}
                      onChange={(e) => handlePackageChange(index, 'height', e.target.value)}
                      />
                  </Col>
                  <Col md={2}>
                    <Form.Control
                      type='text'
                      placeholder='Auto-calculated'
                      readOnly
                      value={pkg.volume}
                      />
                  </Col>
                  <Col md={2}>
                    <Form.Control
                      type='number'
                      placeholder='Enter weight'
                      value={pkg.weight}
                      onChange={(e) => handlePackageChange(index, 'weight', e.target.value)}
                      />
                  </Col>
                  {index > 0 && (
                    <Col md={1}>
                      <Button onClick={() => removePackage(index)}>
                        <FaMinus />
                      </Button>
                    </Col>
                  )}
                </Row>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <Row className='align-items-center mt-3'>
        {/* <Col md={3}>
          <InputGroup>
            <Form.Control
              type='file'
              placeholder='Select document'
              onChange={(e) => {
                const file = e.target.files[0];
                setDocument(file);
              }}
              style={{ borderTopRightRadius: '0', borderBottomRightRadius: '0' }}
            />
            <Button
              type='submit'
              variant='primary'
              style={{
                borderTopLeftRadius: '0',
                borderBottomLeftRadius: '0',
                marginLeft: '-1px' // Overlaps the border slightly to ensure they look connected
              }}
            >
              Upload
            </Button>
          </InputGroup>
        </Col> */}
        <Col md={2} className='d-flex align-items-center'>
          <Form.Group controlId='dangerousGoods'>
            <Form.Check
              type='checkbox'
              label='Dangerous Goods'
              checked={dangerousGoods}
              onChange={(e) => setDangerousGoods(e.target.checked)}
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Row className='mt-2'>
        <Col md={3} >
          <Form.Group controlId='freightCost'>
            <Form.Label>Freight Cost ($)</Form.Label>
            <Form.Control
              type='number'
              placeholder='Enter freight cost'
              value={freightCost}
              onChange={(e) => setFreightCost(e.target.value)}
            ></Form.Control>
          </Form.Group>
        </Col>
      </Row>

      <Card className='mt-3 p-4'>
        <Form.Group controlId='documents'>
          <Form.Label>Documents</Form.Label>
          {document.length > 0 ? (
            <ul>
              {document.map((doc, index) => (
                <li key={index}>
                  {doc.name}
                  <Button variant='link' onClick={() => removeDocument(index)}>
                    <FaTrash />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No document uploaded</p>
          )}
          <Form.Control
            type='file'
            multiple
            onChange={handleDocumentChange}
            style={{ marginTop: '10px' }}
          />
        </Form.Group>
      </Card>

      <Row>
        <Col>
          <Button type='submit' className='mt-3'>
            Create Order
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default CreateOrderScreen;
