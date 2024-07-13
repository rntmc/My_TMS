import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import { useGetEntityQuery, useUpdateEntityMutation } from '../slices/entitiesApiSlice';
import { setCredentials } from '../slices/authSlice';
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

  const [updateCarrier, { isLoading: isUpdating }] = useUpdateEntityMutation();

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
    }
  }, [entity]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const updatedEntity = await updateCarrier({
        entityId,
        entityNumber,
        name,
        contactPerson,
        email,
        phone,
        location,
      }).unwrap();

      dispatch(setCredentials(updatedEntity));
      toast.success('Entity updated successfully');
      refetch()
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
          <FormGroup label="Entity Number" controlId="entityNumber">
            <Form.Control
              type='text'
              placeholder='Enter entity number'
              value={entityNumber}
              onChange={(e) => setEntityNumber(e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Name" controlId="name">
            <Form.Control
              type='text'
              placeholder='Enter name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup>


          <FormGroup label="Contact Person" controlId="contactPerson">
            <Form.Control
              type='text'
              placeholder='Enter contact person'
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Contact Email" controlId="email">
            <Form.Control
              type='email'
              placeholder='Enter contact email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Contact Phone" controlId="phone">
            <Form.Control
              type='text'
              placeholder='Enter contact phone'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Address" controlId="address">
            <Form.Control
              type='text'
              placeholder='Enter address'
              value={location.address}
              onChange={(e) => setLocation({ ...location, address: e.target.value })}
            />
          </FormGroup>

          <FormGroup label="City" controlId="city">
            <Form.Control
              type='text'
              placeholder='Enter city'
              value={location.city}
              onChange={(e) => setLocation({ ...location, city: e.target.value })}
            />
          </FormGroup>

          <FormGroup label="State" controlId="state">
            <Form.Control
              type='text'
              placeholder='Enter state'
              value={location.state}
              onChange={(e) => setLocation({ ...location, state: e.target.value })}
            />
          </FormGroup>

          <FormGroup label="Country" controlId="country">
            <Form.Control
              type='text'
              placeholder='Enter country'
              value={location.country}
              onChange={(e) => setLocation({ ...location, country: e.target.value })}
            />
          </FormGroup>

          <FormGroup label="Postcode" controlId="postcode">
            <Form.Control
              type='text'
              placeholder='Enter postcode'
              value={location.postcode}
              onChange={(e) => setLocation({ ...location, postcode: e.target.value })}
            />
          </FormGroup>

          <Button type='submit' variant='primary' className='my-2'>
            Update Entity
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

const FormGroup = ({ label, controlId, children }) => (
  <Form.Group controlId={controlId} className='my-2'>
    <Form.Label>{label}</Form.Label>
    {children}
  </Form.Group>
);

export default DatabaseEntityEditScreen;