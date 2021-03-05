import React, { useRef } from 'react';
import firebase from './../firebase';

var storage = firebase.storage();
var storageRef = storage.ref();


const ImageUploadButton = () => {
    const fileInput = useRef();
    var imageRef = storageRef.child('ariza.png');
    const handleClick = event => {
        event.preventDefault();
        console.log(fileInput.current.files)
        imageRef.put(fileInput.current.files[0]).then((snapshot)=>{
            console.log(snapshot)
        })
    }
    
    return (
        <>
            <input type="file" ref={fileInput} multiple="multiple" />
            <button onClick={handleClick}>Submit</button>
        </>
    )
}

export default ImageUploadButton
