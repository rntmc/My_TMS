import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomeScreen = () => {
  const { userInfo } = useSelector((state) => state.auth)

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>Welcome to My_TMS {userInfo.name}</h2>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Manage Bookings</Card.Title>
              <Card.Text>
                View and manage all your bookings.
              </Card.Text>
              <Link to="/bookings">
                <Button variant="primary">Go to Bookings</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>View Database</Card.Title>
              <Card.Text>
                Explore and manage your database entries.
              </Card.Text>
              <Link to="/database">
                <Button variant="primary">Go to Database</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Update Profile</Card.Title>
              <Card.Text>
                Update your profile information.
              </Card.Text>
              <Link to="/profile">
                <Button variant="primary">Update Profile</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Analytics Overview</Card.Title>
              <Card.Text>
                Monitor key analytics and trends here.
              </Card.Text>
              <Button variant="primary">View Analytics</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Help & Support</Card.Title>
              <Card.Text>
                Need assistance? Get help here.
              </Card.Text>
              <Button variant="primary">Support Center</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Recent Activity</Card.Title>
              <Card.Text>
                View recent updates and activities.
              </Card.Text>
              <Button variant="primary">View Activity Feed</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomeScreen;
