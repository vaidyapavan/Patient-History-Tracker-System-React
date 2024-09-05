import React from "react";

const Error = () => {
    return (
        <div style={{
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            color: '#721c24',
            padding: '10px',
            margin: '20px auto',
            width: '50%',
            textAlign: 'center'
        }}>
            <h2 style={{ fontSize:"30px" }}>This URL is not valid</h2>
        </div>
    );
}

export default Error;
