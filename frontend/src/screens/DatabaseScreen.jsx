import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const DatabaseScreen = () => {
  const navigate = useNavigate();

  const handleNavigation = (role) => {
    navigate(`/database/${role}`);
  };

  return (
    <Row style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <Col xs={12} className="text-center" style={{ marginBottom: '20px' }}>
        <h2>Databases</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Button variant="primary" onClick={() => handleNavigation('users')} style={{ padding: '0.5rem 1rem' }}>
            Users
          </Button>
          <Button variant="secondary" onClick={() => handleNavigation('carriers')} style={{ padding: '0.5rem 1rem' }}>
            Carriers
          </Button>
          <Button variant="success" onClick={() => handleNavigation('admins')} style={{ padding: '0.5rem 1rem' }}>
            Admins
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default DatabaseScreen;
