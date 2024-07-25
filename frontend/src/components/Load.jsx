import { useState, useEffect } from 'react'
import {Table, OverlayTrigger, Tooltip, Button, Row} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { CgDanger } from "react-icons/cg";
import { FaCheck } from "react-icons/fa"
import { MdAttachFile } from "react-icons/md";
import {useUpdateLoadStatusMutation, useGetLoadsQuery} from '../slices/loadsApiSlice'
import {useGetOrdersQuery} from '../slices/ordersApiSlice'

const Load = ({ loads: initialLoads }) => {
  const [loads, setLoads] = useState([])
  const [orders, setOrders] = useState([])
  const [totals, setTotals] = useState({});
  const [updateLoadStatus] = useUpdateLoadStatusMutation()
  
  const { data: loadsData, refetch: refetchLoads } = useGetLoadsQuery();
  const { data: ordersData } = useGetOrdersQuery();

  useEffect(() => {
    if (initialLoads) {
      setLoads(initialLoads);
    }
    if (ordersData) {
      setOrders(ordersData);
    }
  }, [initialLoads, ordersData]);

  useEffect(() => {
    if (orders.length > 0 && loads.length > 0) {
      const newTotals = {};

      loads.forEach(load => {
        const loadOrders = load.orders.map(order =>
          orders.find(o => o._id === order._id)
        );

        const totalVolume = loadOrders.reduce((acc, order) => {
          if (order && order.packages) {
            return acc + order.packages.reduce((pAcc, pkg) => pAcc + pkg.volume, 0);
          }
          return acc;
        }, 0);

        const totalWeight = loadOrders.reduce((acc, order) => {
          if (order && order.packages) {
            return acc + order.packages.reduce((pAcc, pkg) => pAcc + pkg.weight, 0);
          }
          return acc;
        }, 0);

        const totalFreightCost = loadOrders.reduce((acc, order) => acc + (order ? order.freightCost : 0), 0);

        newTotals[load._id] = {
          totalVolume,
          totalWeight,
          totalFreightCost
        };
      });

      setTotals(newTotals);
    }
  }, [orders, loads]);

  const handleStatus = async (loadId) => {
    try {
      // Send the updated status to the server
      await updateLoadStatus({ loadId, status: 'confirmed' });

      await refetchLoads()
      
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
            <th>Cost</th>
            <th>Volume</th>
            <th>Weight</th>
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
                    const orderData = orders.find((o) => o._id === order._id);
                    return (
                      <div key={order._id}>
                        {orderData ? (
                          <>
                            <Link to={`/order/${orderData._id}`} style={{ color: 'blue' }}>
                              {orderData.orderNumber}
                            </Link>
                            {orderData.dangerousGoods && (
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip id={`tooltip-dangerous-goods-${order._id}`}>Dangerous Goods</Tooltip>}
                              >
                                <span style={{ display: 'inline-block' }}>
                                  <CgDanger style={{ color: 'lightsalmon', marginLeft: '2px' }} />
                                </span>
                              </OverlayTrigger>
                            )}
                            {orderData.document.length > 0 && (
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip id={`tooltip-documentation-${order._id}`}>Attachments</Tooltip>}
                              >
                                <span style={{ display: 'inline-block' }}>
                                  <MdAttachFile style={{ color: 'black' }} />
                                </span>
                              </OverlayTrigger>
                            )}
                          </>
                        ) : (
                          <p>Loading orders...</p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p></p>
                )}
              </td>
              <td>$ {totals[load._id]?.totalFreightCost.toFixed(2) ?? load.totalFreightCost.toFixed(2)}</td>
              <td>{totals[load._id]?.totalVolume.toFixed(2) ?? load.totalVolume.toFixed(2)} m³</td>
              <td>{totals[load._id]?.totalWeight.toFixed(2) ?? load.totalWeight.toFixed(2)} kg</td>
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