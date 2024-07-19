import {useNavigate} from 'react-router-dom'
import {Navbar, Nav, Container, NavDropdown} from 'react-bootstrap';
import {FaTruckPlane, FaUser} from 'react-icons/fa6';
import {LinkContainer} from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import {logout} from '../slices/authSlice'
import logo4 from '../assets/logo4.jpg'

const Header = () => {
  const {userInfo} = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async() => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout()) //clearing localstorage
      navigate('/login')
    } catch (error) {
      console.log(error)
    }
  }

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
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  {userInfo && userInfo.role === "Admin" && (
                    <LinkContainer to='database'>
                      <NavDropdown.Item>Database</NavDropdown.Item>
                    </LinkContainer>
                  )}
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link><FaUser/> Sign In</Nav.Link>
               </LinkContainer>
              )}
   
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header