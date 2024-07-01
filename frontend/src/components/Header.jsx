import {Navbar, Nav, Container} from 'react-bootstrap';
import {FaTruckPlane, FaUser} from 'react-icons/fa6';
import {LinkContainer} from 'react-router-bootstrap'
import logo4 from '../assets/logo4.jpg'
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <Navbar style={{ backgroundColor: 'var(--bs-blue)' }} variant='dark' expand='md' collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img src={logo4} alt='My_TMS' style={{ width:  '26px', height: 'auto', marginRight: '10px' }}/>
              My_TMS
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'> {/*align items to the right*/}
              <LinkContainer to="/bookings">
                <Nav.Link ><FaTruckPlane/> Bookings</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/login">
                <Nav.Link><FaUser/> Sign In</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header