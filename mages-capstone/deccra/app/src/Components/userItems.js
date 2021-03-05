import { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from 'react-router-dom';
import axios from 'axios';
import firebase from './../firebase';
import { setCookie, getCookie, checkCookie } from '../cookie';
var storage = firebase.storage();
var storageRef = storage.ref();

function UserItems(props) {
    // ITEM IMAGE URL 
    const [imageURL, setImageURL] = useState("")

    // METHODS
    // DELETE ITEM
    const deleteItem = event => {
        if (props.category == "charart") {
            axios.delete(`http://127.0.0.1:8000/api-auth/charart/changedetails/?character_artid=${props.itemContent.id}`, {
                headers: {
                    'Authorization': `Bearer ${getCookie("access_token")}`
                }
            })
            .then(()=>{
                props.change()
                alert("Character art deleted")
            })
        }
        if (props.category == "char") {
            axios.delete(`http://127.0.0.1:8000/api-auth/char/changedetails/?characterid=${props.itemContent.characterid}`, {
                headers: {
                    'Authorization': `Bearer ${getCookie("access_token")}`
                }
            })
            .then(()=>{
                props.change()
                alert("Character deleted")
            })
        }
    }

    // COMPONENT DID MOUNT
    useEffect(()=>{
        if (props.category == "charart") {
            storageRef.child(`charart/${props.itemContent.id}`).getDownloadURL()
            .then((url)=>{
                setImageURL(url)
            })
        }

        if (props.category == "char") {
            storageRef.child(`char_profile_illust/${props.itemContent.characterid}`).getDownloadURL()
            .then((url)=>{
                setImageURL(url)
            })
        }
    }, [])

    return (
        <>
        <div className="col-2 mb-5">

            {/* IMAGE */}
            <div style={{aspectRatio:"1/1"}}>
                <Link to={`/charart/${props.itemContent.id}`}><img src={imageURL} style={{height:"100%",width:"100%",objectFit:"contain"}} /></Link>
            </div>
            {/* OPTIONS */}
            <div className="row justify-content-end mt-2">
                <div className="col-3">
                    <img type="button" data-bs-toggle="modal" data-bs-target={`#deleteItem${props.itemContent.id}`} src="https://img.icons8.com/color/48/000000/delete-forever.png" style={{width:"20px", opacity:"0.5"}} />
                    <div class="modal fade" id={`deleteItem${props.itemContent.id}`} tabindex="-1" aria-labelledby="deleteItemModalLabel" aria-hidden="true">
                          <div class="modal-dialog modal-dialog-centered">
                              <div class="modal-content">
                                  <div class="modal-header">
                                      <h5 class="modal-title" id="deleteItemModalLabel">Confirm delete</h5>
                                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                  </div>
                                  <div class="modal-footer">
                                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                      <button type="button" onClick={deleteItem} class="btn btn-danger" data-bs-dismiss="modal">Delete</button>
                                  </div>
                              </div>
                          </div>
                      </div>
                </div>
            </div>
            
        </div>
        </>
    )
}

export default UserItems