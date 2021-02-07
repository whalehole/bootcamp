import axios from 'axios';
import React from 'react';

function Example() {
    axios.post('http://127.0.0.1:8000/signup/', {
        "email": "user1@gmail.com",
        "password": "Iamnotadmin!9"
    }).then(response => console.log(response.data)).catch(error => console.log(error));
    return (
        <div>component loaded</div>
    )
}

export default Example;

