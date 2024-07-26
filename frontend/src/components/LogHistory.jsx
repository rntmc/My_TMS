import React, { useState } from 'react';
import { Row, Col, ListGroup, Button } from 'react-bootstrap';

const LogHistory = ({ trackingInfo }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Row className="mb-3">
      <Col md={8}>
        <ListGroup.Item style={{ fontSize: '0.875rem' }}>
          <strong>Log History:</strong>
          <Button variant="info" onClick={toggleExpand} style={{ marginLeft: '10px', color: 'white' }}>
            {expanded ? 'Hide' : 'Show'}
          </Button>
          {expanded && trackingInfo && (
            <ListGroup variant="flush">
              {trackingInfo.map((log, index) => (
                <ListGroup.Item key={index} style={{ padding: '6px', fontSize: '10px' }}>
                  <strong>User:</strong> {log.user} <br />
                  <strong>Action:</strong> {log.action} <br />
                  <strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </ListGroup.Item>
      </Col>
    </Row>
  );
};

export default LogHistory