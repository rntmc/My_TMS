import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyLoadsQuery } from '../slices/loadsApiSlice';
import { setCredentials } from '../slices/authSlice';
import Loader from '../components/Loader';
import Message from '../components/Message'
import Load from '../components/Load';

const MyLoadsScreen = () => {
  const {data: loads, isLoading, error} = useGetMyLoadsQuery()

  return (
    <>
    {isLoading ? (
      <Loader />
    ) : error ? (
      <Message variant='danger'>
        {error?.data?.message || error.error}
      </Message>
    ) : (
      <>
        <Row>
          <Col md={10}>
            <h2>My Loads</h2>
          </Col>
          </Row>
          <Row>
            <Load loads={loads} />
        </Row>
      </>
    )}
  </>
);
};

export default MyLoadsScreen;
