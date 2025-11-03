import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Table, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Services from "../services/Services";

const SubscriptionsList = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [totals, setTotals] = useState({ weekly: 0, monthly: 0, yearly: 0 });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData && userData.id) {
            setUserId(userData.id);

            const fetchSubscriptions = async () => {
                try {
                    const allSubs = await Services.getAllSubscriptionsForUser(userData.id);
                    setSubscriptions(allSubs.data);
                } catch (err) {
                    setError('Failed to fetch subscriptions.');
                    setTimeout(() => setError(''), 3000);
                }
            };

            fetchSubscriptions();
        }
    }, []);

    useEffect(() => {
        const calculateTotals = () => {
            let totalWeek = 0;
            let totalMonth = 0;
            let totalYear = 0;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(today);
            endOfWeek.setDate(today.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            endOfMonth.setHours(23, 59, 59, 999);

            const endOfYear = new Date(today.getFullYear(), 11, 31);
            endOfYear.setHours(23, 59, 59, 999);

            subscriptions.forEach(sub => {
                const amount = parseFloat(sub.amount) || 0;
                const dueDate = new Date(sub.dueDate);
                dueDate.setHours(0, 0, 0, 0);

                if (dueDate >= today && dueDate <= endOfYear) {
                    totalYear += amount;
                }

                if (dueDate >= today && dueDate <= endOfMonth) {
                    totalMonth += amount;
                }

                if (dueDate >= today && dueDate <= endOfWeek) {
                    totalWeek += amount;
                }
            });

            setTotals({
                weekly: totalWeek,
                monthly: totalMonth,
                yearly: totalYear
            });
        };

        if (subscriptions.length > 0) {
            calculateTotals();
        } else {
            setTotals({ weekly: 0, monthly: 0, yearly: 0 });
        }
    }, [subscriptions]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
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

                    <h2 className="h4 mb-3">Upcoming Costs</h2>
                    <p className="text-muted" style={{marginTop: '-0.75rem', marginBottom: '1.5rem'}}>
                        Total payments due in the selected period.
                    </p>

                    <Row className="text-center mb-5">
                        <Col md={4} className="mb-3">
                            <Card>
                                <Card.Header as="h6" className="bg-success text-white">Total This Week</Card.Header>
                                <Card.Body>
                                    <Card.Text className="fs-4 fw-bold text-success">
                                        {formatCurrency(totals.weekly)}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-3">
                            <Card>
                                <Card.Header as="h6" className="bg-primary text-white">Total This Month</Card.Header>
                                <Card.Body>
                                    <Card.Text className="fs-4 fw-bold text-primary">
                                        {formatCurrency(totals.monthly)}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-3">
                            <Card>
                                <Card.Header as="h6" className="bg-info text-white">Total This Year</Card.Header>
                                <Card.Body>
                                    <Card.Text className="fs-4 fw-bold text-info">
                                        {formatCurrency(totals.yearly)}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>


                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h1 className="h2 mb-0">My Subscriptions</h1>
                        <Button onClick={handleAddSubscription} variant="primary">
                            Add Subscription
                        </Button>
                    </div>

                    {subscriptions.length === 0 ? (
                        <Alert variant="info" className="text-center">
                            No subscriptions found. Click "Add Subscription" to get started!
                        </Alert>
                    ) : (
                        <Table bordered hover responsive>
                            <thead className="table-light">
                            <tr>
                                <th>Name</th>
                                <th>Amount</th>
                                <th>First Payment</th>
                                <th>Type</th>
                                <th>Next Due Date</th>
                                <th className="text-center">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {subscriptions.map(({id, name, amount, startDate, type, dueDate}) => (
                                <tr key={id} className={isDueSoon(dueDate) ? "table-warning" : ""}>
                                    <td>{name}</td>
                                    <td>{formatCurrency(amount)}</td>
                                    <td>{formatDate(startDate)}</td>
                                    <td>{type}</td>
                                    <td>
                                        {formatDate(dueDate)}
                                        {isDueSoon(dueDate) &&
                                            <span className="ms-2 fw-bold text-danger">(Due soon)</span>
                                        }
                                    </td>
                                    <td className="text-center">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleUpdateSubscription(id)}
                                        >
                                            Update
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeleteSubscription(id)}
                                        >
                                            Delete
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