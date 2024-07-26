import { Row, Col } from 'react-bootstrap';
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
    <Row>
      <Col>
        <h2>My Loads</h2>
          {isLoading ? (
            <Loader/>
           ) : error ? (<Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
        ) : (
          <Load loads={loads}/>
        )}
      </Col>
    </Row>
  );
};

export default MyLoadsScreen;
