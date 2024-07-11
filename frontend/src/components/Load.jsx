import { useState, useEffect } from 'react'
import {Table, OverlayTrigger, Tooltip} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { CgDanger } from "react-icons/cg";
import { FaCheck } from "react-icons/fa"

const Load = () => {
  const [loads, setLoads] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchLoads = async () => {
      try {
        const {data: loads} = await axios.get('/api/loads');
        setLoads(loads); 

        const {data: ordersData} = await axios.get('/api/orders');
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching loads:', error);
      }
    };

    fetchLoads();
  }, [])

  const findOrderById = (orderId) => {
    return orders.find(order => order.orderId === orderId);
  };

  return (
    <>
      <Table striped hover responsive className='table-sm'>
        <thead>
          <tr>
            <th>Load #</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Orders</th>
            <th>Total Cost</th>
            <th>Total Volume</th>
            <th>Total Weight</th>
            <th>Carrier</th>
            <th>Method</th>
            <th>Status</th>

          </tr>
        </thead>
        <tbody style={{ fontSize: '12px' }}>
          {loads.map((load) => (
            <tr key={load.loadId}>
              <td><Link to={`/load/${load._id}`}>{load.loadId}</Link></td>
              <td>
                <div className='disp'>
                  {load.origin.city}, {load.origin.state} <br />
                  {load.origin.country} - {load.origin.postcode}          
                </div>
              </td>
              <td>
                <div className='disp'>
                  {load.destination.city}, {load.destination.state} <br />
                  {load.destination.country} - {load.destination.postcode}          
                </div>
              </td>
              <td>
                {load.orders.map((orderId, index) => {
                  const order = findOrderById(orderId);
                  return (
                    <span key={index}>
                      {order && <Link to={`/order/${order._id}`}>{order.orderId}</Link>}
                      {index !== load.orders.length - 1 && ', '}
                    </span>
                  );
                })}
              </td>
              <td>$ {load.totalFreightCost}</td>
              <td>{load.totalWeight} kg</td>
              <td>{load.totalVolume} m³</td>
              <td>{load.carrier}</td>
              <td>{load.transportType}</td>
              <td>{load.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default Load