import {Table} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import loads from '../loads'

const Load = ({ load }) => {
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
            <tr key={load._id}>
              <td><Link to={`/load/${load._id}`}>{load._id}</Link></td>
              <td>{load.origin}</td>
              <td>{load.destination}</td>
              <td>
                {load.orders.map((order, index) => (
                  <span key={index}>
                    <Link to={`/load/${order}`}>{order}</Link>
                    {index !== load.orders.length - 1 && ', '}
                  </span>
                ))}
              </td>
              <td>{load.carrier}</td>
              <td>{load.method}</td>
              <td>$ {load.freightCost}</td>
              <td>{load.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default Load