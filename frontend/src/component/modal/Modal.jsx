import React, { Children, useState } from "react";
import { Modal, Button } from 'react-bootstrap';

export default function CustomModal(props) {
    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);
    return (
        <>
            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.heading}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.children}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={props.handleSave}>
                       {props.saveButtonText}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}