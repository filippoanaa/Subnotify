import React, { useState } from 'react';
import UserService from '../services/UserService';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const UpdateUser = () => {
    const { userId } = useParams();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const clearFields = () => {
        setOldPassword('');
        setNewPassword('');
        setNewPasswordConfirm('');
    };
    
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (newPassword !== newPasswordConfirm) {
            clearFields();
            setError('New password and confirmation do not match.');
            setTimeout(() => setError(''), 3000);
            return;
        }

        try {
            const updatedUser = { oldPassword, newPassword };
            const response = await UserService.updatePassword(userId, updatedUser);
            if(response.status == 204){
                clearFields();
                setSuccess('Password updated successfully.');
                setTimeout(() => setSuccess(''), 3000);
            }else if(response.status == 401){
                clearFields();
                setError('Incorrect current password.');
                setTimeout(() => setError(''), 3000);
            }else if(response.status == 409){
                clearFields();
                setError('No user found.');
                setTimeout(() => setError(''), 3000);
            }

            
        } catch (error) {
            clearFields();
            console.log('Error updating user:', error);
            setError('An error occurred while updating the user.');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteUser = async (e) => {
        e.preventDefault();

        const confirmation = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
        if (!confirmation) {
            return;
        }

        try {
            await UserService.deleteUser(userId);
            alert('Account deleted successfully.');
            navigate('/'); 
        } catch (error) {
            console.log('Error deleting user:', error);
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
                        <Card.Header className="bg-primary text-white">
                            <h4 className="text-center">Account Settings</h4>
                        </Card.Header>
                        <Card.Body>
                            <h5 className="card-title">Update Password</h5>
                            <Form onSubmit={handleUpdate}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Current Password:</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>New Password:</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>New Password Confirmation:</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={newPasswordConfirm}
                                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                                    />
                                </Form.Group>
                                <Button type="submit" variant="success" className="w-100">Update Password</Button>
                            </Form>
                            <hr />
                            <h5 className="card-title text-danger">Delete Account</h5>
                            <Button variant="danger" className="w-100 mt-3" onClick={handleDeleteUser}>Delete Account</Button>
                            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                            {success && <Alert variant="success" className="mt-3">{success}</Alert>}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UpdateUser;