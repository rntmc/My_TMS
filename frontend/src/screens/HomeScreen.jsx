import { useEffect, useState } from 'react'
import axios from 'axios'
import {Row} from 'react-bootstrap'
import Load from '../components/Load'


const HomeScreen = () => {
  const [loads, setLoads] = useState([])

  useEffect(() => {
    const fetchLoads = async () => {
      const {data} = await axios.get('/api/loads');
      setLoads(data)
    };

    fetchLoads()
  }, [])

  return (
    <>
      <h1>Loads</h1>
        <Row>
          <Load loads={loads} />
        </Row>
    </>
  )
}

export default HomeScreen