import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Table, Alert } from 'react-bootstrap';
import SubscriptionService from '../services/SubscriptionService';
import { useNavigate, useParams } from 'react-router-dom';

const SubscriptionsList = () => {
    const { userId } = useParams();
    const [subscriptions, setSubscriptions] = useState([]);
    const [error, setError] = useState('');

    const fetchSubscriptions = () => {
        SubscriptionService.getUsersSubscriptions(userId)
            .then(response => {
                setSubscriptions(response.data);
            })
            .catch(() => {
                setError('Failed to fetch subscriptions.');
                setTimeout(() => setError(''), 3000);
            });
    };

    useEffect(() => {
        fetchSubscriptions();
    }, [userId]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const navigate = useNavigate();

    const addSubscription = () => {
        navigate(`/users/${userId}/subscriptions/add`); 
    };

    const deleteSubscription = (subscriptionId) => {
        SubscriptionService.deleteSubscription(subscriptionId, userId)
            .then(() => {
                setSubscriptions(prevSubscriptions => prevSubscriptions.filter(subs => subs.id !== subscriptionId));
            })
            .catch(() => {
                setError('Failed to delete subscription.');
                setTimeout(() => setError(''), 3000);
            });
    };

    const updateSubscription = (subscriptionId) => {
        navigate(`/users/${userId}/subscriptions/${subscriptionId}/edit`); 
    };

    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={10}>
                    <h1 className="text-center">Subscriptions List</h1>
                    <div className="d-flex justify-content-center mb-3">
                        <Button onClick={addSubscription}>Add Subscription</Button>
                    </div>
                    {subscriptions.length === 0 ? (
                        <div className="text-center">No subscriptions found.</div>
                    ) : (
                        <Table bordered hover>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Amount</th>
                                    <th>First Payment</th>
                                    <th>Type</th>
                                    <th>Due Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscriptions.map(subscription => (
                                    <tr key={subscription.id}>
                                        <td>{subscription.name}</td>
                                        <td>{subscription.amount}</td>
                                        <td>{formatDate(subscription.startDate)}</td>
                                        <td>{subscription.type}</td>
                                        <td>{formatDate(subscription.dueDate)}</td>
                                        <td>
                                            <Button variant="danger" className="me-2" onClick={() => deleteSubscription(subscription.id)}>Delete</Button>
                                            <Button variant="primary" className="me-2" onClick={() => updateSubscription(subscription.id)}>Update</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                    {error && <Alert variant="danger">{error}</Alert>}
                </Col>
            </Row>
        </Container>
    );
};

export default SubscriptionsList;