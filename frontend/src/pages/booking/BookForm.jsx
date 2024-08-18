// EventForm.jsx
import React from 'react';
import { Card } from 'react-bootstrap';

export default function BookForm(props) {
    console.log("props : ",props);
    const { title, description, price, date } = props.formdata;
    return (
        <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src="holder.js/100px180" />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>
            {description}
          </Card.Text>
          <Card.Text>
            {price}
          </Card.Text>
          <Card.Text>
            {date}
          </Card.Text>
        </Card.Body>
      </Card>
    );
}
