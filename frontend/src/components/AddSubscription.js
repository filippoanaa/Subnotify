import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SubscriptionService from '../services/SubscriptionService';
import { Card, Form, Button, Container, Row, Col, Alert, InputGroup } from 'react-bootstrap';

const AddSubscription = () => {
    const { userId, subscriptionId } = useParams();
    const [name, setName] = useState('');
    const [amount, setAmount] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [type, setType] = useState('Weekly');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (subscriptionId) {
            SubscriptionService.getSubscription(subscriptionId)
                .then((response) => {
                    const subscription = response.data;
                    setName(subscription.name);
                    setAmount(subscription.amount);
                    setStartDate(subscription.startDate);
                    setType(subscription.type);
                })
                .catch((error) => {
                    setError(error.response?.data || 'Failed to fetch subscription details.');
                    setTimeout(() => setError(''), 3000);
                });
        }
    }, [subscriptionId]);

    const clearFields = () => {
        setName('');
        setAmount('');
        setStartDate('');
        setType('Weekly');
    };

    const handleAddSubscription = async (e) => {
        e.preventDefault();

        if (!name || !amount || !startDate || !type) {
            setError("All fields must be completed!");
            setTimeout(() => setError(''), 3000);
            return;
        }

        if (amount <= 0) {
            setError("Amount must be a positive value.");
            setTimeout(() => setError(''), 3000);
            return;
        }

        const subscription = { subscriptionId, name, amount, startDate, type, userId };

        try {
            if (subscriptionId) {
                const response = await SubscriptionService.updateSubscription(subscription, subscriptionId, userId);
                if(response.status === 204) {
                    setSuccess('Subscription updated successfully.');
                }else if(response.status === 404) {
                    setError('Subscription not found.');
                    setTimeout(() => setError(''), 3000);
                    clearFields();
                }else if(response.status === 403) {
                    setError('You are not authorized to update this subscription.');
                    setTimeout(() => setError(''), 3000);
                    clearFields();
                }

            } else {
                const response = await SubscriptionService.addSubscription(subscription, userId);
                if(response.status === 201) {
                    setSuccess('Subscription added successfully.');
                }else if(response.status === 409) {
                    setError('Subscription already exists.');
                    setTimeout(() => setError(''), 3000);
                    clearFields();
                }
            }
            setTimeout(() => setSuccess(''), 3000);
            clearFields();
            navigate(`/users/${userId}/subscriptions`); 
        } catch (error) {
            const errorMessage = error.response?.data || error.message || 'An unexpected error occurred.';
            setError(errorMessage);
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
                            <h4>{subscriptionId ? 'Update Subscription' : 'Add Subscription'}</h4>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleAddSubscription}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter subscription name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Amount</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>€</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            placeholder="Enter amount"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        max={new Date().toISOString().split('T')[0]}
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Type</Form.Label>
                                    <Form.Select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                    >
                                        <option value="Weekly">Weekly</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Yearly">Yearly</option>
                                    </Form.Select>
                                </Form.Group>

                                <Button type="submit" className="w-100" variant="success">
                                    {subscriptionId ? 'Update Subscription' : 'Add Subscription'}
                                </Button>
                            </Form>
                            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                            {success && <Alert variant="success" className="mt-3">{success}</Alert>}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AddSubscription;