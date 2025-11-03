import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import Services from "../services/Services";

const UpdateAppUser = () => {
    const [form, setForm] = useState({
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        setUserId(userData.id);
    }, [userId]);

    const clearFields = () => {
        setForm({
            oldPassword: '',
            newPassword: '',
            newPasswordConfirm: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (form.newPassword !== form.newPasswordConfirm) {
            clearFields();
            setError('New password and confirmation do not match.');
            setTimeout(() => setError(''), 3000);
            return;
        }

        try {
            const response = await Services.updatePassword(userId, form.oldPassword, form.newPassword);
            if (response.status === 204) {
                clearFields();
                setSuccess('Password updated successfully.');
                setTimeout(() => setSuccess(''), 3000);
            } else if (response.status === 401) {
                clearFields();
                setError('Incorrect current password.');
                setTimeout(() => setError(''), 3000);
            } else if (response.status === 409) {
                clearFields();
                setError('No user found.');
                setTimeout(() => setError(''), 3000);
            }
        } catch (error) {
            clearFields();
            console.error('Error updating user:', error);
            setError('An error occurred while updating the user.');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteAppUser = async () => {
        const confirmation = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
        if (!confirmation) return;

        try {
            await Services.deleteAppUser(userId);
            alert('Account deleted successfully.');
            navigate('/');
        } catch (error) {
            console.error('Error deleting user:', error);
            clearFields();
            setError('An error occurred while deleting the account.');
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card>
                        <Card.Title as="h3" className="text-center fw-bold mb-2">
                            Account settings
                        </Card.Title>
                        <Card.Body>
                            <h5 className="card-title">Update Password</h5>
                            <Form onSubmit={handleUpdate}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Current Password:</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="oldPassword"
                                        value={form.oldPassword}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>New Password:</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="newPassword"
                                        value={form.newPassword}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>New Password Confirmation:</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="newPasswordConfirm"
                                        value={form.newPasswordConfirm}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Button type="submit" variant="success" className="w-100">Update Password</Button>
                            </Form>
                            <hr />
                            <h5 className="card-title text-danger">Delete Account</h5>
                            <Button variant="danger" className="w-100 mt-3" onClick={handleDeleteAppUser}>Delete Account</Button>
                            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                            {success && <Alert variant="success" className="mt-3">{success}</Alert>}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UpdateAppUser;