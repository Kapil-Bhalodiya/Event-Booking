import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Container } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/AuthContext';
import { BACKEND_URL } from '../../config';
import SpinnerComponent from '../../component/spinner/spinner';

export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user, logout } = useUser();

    useEffect(() => {
        console.log("called..");
        fetchBooking();
    }, [])

    const fetchBooking = async () => {
        setIsLoading(true);
        const requestBody = {
            query: `
                query{
                    getBookings{
                        _id
                        createdAt
                        updatedAt
                        event{
                            _id
                            title
                        }
                    }
                }`
        }
        const response = await fetch(`${BACKEND_URL}`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': user.token
            }
        })
        const result = await response.json();
        setIsLoading(false);
        console.log("res : ",result)
        setBookings(result.data.getBookings);
        if (result.errors) throw new Error('Fetching issue while bookings.');
    }

    return(
        !user ? <h6>Please log in first, <Link to={'/login'}> click Here</Link></h6> : 
        <>
            {console.log("bookings : : ", bookings)}
            <Container>
                <SpinnerComponent isLoading={isLoading} /> 
                <Row>
                    <Col sm={8}>
                        <h2 className="booking-heading">Bookings</h2>
                        <h6 className="booking-subheading">Review your bookings!</h6>
                    </Col>
                    <Col sm={4}>
                        <Button variant="info" type="submit" onClick='' className="mb-3 login-button">
                            + Create booking
                        </Button>
                    </Col>
                    <Row>
                        {bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <Col key={booking._id} sm={12} className="mb-3">
                                    <div className="booking-row d-flex align-items-center justify-content-between p-3 border rounded">
                                        <img className="img" alt='booking image' />
                                        <h5 className="booking-title mr-3">{booking.event.title}</h5>
                                        <div className="booking-description mr-3">{booking.description}</div>
                                        <div className="booking-date">{new Date(booking.createdAt).toLocaleDateString()}</div>
                                        <div className="booking-date">{new Date(booking.updatedAt).toLocaleDateString()}</div>
                                        <Button variant="secondary" className="booking-detail" onClick=''>Cancle booking</Button>
                                    </div>
                                </Col>
                            ))
                        ) : (
                            <Col sm={12}>
                                <p>No bookings available.</p>
                            </Col>
                        )}
                    </Row>
                </Row>
            </Container>
        </>
    )
}