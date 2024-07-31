import { useParams } from 'react-router-dom';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { useGetMyLoadsQuery } from '../slices/loadsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Order from '../components/Order';
import Load from '../components/Load'; // Component for displaying loads

const SearchScreen = () => {
  const { keyword } = useParams();
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useGetMyOrdersQuery({ keyword });
  const { data: loads, isLoading: loadsLoading, error: loadsError } = useGetMyLoadsQuery({ keyword });

  return (
    <>
      {ordersLoading || loadsLoading ? (
        <Loader />
      ) : ordersError || loadsError ? (
        <Message variant='danger'>
          {ordersError?.data?.message || ordersError.error || loadsError?.data?.message || loadsError.error}
        </Message>
      ) : (
        <>
          <h2>Search Results</h2>
          {loads && loads.length > 0 && <Load loads={loads} />}
          {orders && orders.length > 0 && <Order orders={orders} />}
          {!orders?.length && !loads?.length && <p>No results found for "{keyword}".</p>}
        </>
      )}
    </>
  );
};

export default SearchScreen;
