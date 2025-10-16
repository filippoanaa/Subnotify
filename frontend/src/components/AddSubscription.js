import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Form, Button, Container, Row, Col, Alert, InputGroup } from 'react-bootstrap';
import Services from "../services/Services";

const AddSubscription = () => {
    const {subscriptionId} = useParams();
    console.log(subscriptionId);
    const [form, setForm] = useState({
        name: '',
        amount: '',
        startDate: '',
        type: 'Weekly'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const[userId, setUserId] = useState(null);



    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        setUserId(userData.id);

        if (subscriptionId) {
            Services.getSubsctiption(subscriptionId)
                .then((response) => {
                    const { name, amount, startDate, type } = response.data;
                    setForm({
                        name: name ?? '',
                        amount: amount ?? '',
                        startDate: startDate ?? '',
                        type: type ?? 'Weekly'
                    });
                })
                .catch((error) => {
                    setError(error.response?.data || 'Failed to fetch subscription details.');
                    setTimeout(() => setError(''), 3000);
                });
        } else {
            setForm({
                name: '',
                amount: '',
                startDate: '',
                type: 'Weekly'
            });
        }
    }, [userId, subscriptionId]);

    const clearFields = () => {
        setForm({
            name: '',
            amount: '',
            startDate: '',
            type: 'Weekly'
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddSubscription = async (e) => {
        e.preventDefault();
        const { name, amount, startDate, type } = form;

        if (!name || !amount || !startDate || !type) {
            setError("All fields must be completed!");
            setTimeout(() => setError(''), 3000);
            return;
        }
        if (Number(amount) <= 0) {
            setError("Amount must be a positive value.");
            setTimeout(() => setError(''), 3000);
            return;
        }

        const subscription = { name, amount, startDate, type };

        try {
            if (subscriptionId) {
                const response = await Services.updateSubscription(subscription, subscriptionId, userId);
                if (response.status === 200) {
                    setSuccess('Subscription updated successfully.');
                    setTimeout(() => {
                        setSuccess('');
                        navigate(`/subnotify/your-subscriptions`);
                    }, 1200);
                } else if (response.status === 404) {
                    setError('Subscription not found.');
                    clearFields();
                } else if (response.status === 403) {
                    setError('You are not authorized to update this subscription.');
                    clearFields();
                }
            } else {
                const response = await Services.addSubscription(subscription, userId);
                if (response.status === 201 || response.status === 200) {
                    setSuccess('Subscription added successfully.');
                    setTimeout(() => {
                        setSuccess('');
                        navigate(`/subnotify/your-subscriptions`);
                    }, 1200);
                } else if (response.status === 409 || response.status === 400) {
                    setError('Subscription already exists.');
                    clearFields();
                }
            }
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
                                        name="name"
                                        placeholder="Enter subscription name"
                                        value={form.name}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Amount</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>€</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            name="amount"
                                            min="0"
                                            placeholder="Enter amount"
                                            value={form.amount}
                                            onChange={handleChange}
                                        />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="startDate"
                                        max={new Date().toISOString().split('T')[0]}
                                        value={form.startDate}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Type</Form.Label>
                                    <Form.Select
                                        name="type"
                                        value={form.type}
                                        onChange={handleChange}
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