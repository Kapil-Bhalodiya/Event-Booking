import React from 'react';
import { Form } from 'react-bootstrap';

export default function EventForm(props) {
    const { formData, handleChange, handleFileChange, errors } = props;
    return (
        <Form>
            <Form.Group className="mb-3" controlId="formEventTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Event Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEventPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="Enter Price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    isInvalid={!!errors.price}
                />
                <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEventDate">
                <Form.Label>Date</Form.Label>
                <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    isInvalid={!!errors.date}
                />
                <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formFile">
                <Form.Label>Image</Form.Label>
                <Form.Control
                    type="file"
                    name="eventImage"
                    onChange={handleFileChange}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.eventImage}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEventDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    isInvalid={!!errors.description}
                />
                <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
            </Form.Group>
        </Form>
    );
}
