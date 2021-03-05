import { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from 'react-router-dom';
import axios from 'axios';
import firebase from './../firebase';
var storage = firebase.storage();
var storageRef = storage.ref();

function ItemCard(props) {
    const [card, setCard] = useState({username: "", url: ""})
    useEffect(()=>{
        storageRef.child(`charart/${props.details.id}`).getDownloadURL()
        .then((url)=>{
            axios.get('http://127.0.0.1:8000/api-auth/userdetails/', {
                params: {
                    "userid": `${props.details.userid}`
                }
            })
            .then((resp)=>{
                setCard({username: resp.data.username, url: url})
            })
        })
    },[])

    return (
        <div class="col-12 col-md-6 col-xl-4 col-xxl-3 mb-5">
            {/* image */}
            <div class="container-fluid">
                <Link to={`/charart/${props.details.id}`}><img src={card.url} class="itemCardImg rounded-3"></img></Link>
            </div>
            {/* image information */}
            {/* <div class="container-fluid mt-3 mb-5">
                <div>
                    <div class="d-flex justify-content-end">
                        <div className="d-flex flex-column">
                            <p style={{fontSize: "13px", marginBottom: "0px",color:"orange",marginRight:"5px"}}>created by {card.username}</p>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default ItemCard