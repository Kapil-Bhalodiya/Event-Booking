import React, { useEffect, useState } from 'react';
import './Event.css';
import { Row, Col, Button, Container } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/AuthContext';
import CustomModal from '../../component/modal/Modal';
import { BACKEND_URL,BACKEND_COMMON } from '../../../config';
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
    const [image, setImage] = useState(null);
    const { user, logout } = useUser();

    useEffect(() => {
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
                    image
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

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        
        const form = new FormData();
        form.append('operations', JSON.stringify({
            query: `
                mutation($eventImage: Upload, $eventInput: eventInput!) {
                    createEvent(eventInput: $eventInput, eventImage: $eventImage) {
                        _id
                        title
                        image
                    }
                }
            `,
            variables: {
                eventInput: {
                    title: formData.title,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    date: formData.date
                }
            }
        }));
        form.append('map', JSON.stringify({
            '0': ['variables.eventImage']
        }));
        
        if (image) {
            form.append('0', image);
        }
        
        try {
            const response = await fetch(`${BACKEND_URL}`, {
                method: 'POST',
                body: form,
                headers: {
                    'Authorization': `${user.token}`
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const result = await response.json();
            if (result.errors) {
                console.error(result.errors);
            } else {
                console.log("Success:", result);
                fetchEvents();
                handleCloseModal();
            }
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };
    
    

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
        !localStorage.getItem('session') ? <h6>Please log in first, <Link to={'/login'}> click Here</Link></h6> : 
        <>
            <Container>
                <CustomModal
                    show={showModal}
                    handleClose={handleCloseModal}
                    handleSave={handleSaveChanges}
                    heading={modalType === 'create' ? 'Add Event' : 'Book Event'}
                    saveButtonText={modalType === 'create' ? 'Create Event' : 'Book Event'}>
                    {modalType === 'create' ? <EventForm formData={formData} handleChange={handleChange} errors={errors} handleFileChange={handleFileChange} /> :
                        <BookForm formdata={formData} />}
                </CustomModal>
                <SpinnerComponent isLoading={isLoading} /> 
                <Row>
                    <Col sm={8}>
                        <h2 className="event-heading">Events</h2>
                        <h6 className="event-subheading">Review your events!</h6>
                    </Col>
                    <Col sm={4} className='mt-3'>
                        <Button variant='light' sm={2} type="submit" onClick={() => handleShowModal('create')} className="mb-3 login-button bg-white">
                            + Create Event
                        </Button>
                    </Col>
                    <Row>
                        {events.length > 0 ? (
                            events.map((event) => (
                                <Col key={event._id} sm={12} className="mb-3">
                                    <div className="event-row d-flex align-items-center justify-content-between p-3 border rounded bg-white">
                                        <img className="img" src={`${BACKEND_COMMON}${event.image}`} alt='event image' height={100} width={100} />
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