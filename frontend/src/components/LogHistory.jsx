import React, { useState } from 'react';
import { Row, Col, ListGroup, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { MdExpandMore, MdExpandLess } from "react-icons/md";

const LogHistory = ({ trackingInfo }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Row className="mb-3">
      <Col md={8}>
        <ListGroup.Item style={{ fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-expand-${expanded ? 'hide' : 'show'}`}>{expanded ? 'Hide logs' : 'Show logs'}</Tooltip>}
              >
                <Button
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#b9bcbf', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    border: 'none',
                    fontSize: '1rem',
                    justifyContent: 'center'
                  }}
                  onClick={toggleExpand}
                >
                  <span style={{ marginRight: '5px' }}>Log History</span>
                  {expanded ? (
                    <MdExpandLess style={{ fontSize: '1rem' }} />
                  ) : (
                    <MdExpandMore style={{ fontSize: '1rem' }} />
                  )}
                </Button>
              </OverlayTrigger>
            </div>
          </div>
          {expanded && trackingInfo && (
            <ListGroup variant="flush" style={{ marginTop: '10px' }}>
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

export default LogHistory;
