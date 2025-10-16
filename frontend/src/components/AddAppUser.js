import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { jwtDecode } from "jwt-decode";
import Services from "../services/Services";

const AddAppUser = ({ onLogin }) => {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const clearFields = () => {
        setForm({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            passwordConfirmation: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddAppUser = async (e) => {
        e.preventDefault();
        const { firstName, lastName, email, password, passwordConfirmation } = form;

        if (!firstName || !lastName || !email || !password || !passwordConfirmation) {
            setError("All fields must be completed!");
            return;
        }
        if (password !== passwordConfirmation) {
            setError("Passwords do not match!");
            return;
        }

        const user = { firstName, lastName, email, password, passwordConfirmation };

        try {
            const registerResponse = await Services.createAppUser(user);

            if (registerResponse.status === 200) {
                const loginPayload = { email, password };
                const loginResponse = await Services.login(loginPayload);

                if (loginResponse.status === 200) {
                    const token = loginResponse.data.jwtToken;
                    const decodedJwt = jwtDecode(token);

                    localStorage.setItem("jwt", token);
                    localStorage.setItem("user", JSON.stringify({
                        id: decodedJwt.sub,
                        firstName: decodedJwt.firstName,
                    }));

                    onLogin(decodedJwt.sub);
                    navigate(`/subnotify}/your-subscriptions`);
                } else {
                    setError("Login failed after registration.");
                }
            } else if (registerResponse.status === 409) {
                setError("Email already in use!");
                setTimeout(() => setError(''), 3000);
                clearFields();
            }
        } catch (error) {
            if (error.response?.data) {
                setError(error.response.data);
            } else {
                setError("An error occurred: " + error.message);
            }
            setTimeout(() => setError(''), 3000);
            clearFields();
        }
    };

    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card>
                        <Card.Header className="bg-primary text-white text-center">
                            <h4>Create account</h4>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleAddAppUser}>
                                <Form.Group className="mb-3">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        placeholder="Enter first name"
                                        value={form.firstName}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        placeholder="Enter last name"
                                        value={form.lastName}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="Enter email"
                                        value={form.email}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Enter password"
                                        value={form.password}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="passwordConfirmation"
                                        placeholder="Enter password again"
                                        value={form.passwordConfirmation}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Button type="submit" className="w-100" variant="success">
                                    Sign up
                                </Button>
                                <Link to="/" className="btn btn-danger w-100 mt-2">
                                    Cancel
                                </Link>
                            </Form>
                            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AddAppUser;