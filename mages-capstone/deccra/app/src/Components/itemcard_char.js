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

function ItemCardChar(props) {
    const [card, setCard] = useState({charactername: "", url: ""})
    useEffect(()=>{
        storageRef.child(`char_profile_illust/${props.details.characterid}`).getDownloadURL()
        .then((url)=>{
            setCard({charactername: props.details.character_name, url: url})
        })
    },[])

    return (
        <div class="col-12 col-md-6 col-xl-4 col-xxl-3">
            {/* image */}
            <div class="container-fluid">
                <Link to={`/char/${props.details.characterid}`}><img src={card.url} class="itemCardImg rounded-3"></img></Link>
            </div>
            {/* image information */}
            <div class="container-fluid mt-3 mb-5">
                <div>
                    <div class="d-flex justify-content-end">
                    <div className="d-flex flex-column">
                            <p style={{fontSize: "13px", marginBottom: "0px",color:"orange",marginRight:"5px"}}>{card.charactername}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemCardChar