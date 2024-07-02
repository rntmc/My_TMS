import {Row} from 'react-bootstrap'
import Load from '../components/Load'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useGetLoadsQuery } from '../slices/loadsApiSlice'


const HomeScreen = () => {
  const {data: loads, isLoading, error} = useGetLoadsQuery()

  return (
    <>
    { isLoading ? (
      <Loader/>
    ) : error ? (
      <Message variant='danger'>
        {error?.data?.message || error.error}
      </Message>
    ) : (
      <>
        <h1>Loads</h1>
        <Row>
          <Load loads={loads} />
        </Row>
      </>
    )}
      
    </>
  )
}

export default HomeScreen