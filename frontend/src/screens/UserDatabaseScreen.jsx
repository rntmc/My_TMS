import React from 'react';
import { Table, Row, Col, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MdOutlineEdit, MdClose } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { toast } from "react-toastify";
import { useGetUsersQuery, useDeleteUserMutation } from '../slices/usersApiSlice';

const UserDatabaseScreen = () => {
  const navigate = useNavigate()

  const { data: users, isLoading, isError } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation()
  console.log(users)

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching users.</p>;
  }

  const navigateHandler = async (id) => {
    navigate(`/database/edituser/${id}`)
  }
  
  const deleteHandler = async (id) => {
  console.log(`Deleting user with id: ${id}`);
  const userToDelete = users.find(user => user._id === id);

  if (!userToDelete) {
    toast.error('User not found');
    return;
  }

  if (userToDelete.role === 'Admin') {
    toast.error('Cannot delete admin users');
    return;
  }

  if (window.confirm('Are you sure?')) {
    try {
      console.log(`Attempting to delete user with id: ${id}`);
      const response = await deleteUser(id);
      console.log(`User deleted response:`, response);
      toast.success('User deleted')
    } catch(error) {
      console.error('Error deleting user:', error);
      toast.error(error?.data?.message || error.error)
    }
  }
}


  return (
    <Row style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <Col xs={12} style={{ marginBottom: '20px' }}>
        <Row>
          <Col md={11}>
            <h2>Users Database</h2>
          </Col>
          <Col md={1} className="text-center">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Add User</Tooltip>}
            >
              <Link to='/database/usercreation'>
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
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} style={{ height: '2rem' }}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role ? user.role : ''}</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', justifyContent: 'center' }}>
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
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: 'none',
                          borderRadius: '5px'
                        }}
                        onClick={() => navigateHandler(user._id)}
                        >
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
                          color: 'red',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: 'none',
                          borderRadius: '5px'
                        }}
                        onClick={() => deleteHandler(user._id)}
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

export default UserDatabaseScreen;