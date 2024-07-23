import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col, Card, FormGroup, InputGroup } from 'react-bootstrap';
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useGetOrderDetailsQuery, useUpdateOrderMutation, useUploadOrderDocumentMutation } from '../slices/ordersApiSlice';
import calculateSingleVolume from '../utils/calculateSingleVolume';

const EditOrderScreen = () => {
  const { id: orderId } = useParams();
  const { data: order, isLoading, isError } = useGetOrderDetailsQuery(orderId);
  const [updateOrder] = useUpdateOrderMutation();
  const [uploadOrderDocument] = useUploadOrderDocumentMutation()

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
  const [document, setDocument] = useState('');

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
      setProducts(order.products || [{ productId: '', productQuantity: '' }]);
      setPackages(order.packages || [{ packageQty: '', length: '', width: '', height: '', weight: '', volume: '' }]);
      setFreightCost(order.freightCost);
      setDangerousGoods(order.dangerousGoods);
      setDocument(order.document || []);
    }
  }, [order]);

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

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    const fileData = files.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setDocument(prevDocuments => [...prevDocuments, ...fileData]);
  };

  const removeDocument = (index) => {
    setDocument((prevDocuments) => prevDocuments.filter((_, i) => i !== index));
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

      <Card className='mt-3 p-4'>
        <Form.Group controlId='document'>
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
