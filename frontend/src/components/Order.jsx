import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CgDanger } from "react-icons/cg";

const Order = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders');
        data.forEach(order => {
          order.pickupDate = new Date(order.pickupDate).toLocaleDateString();
          order.deliveryDate = new Date(order.deliveryDate).toLocaleDateString();
        });
        setOrders(data); 
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <Table striped hover responsive className='table-sm'>
        <thead style={{ fontSize: '12px' }}>
          <tr>
            <th>Order #</th>
            <th></th>
            <th>Origin</th>
            <th>Destination</th>
            <th>
              <div>Pickup Date</div>
              <div>Delivery Date</div>
            </th>
            <th>Volume</th>
            <th>Weight</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody style={{ fontSize: '12px' }}>
          {orders.map((order) => (
            <tr key={order._id}>
              <td><Link to={`/order/${order._id}`}>{order.orderId}</Link></td>
              <td>
                {order.dangerousGoods ? <CgDanger /> : ''}
              </td>
              <td>
                <div>
                  <div style={{ fontWeight: 'bold' }}>
                    {order.origin.supplierNumber} {order.origin.supplierName}
                  </div> 
                  <div>
                    {order.origin.supplierLocation.city}, {order.origin.supplierLocation.state}, {order.origin.supplierLocation.country}<br />
                    {order.origin.supplierLocation.postcode}  
                  </div>             
                </div>
              </td>
              <td>
                <div>
                  <div style={{ fontWeight: 'bold' }}>
                    {order.destination.plantNumber} {order.destination.plantName}
                  </div> 
                  <div>
                    {order.destination.plantLocation.city}, {order.destination.plantLocation.state}, {order.destination.plantLocation.country}<br />
                    {order.destination.plantLocation.postcode}  
                  </div>             
                </div>
              </td>
              <td>
                <div>{order.pickupDate}</div>
                <div>{order.deliveryDate}</div>
              </td>
              <td>{order.volume} m³</td>
              <td>{order.weight} kg</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Order;
