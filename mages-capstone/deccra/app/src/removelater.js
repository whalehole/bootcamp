import axios from 'axios';
import React, { useState } from 'react';

function Example() {
    axios.get('http://localhost:8000/terminal_1/authors').then(response => console.log(response)).catch(error => console.log(error));
    return (
        <div>component loaded</div>
    )
}

export default Example;

