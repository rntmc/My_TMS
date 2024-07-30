import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import {toast} from 'react-toastify';
import calculateSingleVolume from '../utils/calculateSingleVolume';
import { useCreateOrderMutation, useUploadOrderDocumentMutation } from '../slices/ordersApiSlice';
import {useGetEntityByNumberQuery } from '../slices/entitiesApiSlice'

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

  const { data: originEntity, refetch: refetchOriginEntity } = useGetEntityByNumberQuery(originEntityNumber);
  const { data: destinationEntity, refetch: refetchDestinationEntity } = useGetEntityByNumberQuery(destinationEntityNumber)

  const [createOrder] = useCreateOrderMutation();
  const [uploadOrderDocument] = useUploadOrderDocumentMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (originEntity) {
      setOriginEntityName(originEntity.name || '');
      setOriginAddress(originEntity.location.address || '');
      setOriginCity(originEntity.location.city || '');
      setOriginState(originEntity.location.state || '');
      setOriginPostcode(originEntity.location.postcode || '');
      setOriginCountry(originEntity.location.country || '');
    }
  }, [originEntity]);
  
  useEffect(() => {
    if (destinationEntity) {
      setDestinationEntityName(destinationEntity.name || '');
      setDestinationAddress(destinationEntity.location.address || '');
      setDestinationCity(destinationEntity.location.city || '');
      setDestinationState(destinationEntity.location.state || '');
      setDestinationPostcode(destinationEntity.location.postcode || '');
      setDestinationCountry(destinationEntity.location.country || '');
    }
  }, [destinationEntity]);

  useEffect(() => {
    if (originEntityNumber) {
      refetchOriginEntity();
    }
  }, [originEntityNumber]);

  useEffect(() => {
    if (destinationEntityNumber) {
      refetchDestinationEntity();
    }
  }, [destinationEntityNumber]);

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

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append('document', e.target.files[i]);
    }
    try {
      const res = await uploadOrderDocument(formData).unwrap();
      // Assuming `res.files` contains the new files
      setDocument(prevDocs => [...prevDocs, ...res.files]);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

const removeDocument = (index) => {
    // Remove document at the specified index
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
      await createOrder(orderData).unwrap();
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
            <Form.Control style={{backgroundColor: '#cdcaca5f', fontStyle:"italic"}}
              type='number'
              placeholder='Automatically generated'
              value={orderNumber}
              readOnly
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId='status'>
            <Form.Label>Status</Form.Label>
            <Form.Control style={{backgroundColor: '#cdcaca5f' , fontStyle:"italic"}}
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
                  <Form.Control style={{backgroundColor: '#cdcaca5f'}}
                    type='text'
                    placeholder='Entity name'
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
                placeholder='Address'
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
                    placeholder='City'
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
                    placeholder='State'
                    value={originState}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Group controlId='originCountry'>
                  <Form.Label>Country</Form.Label>
                  <Form.Control style={{backgroundColor: '#cdcaca5f'}}
                    type='text'
                    placeholder='Country'
                    value={originCountry}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId='originPostcode'>
                  <Form.Label>Postcode</Form.Label>
                  <Form.Control style={{backgroundColor: '#cdcaca5f'}}
                    type='text'
                    placeholder='Postcode'
                    value={originPostcode}
                    readOnly
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
                  <Form.Control style={{backgroundColor: '#cdcaca5f'}}
                    type='text'
                    placeholder='Entity name'
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
                placeholder='Address'
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
                    placeholder='City'
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
                    placeholder='State'
                    value={destinationState}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={8}>
                <Form.Group controlId='destinationCountry'>
                  <Form.Label>Country</Form.Label>
                  <Form.Control style={{backgroundColor: '#cdcaca5f'}}
                    type='text'
                    placeholder='Country'
                    value={destinationCountry}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId='destinationPostcode'>
                  <Form.Label>Postcode</Form.Label>
                  <Form.Control style={{backgroundColor: '#cdcaca5f'}}
                    type='text'
                    placeholder='Postcode'
                    value={destinationPostcode}
                    readOnly
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
                    <Form.Control style={{backgroundColor: '#cdcaca5f'}}
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

      <Col className='mt-3'>
    <Card>
      <Card.Body>
        <Card.Title>Documentation</Card.Title>
        <Form.Group controlId='document'>
          <Form.Label>Upload Document</Form.Label>
          <Form.Control
            type='file'
            multiple
            onChange={(e) => uploadFileHandler(e)}
          />
        </Form.Group>
        <Card.Title style={{ fontSize: '0.8rem' }} className="mt-2">Documents Selected</Card.Title>
        <ListGroup>
          {document.length === 0 ? (
            <ListGroup.Item style={{ fontSize: '0.8rem' }}>No documents provided</ListGroup.Item>
          ) : (
            document.map((doc, index) => (
              <ListGroup.Item key={index}>
                <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                <a href={doc.url} target='_blank' rel='noopener noreferrer' style={{ fontSize: '0.8rem' }}>
                  {doc.name}
                </a>
                <Button
                    style={{
                      padding: '0.3rem',
                      backgroundColor: '#a5a9ad',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      marginLeft: '10px'
                    }}
                    onClick={() => removeDocument(index)}
                  >
                    <FaTrash style={{ fontSize: '1rem' }} />
                  </Button>
              </div>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  </Col>


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
