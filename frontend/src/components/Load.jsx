import { useState, useEffect } from 'react'
import {Table, OverlayTrigger, Tooltip, Button, Row} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { CgDanger } from "react-icons/cg";
import { FaCheck } from "react-icons/fa"
import {useUpdateLoadStatusMutation} from '../slices/loadsApiSlice'

const Load = () => {
  const [loads, setLoads] = useState([])
  const [orders, setOrders] = useState([])
  const [updateLoadStatus] = useUpdateLoadStatusMutation()

  useEffect(() => {
    const fetchLoads = async () => {
      try {
        const {data: loadsData } = await axios.get('/api/loads');
        setLoads(loadsData ); 

        const {data: ordersData} = await axios.get('/api/orders');
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching loads:', error);
      }
    };

    fetchLoads();
  }, [])

  const findOrderById = (orderId) => {
    return orders.find(order => order._id === orderId);
  };

  const handleStatus = async (loadId) => {
    try {
      // Send the updated status to the server
      await updateLoadStatus({ loadId, status: 'confirmed' });
      
      // Update the status in the local state
      setOrders((prevLoads) =>
        prevLoads.map((load) =>
          load._id === loadId ? { ...load, status: 'confirmed' } : load
        )
      );


    } catch (error) {
      console.error('Error updating load status:', error);
    }
  };

  return (
    <>
      <Table striped hover responsive className='table-sm'>
        <thead style={{ fontSize: '12px' }}>
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
            <tr key={load._id}>
              <td>
                <Row>
                  <Link to={`/load/${load._id}`} style={{color:'blue'}}>{load.loadNumber}</Link>
                </Row>
              </td>
              <td  style={{fontSize:'10px'}}>
                <div style={{ fontWeight: 'bold' }}>
                  {load.origin.entityNumber} {load.origin.entityName}
                </div>
                <div className='disp'>
                  {load.origin.entityLocation.country} - {load.origin.entityLocation.postcode}
                </div>
              </td>
              <td style={{fontSize:'10px'}}>
                <div style={{ fontWeight: 'bold' }}>
                  {load.destination.entityNumber} {load.destination.entityName}
                </div>
                <div className='disp'>
                  {load.destination.entityLocation.country} - {load.destination.entityLocation.postcode}
                </div>
              </td>
              <td>
                {load.orders.length > 0 ? (
                  load.orders.map((order) => {
                    const orderData = orders.find((o) => o.orderNumber === order.orderNumber[0]);
                    return (
                      <div key={order._id}>
                        {orderData ? (
                          <Link to={`/order/${orderData._id}`} style={{ color: 'blue' }}>
                            {order.orderNumber.join(', ')}
                          </Link>
                        ) : (
                          <span>Loading orders...</span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p>Loading orders...</p>
                )}
              </td>
              <td>$ {load.totalFreightCost}</td>
              <td>{load.totalWeight} kg</td>
              <td>{load.totalVolume} m³</td>
              <td>{load.carrierName}</td>
              <td>{load.transportType}</td>
              <td>{load.status}
                <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', justifyContent: 'center' }}>
                  {load.status === "open" ? (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-confirm-${load._id}`}>Confirm</Tooltip>}
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
                        onClick={() => handleStatus(load._id)}
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
  )
}

export default Load