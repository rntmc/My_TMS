import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useAddSupplierMutation } from '../slices/suppliersApiSlice';
import { useNavigate } from 'react-router-dom';

const SupplierDatabaseCreationScreen = () => {
  const [supplierNumber, setSupplierNumber] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    postcode: '',
  });
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [openingHours, setOpeningHours] = useState([
    { day: 'Monday', open: '', close: '' },
    { day: 'Tuesday', open: '', close: '' },
    { day: 'Wednesday', open: '', close: '' },
    { day: 'Thursday', open: '', close: '' },
    { day: 'Friday', open: '', close: '' },
    { day: 'Saturday', open: '', close: '' },
    { day: 'Sunday', open: '', close: '' },
  ]);

  const navigate = useNavigate();
  const [addSupplier, { isLoading, error }] = useAddSupplierMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    const cleanedOpeningHours = openingHours.map((day) => ({
      ...day,
      open: day.open === '' ? '' : day.open,
      close: day.close === '' ? '' : day.close,
    }));
    const supplierData = {
      supplierNumber,
      name,
      location,
      contactPerson,
      email,
      phone,
      openingHours:cleanedOpeningHours,
    };

    try {
      const response = await addSupplier(supplierData).unwrap();
      console.log('Supplier created:', response);
      // Limpar os campos após a criação do fornecedor
      setSupplierNumber('');
      setName('');
      setContactPerson('');
      setEmail('');
      setPhone('');
      setLocation({
        address: '',
        city: '',
        state: '',
        country: '',
        postcode: '',
      });
      setOpeningHours([
        { day: 'Monday', open: '', close: '' },
        { day: 'Tuesday', open: '', close: '' },
        { day: 'Wednesday', open: '', close: '' },
        { day: 'Thursday', open: '', close: '' },
        { day: 'Friday', open: '', close: '' },
        { day: 'Saturday', open: '', close: '' },
        { day: 'Sunday', open: '', close: '' },
      ]);
      // Navegar de volta para a página de listagem de fornecedores após a criação
      navigate('/database/suppliers');
    } catch (err) {
      console.error('Error creating supplier:', err);
    }
  };

  return (
    <Row className="justify-content-md-center">
      <Col xs={12} md={8}>
        <h1>Create Supplier</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="supplierNumber" className="mb-3">
            <Form.Label>Supplier Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter supplier number"
              value={supplierNumber}
              onChange={(e) => setSupplierNumber(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="name" className="mb-3">
            <Form.Label>Supplier Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <h3>Contact Information</h3>
          <Form.Group controlId="contactPerson" className="mb-3">
            <Form.Label>Contact Person</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter contact person"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="phone" className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </Form.Group>

          <h3>Address</h3>
          <Form.Group controlId="address" className="mb-3">
            <Form.Label>Street Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter street address"
              value={location.address}
              onChange={(e) =>
                setLocation({ ...location, address: e.target.value })
              }
              required
            />
          </Form.Group>

          <Form.Group controlId="city" className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter city"
              value={location.city}
              onChange={(e) =>
                setLocation({ ...location, city: e.target.value })
              }
              required
            />
          </Form.Group>

          <Form.Group controlId="state" className="mb-3">
            <Form.Label>State</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter state"
              value={location.state}
              onChange={(e) =>
                setLocation({ ...location, state: e.target.value })
              }
              required
            />
          </Form.Group>

          <Form.Group controlId="country" className="mb-3">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter country"
              value={location.country}
              onChange={(e) =>
                setLocation({ ...location, country: e.target.value })
              }
              required
            />
          </Form.Group>

          <Form.Group controlId="postcode" className="mb-3">
            <Form.Label>Postcode</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter postcode"
              value={location.postcode}
              onChange={(e) =>
                setLocation({ ...location, postcode: e.target.value })
              }
              required
            />
          </Form.Group>

          <h3>Opening Hours</h3>
          {openingHours.map((day, index) => (
            <Row key={index}>
              <Col xs={12} sm={2}>
                <Form.Group controlId={`day-${index}`} className="mb-3">
                  <Form.Label>{day.day}</Form.Label>
                </Form.Group>
              </Col>
              <Col xs={12} sm={5}>
                <Form.Group controlId={`open-${index}`} className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Opening time"
                    value={day.open}
                    onChange={(e) => {
                      const updatedOpeningHours = [...openingHours];
                      updatedOpeningHours[index] = {
                        ...updatedOpeningHours[index],
                        open: e.target.value,
                      };
                      setOpeningHours(updatedOpeningHours);
                    }}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={5}>
                <Form.Group controlId={`close-${index}`} className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Closing time"
                    value={day.close}
                    onChange={(e) => {
                      const updatedOpeningHours = [...openingHours];
                      updatedOpeningHours[index] = {
                        ...updatedOpeningHours[index],
                        close: e.target.value,
                      };
                      setOpeningHours(updatedOpeningHours);
                    }}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          ))}

          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Supplier'}
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default SupplierDatabaseCreationScreen;