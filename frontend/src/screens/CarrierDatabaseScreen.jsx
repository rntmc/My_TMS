import React from 'react';
import { Table, Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { MdOutlineEdit, MdClose } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { useGetCarriersQuery, useDeleteCarriersMutation } from '../slices/carriersApiSlice';

const CarrierDatabaseScreen = () => {
  const { data: carriers, isLoading, isError } = useGetCarriersQuery();
  const [deleteCarrier] = useDeleteCarriersMutation();

  const navigate = useNavigate()

  const navigateHandler = async (id) => {
    navigate(`/database/editcarrier/${id}`)
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching users.</p>;
  }

  const deleteCarrierHandler = async (id) => {
    const carrierToDelete = carriers.find(carrier => carrier._id === id);
  
    if (!carrierToDelete) {
      toast.error('Carrier not found');
      return;
    }
  
    if (window.confirm('Are you sure?')) {
      try {
        await deleteCarrier(id);
        toast.success('Carrier deleted')
      } catch(error) {
        console.error('Error deleting carrier:', error);
        toast.error(error?.data?.message || error.error)
      }
    }
  }

  return (
    <>
    <Row>
    <Col md={12}>
      <Link className='btn btn-light my-3' to='/database'>
        Return
      </Link>
    </Col>
  </Row>

    <Row style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <Col xs={12} style={{ marginBottom: '20px' }}>
        <Row>
          <Col md={10}>
            <h2>Carriers Database</h2>
          </Col>
          <Col md={2} className="d-flex justify-content-end align-items-center">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Create Carrier</Tooltip>}
            >
              <Link to='/database/carriercreation' style={{ textDecoration: 'none' }}>
                <Button style={{ padding: '0.5rem 0.8rem', backgroundColor: '#677074', color: '#fff', border: 'none' }}>
                  Carrier
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
              <th>Carrier Number</th>
              <th>Carrier Name</th>
              <th>Contact Person</th>
              <th>Postcode</th>
              <th>Country</th>
              <th>Services Offered</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {carriers.map((carrier, index) => (
              <tr key={carrier._id} style={{ height: '2rem' }}>
                <td>{index + 1}</td>
                <td>{carrier.carrierNumber}</td>
                <td>{carrier.carrierName}</td>
                <td>{carrier.contactPerson}</td>
                <td>{carrier.location.postcode}</td>
                <td>{carrier.location.country}</td>
                <td>{carrier.servicesOffered.join(', ')}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', justifyContent: 'center' }}>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-edit-${carrier._id}`}>Edit</Tooltip>}
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
                        onClick={() => navigateHandler(carrier._id)}
                        >
                        <MdOutlineEdit style={{ fontSize: '1rem' }}/>
                      </Button>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-delete-${carrier._id}`}>Delete</Tooltip>}
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
                          onClick={() => deleteCarrierHandler(carrier._id)}
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
    </>
  );
};

export default CarrierDatabaseScreen;
