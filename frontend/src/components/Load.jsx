import { useState, useEffect } from 'react'
import {Table} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'


const Load = () => {
  const [loads, setLoads] = useState([])


  useEffect(() => {
    const fetchLoads = async () => {
      try {
        const {data} = await axios.get('/api/loads');
        console.log(data)
        setLoads(data); 
      } catch (error) {
        console.error('Error fetching loads:', error);
      }
    };

    fetchLoads();
  }, [])

  return (
    <>
      <Table striped hover responsive className='table-sm'>
        <thead>
          <tr>
            <th>Load #</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Orders</th>
            <th>Carrier</th>
            <th>Method</th>
            <th>Price</th>
            <th>Status</th>

          </tr>
        </thead>
        <tbody>
          {loads.map((load) => (
            <tr key={load.loadId}>
              <td><Link to={`/load/${load._id}`}>{load.loadId}</Link></td>
              <td>{load.origin.city}</td>
              <td>{load.destination.city}</td>
              <td>
                {load.orders.map((order, index) => (
                  <span key={index}>
                    <Link to={`/order/${order}`}>{order}</Link>
                    {index !== load.orders.length - 1 && ', '}
                  </span>
                ))}
              </td>
              <td>{load.carrier}</td>
              <td>{load.transportType}</td>
              <td>$ {load.totalFreightCost}</td>
              <td>{load.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default Load