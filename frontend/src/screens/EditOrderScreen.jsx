import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col, Card, FormGroup, ListGroup } from 'react-bootstrap';
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useGetOrderDetailsQuery, useUpdateOrderMutation, useUploadOrderDocumentMutation } from '../slices/ordersApiSlice';
import { useGetEntityByNumberQuery } from '../slices/entitiesApiSlice';
import calculateSingleVolume from '../utils/calculateSingleVolume';

const EditOrderScreen = () => {
  const { id: orderId } = useParams();
  const {userInfo} = useSelector(state=> state.auth)
  const { data: order, isLoading, isError } = useGetOrderDetailsQuery(orderId);
  const [uploadOrderDocument] = useUploadOrderDocumentMutation();
  const [updateOrder] = useUpdateOrderMutation();

  const navigate = useNavigate();

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
  const [products, setProducts] = useState([
    { productId: '', productQuantity: '' }
  ]);
  const [packages, setPackages] = useState([
    { packageQty: '', length: '', width: '', height: '', weight: '', volume: '' }
  ]);
  const [freightCost, setFreightCost] = useState('');
  const [dangerousGoods, setDangerousGoods] = useState(false);
  const [document, setDocument] = useState([]);

  // Fetch entity details for origin and destination
  const { data: originEntity, isFetching: isFetchingOriginEntity } = useGetEntityByNumberQuery(originEntityNumber);
  const { data: destinationEntity, isFetching: isFetchingDestinationEntity } = useGetEntityByNumberQuery(destinationEntityNumber);

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setPickupDate(order.pickupDate ? order.pickupDate.split('T')[0] : '');
      setDeliveryDate(order.deliveryDate ? order.deliveryDate.split('T')[0] : '');
      setOriginEntityNumber(order.origin.entityNumber);
      setDestinationEntityNumber(order.destination.entityNumber);
      setProducts(order.products || [{ productId: '', productQuantity: '' }]);
      setPackages(order.packages || [{ packageQty: '', length: '', width: '', height: '', weight: '', volume: '' }]);
      setFreightCost(order.freightCost);
      setDangerousGoods(order.dangerousGoods);
      setDocument(order.document || []);
    }
  }, [order]);

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

  const handleProductChange = (index, field, value) => {
    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value,
      };
      return updatedProducts;
    });
  };

  const addProduct = () => {
    setProducts(prevProducts => [
      ...prevProducts,
      { productId: '', productQuantity: '' }
    ]);
  };

  const removeProduct = (index) => {
    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts];
      updatedProducts.splice(index, 1);
      return updatedProducts;
    });
  };

  const handlePackageChange = (index, field, value) => {
    const numericValue = isNaN(parseFloat(value)) ? '' : parseFloat(value);
    
    const updatedPackages = packages.map((pkg, i) => {
      if (i === index) {
        const updatedPackage = { ...pkg, [field]: numericValue };
        
        if (['length', 'width', 'height', 'packageQty'].includes(field)) {
          updatedPackage.volume = calculateSingleVolume(
            updatedPackage.packageQty,
            updatedPackage.length,
            updatedPackage.width,
            updatedPackage.height
          );
        }
        
        return updatedPackage;
      }
      return pkg;
    });
    
    setPackages(updatedPackages);
  };
  
  
  const addPackage = () => {
    setPackages([...packages, { packageQty: '', length: '', width: '', height: '', weight: '', volume: '' }]);
  };
  
  const removePackage = (index) => {
    setPackages(packages.filter((_, i) => i !== index));
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

const handleBackButtonClick = () => {
  const path = userInfo.role === 'Admin' ? '/bookings' : '/myorders';
  navigate(path);
};

  const submitHandler = async (e) => {
    e.preventDefault();
    const totalVolume = packages.reduce((total, pkg) => {
      return total + (pkg.volume ? parseFloat(pkg.volume) : 0);
    }, 0);
  
    const totalWeight = packages.reduce((total, pkg) => {
      return total + (pkg.weight ? parseFloat(pkg.weight) : 0);
    }, 0);

    const updatedOrderData = {
      orderId,
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
      packages, // Mantenha packages como um array de objetos
      totalVolume, // Adicione o volume total
      totalWeight, // Adicione o peso total
      freightCost,
      dangerousGoods,
      document,
    };

    try {
      await updateOrder(updatedOrderData).unwrap();
      if(userInfo.role === "Admin") {
        navigate('/bookings')
      } else {
        navigate('/myorders')
      }
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
      <Button onClick={handleBackButtonClick}>Back</Button>
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
            <ListGroup.Item style={{ fontSize: '0.8rem' }}>No documents to display</ListGroup.Item>
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
      
      <Row className='mt-2'>
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

      <Button type='submit' className='mt-3'>
        Update Order
      </Button>
    </Form>
  );
};

export default EditOrderScreen;
