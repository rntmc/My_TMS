import React from 'react';
import { Table, Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { MdOutlineEdit, MdClose } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useGetEntitiesQuery, useDeleteEntityMutation } from '../slices/entitiesApiSlice';

const EntityDatabaseScreen = () => {
  const { data: entities, isLoading, isError } = useGetEntitiesQuery();
  const [deleteEntity] = useDeleteEntityMutation()

  const navigate = useNavigate()
  
  const navigateHandler = async (id) => {
    navigate(`/database/editentity/${id}`)
  } 
  
  if (isLoading) {
    return <p>Loading...</p>;
  }
  
  if (isError) {
    return <p>Error fetching entities.</p>;
  }
  
  const deleteEntityHandler = async (id) => {
    const entityToDelete = entities.find(entity => entity._id === id);
  
    if (!entityToDelete) {
      toast.error('Entity not found');
      return;
    }
  
    if (window.confirm('Are you sure?')) {
      try {
        await deleteEntity(id);
        toast.success('Entity deleted')
      } catch(error) {
        console.error('Error deleting entity:', error);
        toast.error(error?.data?.message || error.error)
      }
    }
  }

  return (
    <Row style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <Col xs={12} style={{ marginBottom: '20px' }}>
        <Row>
          <Col md={11}>
            <h2>Entities Database</h2>
          </Col>
          <Col md={1} className="text-center">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Add Entity</Tooltip>}
            >
              <Link to='/database/entitycreation'>
                <Button variant="primary" style={{ padding: '0.3rem', backgroundColor: '#007bff', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <IoMdAdd style={{ fontSize: '1.5rem' }} />
                </Button>  
              </Link>
            </OverlayTrigger>
          </Col>
        </Row>
      </Col>
      <Col xs={12}>
        <Table striped bordered hover style={{ backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Entity Number</th>
              <th>Name</th>
              <th>Contact Person</th>
              <th>Postcode</th>
              <th>Country</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {entities.map((entity, index) => (
              <tr key={entity._id} style={{ height: '2rem' }}>
                <td>{index + 1}</td>
                <td>{entity.entityNumber}</td>
                <td>{entity.name}</td>
                <td>{entity.contactPerson}</td>
                <td>{entity.location.postcode}</td>
                <td>{entity.location.country}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', justifyContent: 'center' }}>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-edit-${entity._id}`}>Edit</Tooltip>}
                    >
                      <Button 
                        style={{
                          padding: '0.3rem',
                          backgroundColor: '#a5a9ad',
                          color: 'white',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: 'none',
                          borderRadius: '5px'
                        }}
                        onClick={() => navigateHandler(entity._id)}
                        >
                        <MdOutlineEdit style={{ fontSize: '1rem' }}/>
                      </Button>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-delete-${entity._id}`}>Delete</Tooltip>}
                    >
                      <Button 
                        style={{
                          padding: '0.3rem',
                          backgroundColor: '#a5a9ad',
                          color: 'red',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: 'none',
                          borderRadius: '5px'
                        }}
                          onClick={() => deleteEntityHandler(entity._id)}
                        >
                        <MdClose style={{ fontSize: '1rem' }}/>
                      </Button>
                    </OverlayTrigger>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default EntityDatabaseScreen;
