import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Card, Col, Row, Button, Alert, Modal, Spinner } from 'react-bootstrap';
import { jwtDecode } from "jwt-decode";
import Services from "../services/Services";

const LogIn = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userIdAfterLogin, setUserIdAfterLogin] = useState(null);

  const navigate = useNavigate();

  const isDueSoon = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const login = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setIsLoading(true);

    try {
      const loginResponse = await Services.login({ email, password });
      if (loginResponse.status === 200) {
        const token = loginResponse.data.jwtToken;
        const decodedJwt = jwtDecode(token);

        localStorage.setItem("jwt", token);
        localStorage.setItem("user", JSON.stringify({
          id: decodedJwt.sub,
          firstName: decodedJwt.firstName
        }));

        onLogin(decodedJwt.sub);
        setUserIdAfterLogin(decodedJwt.sub);

        try {
          const subsResponse = await Services.getAllSubscriptionsForUser(decodedJwt.sub);
          const allSubs = subsResponse.data;
          const dueSoonSubs = allSubs.filter(sub => isDueSoon(sub.dueDate));

          if (dueSoonSubs.length > 0) {
            setNotifications(dueSoonSubs);
            setShowModal(true);
          } else {
            navigate(`/subnotify/your-subscriptions`);
          }
        } catch (subsError) {
          console.error("Failed to fetch subscriptions for notifications:", subsError);
          navigate(`/subnotify/your-subscriptions`);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(error.response.data || "User not found!");
      } else if (error.response && error.response.status === 401) {
        setError("Incorrect email or password.");
      } else {
        setError(`Network error: ${error.message}`);
      }
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (userIdAfterLogin !== null) {
      navigate(`/subnotify/your-subscriptions`);
    }
  };

  return (
      <Container className="mt-5">
        <Modal show={showModal} onHide={handleModalClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>🔔 Upcoming Subscriptions</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>This is a quick reminder for your upcoming payments:</p>
            {notifications.map((sub, index) => (
                <Alert key={index} variant="warning">
                  <strong>{sub.name}</strong> is due on <strong>{formatDate(sub.dueDate)}</strong>
                </Alert>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleModalClose}>
              Got it, thanks!
            </Button>
          </Modal.Footer>
        </Modal>

        <Row className="justify-content-center">
          <Col md={5}>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4">

                <Card.Title as="h3" className="text-center fw-bold mb-2">
                  Welcome Back!
                </Card.Title>
                <Card.Text className="text-center text-muted mb-4">
                  Log in to manage your subscriptions.
                </Card.Text>

                <Form onSubmit={login}>
                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                    />
                  </Form.Group>

                  <Form.Group controlId="formPassword"  className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                  </Form.Group>
                  <Button
                      type="submit"
                      className="btn-success w-100 mt-3"
                      disabled={isLoading}
                  >
                    {isLoading ? (
                        <>
                          <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                          />
                          <span className="ms-2">Loading...</span>
                        </>
                    ) : (
                        "Log In"
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <Link to="/subnotify/signup">Don't have an account? Sign up</Link>
                </div>
                {error && <Alert variant="danger" className="mt-3 text-center">{error}</Alert>}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
  );
};

export default LogIn;