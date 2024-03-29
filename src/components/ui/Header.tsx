import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';



function Header() {
  return (
    <Navbar expand="lg" className="bg-green-200 text-brown-500">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" role="navigation">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/homefeed" className="text-lg">HomeFeed</Nav.Link>
            <Nav.Link as={Link} to="/addtasks" className="text-lg">Add Tasks</Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/mytasks" className="text-lg">My Tasks</Nav.Link>
            <Nav.Link as={Link} to="/myprofile" className="text-lg">My Profile</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
