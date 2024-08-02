import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useAddCarrierMutation } from '../slices/carriersApiSlice';
import { useNavigate, Link } from 'react-router-dom';

const CarrierDatabaseCreationScreen = () => {
  const [carrierNumber, setCarrierNumber] = useState('');
  const [carrierName, setCarrierName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [location, setLocation] = useState({
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

  const navigate = useNavigate()

  const [registerUser, { isLoading }] = useAddCarrierMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {

    const carrierData = {
      carrierNumber,
      carrierName,
      contactPerson,
      contactInfo: { email: contactEmail, phone: contactPhone },
      location,
      servicesOffered: servicesOffered.split(',').map(service => service.trim()),
      insuranceCoverage,
      fleetInfo: {
        ...fleetInfo,
        vehicleTypes: fleetInfo.vehicleTypes.split(',').map(type => type.trim())
      }
    };

    const response = await registerUser(carrierData).unwrap();
    console.log('Carrier created:', response);

    setCarrierNumber('');
      setCarrierName('');
      setContactPerson('');
      setContactEmail('');
      setContactPhone('');
      setLocation({
        address: '',
        city: '',
        state: '',
        country: '',
        postcode: '',
      });
      setServicesOffered('');
      setInsuranceCoverage('');
      setFleetInfo({
        numberOfVehicles: '',
        vehicleTypes: ''
      });
      navigate('/database/carriers');
    } catch (err) {
      console.error('Error creating carrirt:', err);
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

    <Row className="justify-content-md-center">
      <Col xs={12} md={8}>
        <h1>Create Carrier</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>Carrier Number</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Carrier ID"
              value={carrierNumber}
              onChange={(e) => setCarrierNumber(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>Carrier Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={carrierName}
              onChange={(e) => setCarrierName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="contactPerson" className="mb-3">
            <Form.Label>Contact Person</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter contact name"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="contactEmail" className="mb-3">
            <Form.Label>Contact Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter contact email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="contactPhone" className="mb-3">
            <Form.Label>Contact Phone</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter contact phone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
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
              onChange={(e) => setLocation({ ...location, address: e.target.value })}
              required
            />
          </Form.Group>
          
          <Form.Group controlId="city" className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter city"
              value={location.city}
              onChange={(e) => setLocation({ ...location, city: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group controlId="state" className="mb-3">
            <Form.Label>State</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter state"
              value={location.state}
              onChange={(e) => setLocation({ ...location, state: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group controlId="country" className="mb-3">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter country"
              value={location.country}
              onChange={(e) => setLocation({ ...location, country: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group controlId="postcode" className="mb-3">
            <Form.Label>Postcode</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter postcode"
              value={location.postcode}
              onChange={(e) => setLocation({ ...location, postcode: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group controlId="servicesOffered" className="mb-3">
            <Form.Label>Services Offered (comma separated)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter services offered"
              value={servicesOffered}
              onChange={(e) => setServicesOffered(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="insuranceCoverage" className="mb-3">
            <Form.Label>Insurance Coverage</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter insurance coverage"
              value={insuranceCoverage}
              onChange={(e) => setInsuranceCoverage(e.target.value)}
              required
            />
          </Form.Group>

          <h3>Fleet Information</h3>
          <Form.Group controlId="numberOfVehicles" className="mb-3">
            <Form.Label>Number of Vehicles</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter number of vehicles"
              value={fleetInfo.numberOfVehicles}
              onChange={(e) => setFleetInfo({ ...fleetInfo, numberOfVehicles: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group controlId="vehicleTypes" className="mb-3">
            <Form.Label>Vehicle Types (comma separated)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter vehicle types"
              value={fleetInfo.vehicleTypes}
              onChange={(e) => setFleetInfo({ ...fleetInfo, vehicleTypes: e.target.value })}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Carrier'}
          </Button>
        </Form>
      </Col>
    </Row>
    </>
  );
};

export default CarrierDatabaseCreationScreen;