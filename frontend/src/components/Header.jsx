import {Navbar, Nav, Container} from 'react-bootstrap';
import {FaTruckPlane, FaUser} from 'react-icons/fa6';
import logo4 from '../assets/logo4.jpg'

const Header = () => {
  return (
    <header>
      <Navbar style={{ backgroundColor: 'var(--bs-blue)' }} variant='dark' expand='md' collapseOnSelect>
        <Container>
          <Navbar.Brand href='/'>
            <img src={logo4} alt='My_TMS' style={{ width:  '26px', height: 'auto', marginRight: '10px' }}/>
            My_TMS
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'> {/*align items to the right*/}
              <Nav.Link href="/transport"><FaTruckPlane/> Transport</Nav.Link>
              <Nav.Link href="/login"><FaUser/> Sign In</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header