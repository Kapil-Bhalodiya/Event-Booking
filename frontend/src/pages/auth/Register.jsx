import './Auth.css';
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { BACKEND_URL } from '../../config';
import { Link } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");

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
      mutation {
        createUser(userInput:{username:"${username}",emailId: "${email}", password:"${password}"}){
          emailId
	      }
      }`
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("event : ",event.target);
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
        console.log("result",result);
        if(result.errors) throw new Error('Invalid Credential');
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-form-container">
        <h2 className="login-title">Create an account</h2>
        <h6 className="login-subtitle">Join for our exclusive events!</h6>
        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter full name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
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
            Create Account
          </Button>
          <Button variant="light" type="submit" className="login-button">
            <Link to={'/'}>Sign In</Link>
          </Button>
        </Form>
      </div>
    </div>
  )
}