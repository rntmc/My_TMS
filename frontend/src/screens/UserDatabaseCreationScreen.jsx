import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { useNavigate } from 'react-router-dom';

const UserDatabaseCreationScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const navigate = useNavigate()

  const [registerUser, { isLoading, error }] = useRegisterMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    const userData = { name, email, password, role };

    try {
      const response = await registerUser(userData).unwrap();
      console.log('User created:', response);
      // Clear form fields or perform additional actions upon successful user creation
      setName('');
      setEmail('');
      setPassword('');
      setRole('');   // Reset role selections
      navigate('/database/users')
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  return (
    <Row>
      <Col xs={12} md={6}>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='mt-2'>
            <Form.Check
              type="radio"
              label="Admin"
              id="admin"
              name="role" // Use same name for all radio buttons
              value="Admin"
              checked={role === 'Admin'}
              onChange={(e) => setRole(e.target.value)}
            />
            <Form.Check
              type="radio"
              label="User"
              id="user"
              name="role"
              value="User"
              checked={role === 'User'}
              onChange={(e) => setRole(e.target.value)}
            />
            <Form.Check
              type="radio"
              label="Carrier"
              id="carrier"
              name="role"
              value="Carrier"
              checked={role === 'Carrier'}
              onChange={(e) => setRole(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={isLoading} className='mt-2'>
            {isLoading ? 'Creating...' : 'Create User'}
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default UserDatabaseCreationScreen;
