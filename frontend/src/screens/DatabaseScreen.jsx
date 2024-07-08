import React from 'react';
import { Table, Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { MdOutlineEdit, MdClose  } from "react-icons/md";
import { useGetUsersQuery } from '../slices/usersApiSlice';

const DatabaseScreen = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  console.log(users)

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching users.</p>;
  }

  return (
    <Row>
      <Col xs={12}>
        <h2>User Database</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} style={{ height: '2rem' }}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.role ? user.role : ''}
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '0.25rem', justifyContent: 'center' }}>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-edit-${user._id}`}>Editar</Tooltip>}
                    >
                      <Button 
                        style={{
                          padding: '0.3rem',
                          backgroundColor: '#a5a9ad',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                        }}>
                        <MdOutlineEdit style={{ fontSize: '1rem' }}/>
                      </Button>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-delete-${user._id}`}>Deletar</Tooltip>}
                    >
                        <Button 
                          style={{
                            padding: '0.3rem',
                            backgroundColor: '#a5a9ad',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                          }}>
                          <MdClose style={{ fontSize: '1rem', color: 'red' }}/>
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

export default DatabaseScreen;
