import './Auth.css';
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { BACKEND_URL } from '../../../config';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/AuthContext';
import SpinnerComponent from '../../component/spinner/spinner';
import GoogleAuth from '../../component/GoogleAuth';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useUser();
  const naviagte = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    // else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const requestBody = {
    query: `
      query {
        login(emailId: "${email}", password:"${password}"){
          userId
          token
        }
      }`
  }

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) setErrors(formErrors);
    else {
      setErrors({});
      const response = await fetch(`${BACKEND_URL}`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      console.log("result : ", result);
      if (result.errors) throw new Error('Invalid Credential');
      login(result.data.login);
      naviagte('/');
    }
    setLoading(false);
  }

  return (
    <div className="login-wrapper">
      <div className="login-form-container">
        <h2 className="login-title">Sign In</h2>
        <h6 className="login-subtitle">Unlock the World</h6>
        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className="auth-label">Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit" className="mb-3 login-button">
            <SpinnerComponent isLoading={loading} />
            <strong>{!loading && 'LOG IN'}</strong>
          </Button>
          <Link to={'/register'} className='text-decoration-none'>
            <Button variant="light" className="login-button">
              Create an Accout
            </Button>
          </Link>
          <GoogleAuth />
        </Form>
      </div>
    </div>
  )
}