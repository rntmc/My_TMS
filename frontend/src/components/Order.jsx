import { useState, useEffect } from 'react';
import { Table, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CgDanger } from "react-icons/cg";
import { FaCheck } from "react-icons/fa";
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '../slices/ordersApiSlice';

const Order = () => {
  const { data: ordersData, error, isLoading } = useGetOrdersQuery();
  const [orders, setOrders] = useState([]);
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  useEffect(() => {
    if (ordersData) {
      const formattedOrders = ordersData.map(order => ({
        ...order,
        pickupDate: new Date(order.pickupDate).toLocaleDateString(),
        deliveryDate: new Date(order.deliveryDate).toLocaleDateString(),
      }));
      setOrders(formattedOrders);
    }
  }, [ordersData]);

  const handleStatus = async (orderId) => {
    try {
      // Update the status in the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: 'confirmed' } : order
        )
      );

      // Send the updated status to the server
      await updateOrderStatus({ orderId, status: 'confirmed' });

    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Table striped hover responsive className='table-sm'>
        <thead style={{ fontSize: '12px' }}>
          <tr>
            <th>Order #</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>
              <div>Pickup Date</div>
              <div>Delivery Date</div>
            </th>
            <th>Volume</th>
            <th>Weight</th>
            <th>Freight Cost</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody style={{ fontSize: '12px' }}>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>
                <Link to={`/order/${order._id}`}>{order.orderId}</Link>
                {' '}{order.dangerousGoods ? <CgDanger style={{color:"lightsalmon"}}/> : ''}
              </td>
              <td>
                <div>
                  <div style={{ fontWeight: 'bold' }}>
                    {order.origin.entityNumber} {order.origin.entityName}
                  </div> 
                  <div>
                    {order.origin.entityLocation.city}, {order.origin.entityLocation.state}, {order.origin.entityLocation.country}<br />
                    {order.origin.entityLocation.postcode}  
                  </div>             
                </div>
              </td>
              <td>
                <div>
                  <div style={{ fontWeight: 'bold' }}>
                    {order.destination.entityNumber} {order.destination.entityName}
                  </div> 
                  <div>
                    {order.destination.entityLocation.city}, {order.destination.entityLocation.state}, {order.destination.entityLocation.country}<br />
                    {order.destination.entityLocation.postcode}  
                  </div>             
                </div>
              </td>
              <td>
                <div>{order.pickupDate}</div>
                <div>{order.deliveryDate}</div>
              </td>
              <td>{order.volume} m&#179;</td>
              <td>{order.weight} kg</td>
              <td>$ {order.freightCost}</td>
              <td>{order.status}
                <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', justifyContent: 'center' }}>
                  {order.status === "open" ? (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-confirm-${order._id}`}>Confirm</Tooltip>}
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
                        onClick={() => handleStatus(order._id)}
                      >
                        <FaCheck style={{ fontSize: '1rem', color: "green" }}/>
                      </Button>
                    </OverlayTrigger>
                  ) : ("")}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Order;
