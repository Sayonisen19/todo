import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { toast } from 'react-toastify';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const Navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set isLoggedIn to true if a token exists
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    setIsLoggedIn(false);
    toast.success('Logged out successfully');
    Navigate('/signin'); // Redirect the user to the signin page
  };

  return (
    <Navbar expand="lg" className="navbar">
      <Container>
        <Navbar.Brand href="/" className="navbar-brand">ToDo</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler" />
        <Navbar.Collapse id="basic-navbar-nav" className="navbar-collapse">
          <Nav className="me-auto">
            {!isLoggedIn ? (
              <>
                <Link to="/signup" className="nav-link">Signup</Link>
                <Link to="/signin" className="nav-link">Signin</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="nav-link btn btn-link" style={{ textDecoration: 'none' }}>
                Logout
              </button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
