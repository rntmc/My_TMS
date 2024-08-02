import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useAddEntityMutation } from '../slices/entitiesApiSlice';
import { useNavigate, Link } from 'react-router-dom';

const EntityDatabaseCreationScreen = () => {
  const [entityNumber, setEntityNumber] = useState('');
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
  
  const defaultWeekdayOpen = '09:00';
  const defaultWeekdayClose = '17:00';
  const defaultWeekendOpen = '10:00';
  const defaultWeekendClose = '14:00';

  const [openingHours, setOpeningHours] = useState([
    { day: 'Monday', open: defaultWeekdayOpen, close: defaultWeekdayClose, isWeekend: false, isClosed: false },
    { day: 'Tuesday', open: defaultWeekdayOpen, close: defaultWeekdayClose, isWeekend: false, isClosed: false },
    { day: 'Wednesday', open: defaultWeekdayOpen, close: defaultWeekdayClose, isWeekend: false, isClosed: false },
    { day: 'Thursday', open: defaultWeekdayOpen, close: defaultWeekdayClose, isWeekend: false, isClosed: false },
    { day: 'Friday', open: defaultWeekdayOpen, close: defaultWeekdayClose, isWeekend: false, isClosed: false },
    { day: 'Saturday', open: defaultWeekendOpen, close: defaultWeekendClose, isWeekend: true, isClosed: false },
    { day: 'Sunday', open: defaultWeekendOpen, close: defaultWeekendClose, isWeekend: true, isClosed: false },
  ]);

  const navigate = useNavigate();
  const [addEntity, { isLoading }] = useAddEntityMutation();

  const handleClosedChange = (index, isClosed) => {
    setOpeningHours(
      openingHours.map((day, i) =>
        i === index ? { ...day, isClosed, open: isClosed ? '' : day.open, close: isClosed ? '' : day.close } : day
      )
    );
  };

  const handleTimeChange = (index, field, value) => {
    setOpeningHours(
      openingHours.map((day, i) =>
        i === index ? { ...day, [field]: value } : day
      )
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const entityData = {
      entityNumber,
      name,
      location,
      contactPerson,
      email,
      phone,
      openingHours,
    };

    try {
      const response = await addEntity(entityData).unwrap();
      console.log('Entity created:', response);
      // Clear fields after creating the entity
      setEntityNumber('');
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
        { day: 'Monday', open: defaultWeekdayOpen, close: defaultWeekdayClose, isWeekend: false, isClosed: false },
        { day: 'Tuesday', open: defaultWeekdayOpen, close: defaultWeekdayClose, isWeekend: false, isClosed: false },
        { day: 'Wednesday', open: defaultWeekdayOpen, close: defaultWeekdayClose, isWeekend: false, isClosed: false },
        { day: 'Thursday', open: defaultWeekdayOpen, close: defaultWeekdayClose, isWeekend: false, isClosed: false },
        { day: 'Friday', open: defaultWeekdayOpen, close: defaultWeekdayClose, isWeekend: false, isClosed: false },
        { day: 'Saturday', open: defaultWeekendOpen, close: defaultWeekendClose, isWeekend: true, isClosed: false },
        { day: 'Sunday', open: defaultWeekendOpen, close: defaultWeekendClose, isWeekend: true, isClosed: false },
      ]);
      // Navigate back to the entity listing page after creation
      navigate('/database/entities');
    } catch (err) {
      console.error('Error creating entity:', err);
    }
  };

  return (
    <>
      <Row>
        <Col md={12}>
          <Link className='btn btn-light my-3' to='/database'>
            Return
          </Link>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={8}>
          <h1>Create Entity</h1>
          <Form onSubmit={submitHandler}>
            <Row>
              <Col md={4}>
                <Form.Group controlId="entityNumber" className="mb-3">
                  <Form.Label>Entity Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter company number"
                    value={entityNumber}
                    onChange={(e) => setEntityNumber(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group controlId="name" className="mb-3">
                  <Form.Label>Entity Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter company name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <h3>Contact Information</h3>
            <Form.Group controlId="contactPerson" className="mb-3">
              <Form.Label>Contact Person</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                required
              />
            </Form.Group>
            <Row>
              <Col md={8}>
                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="phone" className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter contact number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <h3>Address</h3>
              <Col md={8}>
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
              </Col>
              <Col md={4}>
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
              </Col>
              </Row>
              <Row>
              <Col md={5}>
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
              </Col>
                <Col md={2}>
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
                </Col>
                <Col md={5}>
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
                </Col>
            </Row>
            <h3>Opening Hours</h3>
            {openingHours.map((day, index) => (
              <Form.Group controlId={`openingHours-${day.day}`} className="mb-3" key={index}>
              <Form.Label>{day.day}</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    type="time"
                    value={day.open}
                    onChange={(e) => handleTimeChange(index, 'open', e.target.value)}
                    disabled={day.isClosed}
                    required={!day.isClosed}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="time"
                    value={day.close}
                    onChange={(e) => handleTimeChange(index, 'close', e.target.value)}
                    disabled={day.isClosed}
                    required={!day.isClosed}
                  />
                </Col>
                <Col>
                  <Form.Check
                    type="checkbox"
                    label="Closed"
                    checked={day.isClosed}
                    onChange={(e) => handleClosedChange(index, e.target.checked)}
                  />
                </Col>
              </Row>
            </Form.Group>
            ))}
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Entity'}
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default EntityDatabaseCreationScreen;
