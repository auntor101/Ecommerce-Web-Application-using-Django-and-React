import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../actions/userActions';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';

const PasswordResetConfirmPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetComplete, setResetComplete] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const { uid, token } = useParams();

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validatePassword()) {
      return;
    }
    
    try {
      await dispatch(resetPassword(uid, token, password));
      setResetComplete(true);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to reset password');
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Card className="p-4 mt-5" style={{ maxWidth: '500px', width: '100%' }}>
        <Card.Header as="h4" className="text-center mb-4">Set New Password</Card.Header>
        <Card.Body>
          {resetComplete ? (
            <Alert variant="success">
              <p>Your password has been set successfully!</p>
              <p>You can now <Link to="/login">log in</Link> with your new password.</p>
            </Alert>
          ) : (
            <Form onSubmit={handleSubmit}>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  type="submit"
                >
                  Reset Password
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default PasswordResetConfirmPage; 