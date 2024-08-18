import React, { useEffect, useState } from 'react';
import './Event.css';
import { Row, Col, Button, Container } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/AuthContext';
import CustomModal from '../../component/modal/Modal';
import { BACKEND_URL } from '../../config';
import EventForm from './EventForm';
import BookForm from '../booking/BookForm';
import SpinnerComponent from '../../component/spinner/spinner';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        date: '',
        description: ''
    });
    const [errors, setErrors] = useState({});
    const [modalType, setModalType] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const handleCloseModal = () => setShowModal(false);
    const { user, logout } = useUser();

    useEffect(() => {
        console.log("called..");
        fetchEvents();
    }, [])

    const fetchEvents = async () => {
        setIsLoading(true);
        const requestBody = {
            query: `
             query {
                getEvents{
                    _id
                    title
                    price
                    description
                    date
                }
            }`
        }
        const response = await fetch(`${BACKEND_URL}`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        console.log("result : ", result);
        setEvents(result.data.getEvents);
        setIsLoading(false);
        if (result.errors) throw new Error('Fetching issue while Events.');
    }

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.price) newErrors.price = 'Price is required';
        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.description) newErrors.description = 'Description is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const requestBodyMap = {
        create: () => ({
            query: `
            mutation {
                createEvent(eventInput: { 
                    title: "${formData.title}", 
                    description: "${formData.description}", 
                    price: ${formData.price}, 
                    date: "${formData.date}" 
                }) {
                    _id
                    title
                }
            }`
        }),
        book: () => ({
            query: `
            mutation {
                bookingEvent(bookingInput: { event: "${formData._id}" }) {
                    _id
                }
            }`
        })
    }

    const handleSaveChanges = async () => {
        if (modalType === 'create' && !validateForm()) {
            setIsLoading(false);
            return; // Exit if validation fails
        }

        const requestBody = requestBodyMap[modalType]();
        console.log("user : ",user);
        try {
            const response = await fetch(`${BACKEND_URL}/graphql`, {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${user.token}`
                }
            });
            const result = await response.json();
            console.log(" result : ",result)
            if (result.errors) throw new Error('Error processing request');
            handleCloseModal();
            fetchEvents();
        } catch (error) {
            console.error('Error saving changes:', error);
        } finally {
            setIsLoading(false);
        }

    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }
    const handleShowModal = (type, id) => {
        setModalType(type);
        setShowModal(true);
        if (type === 'book') {
            const event = events.find((event) => event._id === id);
            console.log(formData);
            setFormData(event);
        } else {
            setFormData({
                title: '',
                price: '',
                date: '',
                description: ''
            });
        }
    };

    return (
        !user ? <h6>Please log in first, <Link to={'/login'}> click Here</Link></h6> : 
        <>
            {console.log("evnts : : ", events)}
            <Container>
                <CustomModal
                    show={showModal}
                    handleClose={handleCloseModal}
                    handleSave={handleSaveChanges}
                    heading={modalType === 'create' ? 'Add Event' : 'Book Event'}
                    saveButtonText={modalType === 'create' ? 'Create Event' : 'Book Event'}>
                    {modalType === 'create' ? <EventForm formData={formData} handleChange={handleChange} errors={errors} /> :
                        <BookForm formdata={formData} />}
                </CustomModal>
                <SpinnerComponent isLoading={isLoading} /> 
                <Row>
                    <Col sm={8}>
                        <h2 className="event-heading">Events</h2>
                        <h6 className="event-subheading">Review your events!</h6>
                    </Col>
                    <Col sm={4}>
                        <Button variant="info" type="submit" onClick={() => handleShowModal('create')} className="mb-3 login-button">
                            + Create Event
                        </Button>
                    </Col>
                    <Row>
                        {events.length > 0 ? (
                            events.map((event) => (
                                <Col key={event._id} sm={12} className="mb-3">
                                    <div className="event-row d-flex align-items-center justify-content-between p-3 border rounded">
                                        <img className="img" alt='event image' />
                                        <h5 className="event-title mr-3">{event.title}</h5>
                                        <div className="event-description mr-3">{event.description}</div>
                                        <div className="event-price mr-3">{event.price}</div>
                                        <div className="event-date">{new Date(event.date).toLocaleDateString()}</div>
                                        <Button variant="secondary" className="event-detail" onClick={() => handleShowModal('book', event._id)}>Book Event</Button>
                                    </div>
                                </Col>
                            ))
                        ) : (
                            <Col sm={12}>
                                <p>No events available.</p>
                            </Col>
                        )}
                    </Row>
                </Row>
            </Container>
        </>
    )
}