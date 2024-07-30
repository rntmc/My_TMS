import { useState, useEffect } from 'react';
import { Table, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { CgDanger } from "react-icons/cg";
import { FaCheck } from "react-icons/fa";
import { MdAttachFile } from "react-icons/md";
import { useUpdateOrderStatusMutation, useGetOrderDetailsQuery } from '../slices/ordersApiSlice';

const Order = ({ orders: initialOrders }) => {
  const [orders, setOrders] = useState([]);
  const [updateOrderStatus, {error, isLoading}] = useUpdateOrderStatusMutation();

  useEffect(() => {
    if (initialOrders) {
      const formattedOrders = initialOrders.map(order => {
        const totalVolume = order.packages.reduce((sum, pkg) => sum + pkg.volume, 0);
        const totalWeight = order.packages.reduce((sum, pkg) => sum + pkg.weight, 0);
        return {
          ...order,
          pickupDate: new Date(order.pickupDate).toLocaleDateString(),
          deliveryDate: new Date(order.deliveryDate).toLocaleDateString(),
          totalVolume,
          totalWeight,
        };
      });
      setOrders(formattedOrders);
    }
  }, [initialOrders]);

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
            <th>Distance</th>
            <th style={{ width: '120px', textAlign: 'center' }}>Status</th>
          </tr>
        </thead>
        <tbody style={{ fontSize: '12px' }}>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>
                <Link to={`/order/${order._id}`} style={{ color: 'blue' }}>
                  {order.orderNumber}
                </Link>
                {' '}
                {order.dangerousGoods ? (
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`tooltip-dangerous-goods-${order._id}`}>Dangerous Goods</Tooltip>}
                  >
                    <span style={{ display: 'inline-block' }}>
                      <CgDanger style={{ color: 'lightsalmon'}} />
                    </span>
                  </OverlayTrigger>
                ) : ''}
                {' '}
                {order.document.length > 0 ? (
                  <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-documentation-${order._id}`}>Attachments</Tooltip>}
                >
                  <span style={{ display: 'inline-block'}}>
                    <MdAttachFile style={{ color: 'black'}} />
                  </span>
                </OverlayTrigger>
                ) : ''}
              </td>
              <td style={{fontSize:'10px'}}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>
                    {order.origin.entityNumber} {order.origin.entityName}
                  </div> 
                  <div>
                    {order.origin.entityLocation.country} - {order.origin.entityLocation.postcode}  
                  </div>             
                </div>
              </td>
              <td style={{fontSize:'10px'}}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>
                    {order.destination.entityNumber} {order.destination.entityName}
                  </div> 
                  <div>
                    {order.destination.entityLocation.country} - {order.destination.entityLocation.postcode}  
                  </div>             
                </div>
              </td>
              <td style={{fontSize:'10px'}}>
                <div>{order.pickupDate}</div>
                <div>{order.deliveryDate}</div>
              </td>
              <td>{order.totalVolume.toFixed(2)} m&#179;</td>
              <td>{order.totalWeight.toFixed(2)} kg</td>
              <td>$ {order.freightCost.toFixed(2)}</td>
              <td>{order.distance} km</td>
              <td>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent:'center', gap: '0.5rem' }}>
            <span>{order.status}</span>
            {order.status === "open" && (
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
            )}
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
