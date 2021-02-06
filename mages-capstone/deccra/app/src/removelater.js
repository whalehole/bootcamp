import axios from 'axios';
import React from 'react';

function Example() {
    axios.get('http://localhost:8000/terminal_1/authors/').then(response => console.log(response.data)).catch(error => console.log(error));
    return (
        <div>component loaded</div>
    )
}

export default Example;

