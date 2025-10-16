import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Table, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Services from "../services/Services";

const SubscriptionsList = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        setUserId(userData.id);

        const fetchSubscriptions = async () => {
            try {
                const allSubs = await Services.getAllSubscriptionsForUser(userId);
                setSubscriptions(allSubs.data);
            } catch (err) {
                setError('Failed to fetch subscriptions.');
                setTimeout(() => setError(''), 3000);
            }
        };

        if (userId) {
            fetchSubscriptions();
        }
    }, [userId]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const isDueSoon = (dueDate) => {
        if (!dueDate) return false;
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 3;
    };

    const handleAddSubscription = () => navigate(`/subnotify/add-subscription`);

    const handleDeleteSubscription = async (subscriptionId) => {
        try {
            await Services.deleteSubscription(subscriptionId, userId);
            setSubscriptions(subs => subs.filter(sub => sub.id !== subscriptionId));
        } catch {
            setError('Failed to delete subscription.');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleUpdateSubscription = (subscriptionId) =>
        navigate(`/subnotify/your-subscriptions/${subscriptionId}`);

    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={10}>
                    <h1 className="text-center">Subscriptions List</h1>
                    <div className="d-flex justify-content-center mb-3">
                        <Button onClick={handleAddSubscription}>Add Subscription</Button>
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
                            {subscriptions.map(({ id, name, amount, startDate, type, dueDate }) => (
                                <tr key={id} className={isDueSoon(dueDate) ? "table-warning" : ""}>
                                    <td>{name}</td>
                                    <td>{amount}</td>
                                    <td>{formatDate(startDate)}</td>
                                    <td>{type}</td>
                                    <td>
                                        {formatDate(dueDate)}
                                        {isDueSoon(dueDate) &&
                                            <span className="ms-2 fw-bold text-danger">(Due in ≤3 days)</span>
                                        }
                                    </td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            className="me-2"
                                            onClick={() => handleDeleteSubscription(id)}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            variant="primary"
                                            className="me-2"
                                            onClick={() => handleUpdateSubscription(id)}
                                        >
                                            Update
                                        </Button>
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