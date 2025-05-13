import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = ({ userId, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout(); 
        navigate('/'); 
    };

    const handleUpdateAccount = () => {
        navigate(`users/${userId}/settings`); 
    };

    return (
        <Navbar bg="dark" variant="dark" expand="true">
            <Navbar.Brand as={Link} to="/">SubNotify</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    {userId ? (
                        <>
                            <Button 
                                variant="outline-light" 
                                className="me-2" 
                                onClick={handleUpdateAccount}
                            >
                                Account Settings
                            </Button>
                            <Button 
                                variant="outline-light" 
                                onClick={handleLogout}
                            >
                                Log Out
                            </Button>
                        </>
                    ) : (
                        <Navbar.Text className="text-light">
                            Welcome! SubNotify is an intuitive application designed to help users manage their subscriptions efficiently. 
                            With SubNotify, you can effortlessly add all your active subscriptions and receive timely notifications as 
                            payment due dates approach. This ensures that you never miss a payment and can keep track of all your subscription 
                            services in one place.
                        </Navbar.Text>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavBar;