import React from "react";
import { Spinner } from 'react-bootstrap';

function SpinnerComponent({isLoading}) {
    if (!isLoading) return null;
    return (
    <Spinner animation="border" size="sm" role="status">
        <span className="visually-hidden">Loading...</span>
    </Spinner>
    );
}

export default SpinnerComponent;
