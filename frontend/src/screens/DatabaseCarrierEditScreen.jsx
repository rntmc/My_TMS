import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import { useGetCarrierQuery, useUpdateCarrierMutation } from '../slices/carriersApiSlice';
import { setCredentials } from '../slices/authSlice';
import Loader from '../components/Loader';

const DatabaseCarrierEditScreen = () => {
  const { id: carrierId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: carrier, isLoading, isError } = useGetCarrierQuery(carrierId);

  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [address, setAddress] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    postcode: '',
  });
  const [servicesOffered, setServicesOffered] = useState('');
  const [insuranceCoverage, setInsuranceCoverage] = useState('');
  const [fleetInfo, setFleetInfo] = useState({
    numberOfVehicles: '',
    vehicleTypes: ''
  });

  const [updateCarrier, { isLoading: isUpdating }] = useUpdateCarrierMutation();

  useEffect(() => {
    if (carrier) {
      setName(carrier.name || '');
      setContactPerson(carrier.contactPerson || '');
      setContactEmail(carrier.contactEmail || '');
      setContactPhone(carrier.contactPhone || '');
      setAddress({
        address: carrier.address?.address || '',
        city: carrier.address?.city || '',
        state: carrier.address?.state || '',
        country: carrier.address?.country || '',
        postcode: carrier.address?.postcode || '',
      });
      setServicesOffered(carrier.servicesOffered || '');
      setInsuranceCoverage(carrier.insuranceCoverage || '');
      setFleetInfo({
        numberOfVehicles: carrier.fleetInfo?.numberOfVehicles || '',
        vehicleTypes: carrier.fleetInfo?.vehicleTypes || '',
      });
    }
  }, [carrier]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const updatedCarrier = await updateCarrier({
        carrierId,
        name,
        contactPerson,
        contactEmail,
        contactPhone,
        address,
        servicesOffered,
        insuranceCoverage,
        fleetInfo,
      }).unwrap();

      dispatch(setCredentials(updatedCarrier));
      toast.success('Carrier updated successfully');
      navigate('/database/carriers');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  if (isLoading || isUpdating) {
    return <Loader />;
  }

  if (isError) {
    return <p>Error loading carrier details</p>;
  }

  return (
    <Row>
      <Col md={6}>
        <h2>Update Carrier</h2>
        <Form onSubmit={submitHandler}>
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

          <FormGroup label="Contact Email" controlId="contactEmail">
            <Form.Control
              type='email'
              placeholder='Enter contact email'
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Contact Phone" controlId="contactPhone">
            <Form.Control
              type='text'
              placeholder='Enter contact phone'
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Address" controlId="address">
            <Form.Control
              type='text'
              placeholder='Enter address'
              value={address.address}
              onChange={(e) => setAddress({ ...address, address: e.target.value })}
            />
          </FormGroup>

          <FormGroup label="City" controlId="city">
            <Form.Control
              type='text'
              placeholder='Enter city'
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
          </FormGroup>

          <FormGroup label="State" controlId="state">
            <Form.Control
              type='text'
              placeholder='Enter state'
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
            />
          </FormGroup>

          <FormGroup label="Country" controlId="country">
            <Form.Control
              type='text'
              placeholder='Enter country'
              value={address.country}
              onChange={(e) => setAddress({ ...address, country: e.target.value })}
            />
          </FormGroup>

          <FormGroup label="Postcode" controlId="postcode">
            <Form.Control
              type='text'
              placeholder='Enter postcode'
              value={address.postcode}
              onChange={(e) => setAddress({ ...address, postcode: e.target.value })}
            />
          </FormGroup>

          <FormGroup label="Services Offered" controlId="servicesOffered">
            <Form.Control
              type='text'
              placeholder='Enter services offered'
              value={servicesOffered}
              onChange={(e) => setServicesOffered(e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Insurance Coverage" controlId="insuranceCoverage">
            <Form.Control
              type='text'
              placeholder='Enter insurance coverage'
              value={insuranceCoverage}
              onChange={(e) => setInsuranceCoverage(e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Number of Vehicles" controlId="numberOfVehicles">
            <Form.Control
              type='text'
              placeholder='Enter number of vehicles'
              value={fleetInfo.numberOfVehicles}
              onChange={(e) => setFleetInfo({ ...fleetInfo, numberOfVehicles: e.target.value })}
            />
          </FormGroup>

          <FormGroup label="Vehicle Types" controlId="vehicleTypes">
            <Form.Control
              type='text'
              placeholder='Enter vehicle types'
              value={fleetInfo.vehicleTypes}
              onChange={(e) => setFleetInfo({ ...fleetInfo, vehicleTypes: e.target.value })}
            />
          </FormGroup>

          <Button type='submit' variant='primary' className='my-2'>
            Update Carrier
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

export default DatabaseCarrierEditScreen;
