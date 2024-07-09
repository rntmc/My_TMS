import React from 'react';
import { Table, Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MdOutlineEdit, MdClose } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useGetSuppliersQuery } from '../slices/suppliersApiSlice';

const SupplierDatabaseScreen = () => {
  const { data: suppliers, isLoading, isError } = useGetSuppliersQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching suppliers.</p>;
  }

  return (
    <Row style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <Col xs={12} style={{ marginBottom: '20px' }}>
        <Row>
          <Col md={11}>
            <h2>Suppliers Database</h2>
          </Col>
          <Col md={1} className="text-center">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Add Supplier</Tooltip>}
            >
              <Link to='/database/suppliercreation'>
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
              <th>Supplier ID</th>
              <th>Name</th>
              <th>Contact Person</th>
              <th>Postcode</th>
              <th>Country</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, index) => (
              <tr key={supplier._id} style={{ height: '2rem' }}>
                <td>{index + 1}</td>
                <td>{supplier.supplierNumber}</td>
                <td>{supplier.name}</td>
                <td>{supplier.contactPerson}</td>
                <td>{supplier.location.postcode}</td>
                <td>{supplier.location.country}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', justifyContent: 'center' }}>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-edit-${supplier._id}`}>Edit</Tooltip>}
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
                        }}>
                        <MdOutlineEdit style={{ fontSize: '1rem' }}/>
                      </Button>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-delete-${supplier._id}`}>Delete</Tooltip>}
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
                        }}>
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

export default SupplierDatabaseScreen;
