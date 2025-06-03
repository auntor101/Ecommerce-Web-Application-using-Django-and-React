import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { requestPasswordReset } from '../actions/userActions';
import { toast } from 'react-toastify';

const PasswordResetPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(requestPasswordReset(email));
      setSubmitted(true);
      toast.success('Password reset instructions have been sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to send password reset link');
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Card className="p-4 mt-5" style={{ maxWidth: '500px', width: '100%' }}>
        <Card.Header as="h4" className="text-center mb-4">Reset Password</Card.Header>
        <Card.Body>
          {submitted ? (
            <Alert variant="success">
              <p>If an account with this email exists, we have sent password reset instructions.</p>
              <p>Please check your email inbox and follow the instructions.</p>
            </Alert>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Form.Text className="text-muted">
                  We'll send password reset instructions to this email.
                </Form.Text>
              </Form.Group>
              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  type="submit"
                >
                  Request Password Reset
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default PasswordResetPage; 