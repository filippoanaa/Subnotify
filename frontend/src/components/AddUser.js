import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import { Alert, Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const AddUser = ({ onLogin }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const clearFields = () => {
        setEmail('');
        setFirstName('');
        setLastName('');
        setPassword('');
        setPasswordConfirmation('');
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        if (!firstName || !lastName || !email || !password || !passwordConfirmation) {
            setError("All fields must be completed!");
            return;
        }

        if (password !== passwordConfirmation) {
            setError("Passwords do not match!");
            clearFields();
            return;
        }

        const user = { lastName, firstName, email, password };

        try {
            const response = await UserService.createUser(user);
            if(response.status == 201){
                const userId = response.data.id;
                onLogin(userId);
                navigate(`/users/${userId}/subscriptions`);
            }else if(response.status == 409){
                setError("Email already in use!");
                setTimeout(() => setError(''), 3000);
                clearFields();
            }
            
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data);
                setTimeout(() => setError(''), 3000);
                clearFields();
            } else {
                setError('An error occurred: ' + error.message);
                setTimeout(() => setError(''), 3000);
                clearFields();
            }
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
                            <Form onSubmit={handleAddUser}>
                                <Form.Group className="mb-3">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter first name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter last name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password again"
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    />
                                </Form.Group>

                                <Button type="submit" className="w-100" variant="success">
                                    Sign up
                                </Button>
                                <Link to="/" className="btn btn-danger w-100 mt-2">
                                    Cancel
                                </Link>
                            </Form>
                            {error && <Alert variant="danger">{error}</Alert>}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AddUser;