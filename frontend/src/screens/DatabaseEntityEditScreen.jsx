import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import { useGetEntityQuery, useUpdateEntityMutation } from '../slices/entitiesApiSlice';
import Loader from '../components/Loader';

const DatabaseEntityEditScreen = () => {
  const { id: entityId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: entity, isLoading, isError, refetch } = useGetEntityQuery(entityId);

  const [entityNumber, setEntityNumber] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState({
    address: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
  });
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [openingHours, setOpeningHours] = useState([
    { day: 'Monday', open: '', close: '', isClosed: false },
    { day: 'Tuesday', open: '', close: '', isClosed: false },
    { day: 'Wednesday', open: '', close: '', isClosed: false },
    { day: 'Thursday', open: '', close: '', isClosed: false },
    { day: 'Friday', open: '', close: '', isClosed: false },
    { day: 'Saturday', open: '', close: '', isClosed: false },
    { day: 'Sunday', open: '', close: '', isClosed: false }
  ]);

  const [updateEntity, { isLoading: isUpdating }] = useUpdateEntityMutation();

  useEffect(() => {
    if (entity) {
      setEntityNumber(entity.entityNumber || '');
      setName(entity.name || '');
      setContactPerson(entity.contactPerson || '');
      setEmail(entity.email || '');
      setPhone(entity.phone || '');
      setLocation({
        address: entity.location.address || '',
        city: entity.location.city || '',
        state: entity.location.state || '',
        country: entity.location.country || '',
        postcode: entity.location.postcode || '',
      });
      setOpeningHours(entity.openingHours.map(day => ({
        ...day,
        isClosed: day.isClosed ?? false // Default to false if not provided
      })));
    }
  }, [entity]);

  const handleTimeChange = (index, field, value) => {
    setOpeningHours(
      openingHours.map((day, i) =>
        i === index ? { ...day, [field]: value } : day
      )
    );
  };

  const handleClosedChange = (index, isClosed) => {
    setOpeningHours(
      openingHours.map((day, i) =>
        i === index ? { ...day, isClosed, open: isClosed ? '' : day.open, close: isClosed ? '' : day.close } : day
      )
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const updatedEntity = await updateEntity({
        entityId,
        entityNumber,
        name,
        contactPerson,
        email,
        phone,
        location,
        openingHours,
      }).unwrap();
      toast.success('Entity updated successfully');
      refetch();
      navigate('/database/entities');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  if (isLoading || isUpdating) {
    return <Loader />;
  }

  if (isError) {
    return <p>Error loading Entity details</p>;
  }

  return (
    <Row>
      <Col md={6}>
        <h2>Update Entity</h2>
        <Form onSubmit={submitHandler}>
          <Row>
            <Col md={4}>
              <Form.Group controlId="entityNumber">
                <Form.Label>Entity Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter entity number"
                  value={entityNumber}
                  onChange={(e) => setEntityNumber(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="contactPerson">
            <Form.Label>Contact Person</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter contact person"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
            />
          </Form.Group>
          <Row>
            <Col md={8}>
              <Form.Group controlId="email">
                <Form.Label>Contact Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter contact email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="phone">
                <Form.Label>Contact Phone</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter contact phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={8}>
              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter address"
                  value={location.address}
                  onChange={(e) => setLocation({ ...location, address: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="postcode">
                <Form.Label>Postcode</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter postcode"
                  value={location.postcode}
                  onChange={(e) => setLocation({ ...location, postcode: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={5}>
              <Form.Group controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter city"
                  value={location.city}
                  onChange={(e) => setLocation({ ...location, city: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group controlId="state">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter state"
                  value={location.state}
                  onChange={(e) => setLocation({ ...location, state: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group controlId="country">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter country"
                  value={location.country}
                  onChange={(e) => setLocation({ ...location, country: e.target.value })}
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
          <Button type="submit" variant="primary">Update Entity</Button>
        </Form>
      </Col>
    </Row>
  );
};

export default DatabaseEntityEditScreen;
