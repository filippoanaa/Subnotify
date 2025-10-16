import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Card, Col, Row, Button, Alert, Modal } from 'react-bootstrap';
import {jwtDecode} from "jwt-decode";
import Services from "../services/Services";

const LogIn = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userIdAfterLogin, setUserIdAfterLogin] = useState(null);

  const navigate = useNavigate();

  const clearFields = () => {
    setEmail('');
    setPassword('');
  };

  const login = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      clearFields();
      setError('Email and password are required');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const loginResponse = await Services.login({email, password});
      if (loginResponse.status === 200) {  // backend sends { "token": "..." }
        const token = loginResponse.data.jwtToken;
        console.log(token);

        const decodedJwt = jwtDecode(token);

        localStorage.setItem("jwt", token);
        localStorage.setItem("user", JSON.stringify({
          id: decodedJwt.sub,
          firstName: decodedJwt.firstName
        }));
        onLogin(decodedJwt.sub);
        setUserIdAfterLogin(decodedJwt.sub);

        navigate(`/subnotify/your-subscriptions`);


      }

    } catch (error) {
      if (error.response && error.status === 404) {
        setError(error.response.data || "User not found!");
      } else if (error.response && error.response.status === 401) {
        setError("Incorrect email or password.");
      } else {
        setError(`Network error: ${error.message}`);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (userIdAfterLogin !== null) {
      navigate(`/subnotify/your-subscriptions`);
    }
  };

  return (
    <Container className="mt-4">
      {showModal && (
        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Upcoming Subscriptions</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {notifications.map((sub, index) => (
              <Alert key={index} variant="info">
                Subscription to <strong>{sub.name}</strong> is due on <strong>{sub.dueDate}</strong>
              </Alert>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-primary text-white text-center">
              <h4>Welcome!</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={login}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Button type="submit" className="btn btn-success w-100 mt-4">
                  Log in
                </Button>
              </Form>

              <div className="text-center mt-3">
                <a href="/subnotify/signup">Don't have an account? Sign up</a>
              </div>

              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LogIn;