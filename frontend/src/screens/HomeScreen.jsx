import {Row} from 'react-bootstrap'
import Load from '../components/Load'
import loads from '../loads'

const HomeScreen = () => {
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