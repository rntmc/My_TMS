import {Row} from 'react-bootstrap'
import Load from '../components/Load'
import Order from '../components/Order'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useGetLoadsQuery } from '../slices/loadsApiSlice'
import { useGetOrdersQuery } from '../slices/ordersApiSlice'


const HomeScreen = () => {
  const {data: loads, isLoading, error} = useGetLoadsQuery()
  const {data: orders} = useGetOrdersQuery()

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

        <h1>Orders</h1>
        <Row>
          <Order orders={orders}/>
        </Row>
      </>
    )}
      
    </>
  )
}

export default HomeScreen