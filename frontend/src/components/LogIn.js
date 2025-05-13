import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Card, Col, Row, Button, Alert, Modal } from 'react-bootstrap';
import UserService from '../services/UserService';
import SubscriptionService from '../services/SubscriptionService';

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
      const response = await UserService.login({ email, password });
      if (response.status === 200) {
        const userId = response.data.id;
        onLogin(userId);
        setUserIdAfterLogin(userId);

        try {
          const dueSoonResponse = await SubscriptionService.getSubscriptionsDueSoon(userId);
          if (dueSoonResponse.data?.length > 0) {
            setNotifications(dueSoonResponse.data);
            setShowModal(true); 
          } else {
            navigate(`/users/${userId}/subscriptions`);
          }
        } catch (subError) {
          console.error('Error fetching subscriptions due soon:', subError);
          navigate(`/users/${userId}/subscriptions`);
        }

      } else if (response.status === 401) {
        clearFields();
        setError('Incorrect email or password');
      } else if (response.status === 404) {
        clearFields();
        setError('User not found');
      } else {
        clearFields();
        setError('Login failed');
      }

      setTimeout(() => setError(''), 3000);
    } catch (error) {
      console.error('Error during login:', error);
      clearFields();
      setError(`Network error: ${error.message}`);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (userIdAfterLogin !== null) {
      navigate(`/users/${userIdAfterLogin}/subscriptions`);
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
                <a href="/signup">Don't have an account? Sign up</a>
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
