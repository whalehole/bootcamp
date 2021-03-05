import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import HeaderContainer from './header';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    NavLink
  } from 'react-router-dom';
import firebase from '../firebase';
import { setCookie, getCookie, checkCookie } from '../cookie';
import ItemCard from './itemcard';
var storage = firebase.storage();
var storageRef = storage.ref();

function SettingsPage() {
    // USER PROFILE
    const [userInfo, setUserInfo] = useState({id: "", email:"", username: "", country: "", self_introduction: "", date_of_birth: "", language: "", profile_pic: ""})
    // HANDLE REFRESHES
    const [handleRefresh, setHandleRefresh] = useState(0)
    // CHANGING PROFILE PIC STATUS
    const [changingProfilePic, setChangingProfilePic] = useState(false)

    // COMPONENT DID MOUNT
    useEffect(()=>{
      // RETRIEVE ALL USER INFO
      axios.get(`http://127.0.0.1:8000/api-auth/user/changedetails/`, {
        headers: {
          'Authorization': `Bearer ${getCookie("access_token")}`
        }
      })
      .then((resp)=>{
        storageRef.child(`user_profile_pic/${resp.data.id}`).getDownloadURL()
        .then((url)=>{
          console.log(url)
          setUserInfo({id: resp.data.id, email: resp.data.email, country: resp.data.country, self_introduction: resp.data.self_introduction, date_of_birth: resp.data.date_of_birth, language: resp.data.language, profile_pic: url})
        })
        .catch(()=>{
          setUserInfo({id: resp.data.id, email: resp.data.email, country: resp.data.country, self_introduction: resp.data.self_introduction, date_of_birth: resp.data.date_of_birth, language: resp.data.language})
        })
      })
    }, [handleRefresh])

    // VALUES
    const profilePic = useRef()
    const oldPassword = useRef()
    const newPassword = useRef()
    const preNewPassword = useRef()
    const userEmail = useRef()
    const userSelfIntroduction = useRef()

    // METHODS
    // PREVIEW PROFILE PIC
    const handleProfilePic = event => {
      URL.revokeObjectURL(profilePic.current.files[0])
      setHandleRefresh(handleRefresh+1)
      setChangingProfilePic(true)
    }
    // SUBMIT PROFILE PIC
    const submitProfilePic = event => {
      if (profilePic.current.files.length) {
        console.log(userInfo.id)
        console.log(profilePic.current.files[0])
        var imageRef = storageRef.child(`user_profile_pic/${userInfo.id}`);
        imageRef.put(profilePic.current.files[0])
        .then((snapshot)=>{
            console.log(snapshot)
        })
        .then(()=>{
          alert("profile picture updated")
        })
      } else {
        alert("please select a profile picture")
      }
    }
    // VERIFY PASSWORD FOR USER INFO
    const verifyPassword = event => {
      axios.post(`http://127.0.0.1:8000/api-auth/signin/`, {
        email: userInfo.email,
        password: oldPassword.current.value
      })
      .then((resp)=>{
        for (let x in resp.data) {
          setCookie(x, resp.data[x], 365)
      }
      })
      .then(()=>{
        axios.patch(`http://127.0.0.1:8000/api-auth/user/changedetails/`, {
          email: userEmail.current.value,
          self_introduction: userSelfIntroduction.current.value
        }, {
          headers: {
            'Authorization': `Bearer ${getCookie("access_token")}`
          }
        })
        .then((resp)=>{
          alert("Change is successful")
          setHandleRefresh(handleRefresh+1)
        })
      })
      .catch((error)=>{
        alert(error, "Wrong password")
      })
    }
    // VERIFY PASSWORD FOR PASSWORD CHANGE
    const verifyPasswordForPassword = event => {
      if (preNewPassword.current.value == newPassword.current.value) {
        axios.put(`http://127.0.0.1:8000/api-auth/user/changepw/`, {
          old_password: oldPassword.current.value,
          new_password: newPassword.current.value
        }, {
          headers: {
            'Authorization': `Bearer ${getCookie("access_token")}`
          }
        })
        .then((resp)=>{
          alert("Change is successful")
        })
        .catch((error)=>{
          alert("Try again")
        })
      } else {
        alert("Passwords do not match")
      }
    }

    return (
      <>
      {console.log(userInfo)}
      {/* HEADER */}
      <HeaderContainer />
      
      {/* BODY */}
      {/* BODY CONTAINER */}
      <div className="container page-container mt-5 shadow rounded p-5">
        {/* SETTINGS */}
        <div className="row">
          {/* DIRECTORY */}
          <div className="col-2">
            <div className="d-flex flex-column">
              <p className="border-bottom" style={{fontSize:"18px",fontWeight:"bold"}}>Settings</p>
              <NavLink to="/settings" style={{textDecoration:"none",color:"gray"}} activeStyle={{color:"orange"}}>Basic</NavLink>
            </div>
          </div>
          {/* DETAILS */}
          <Route path="/settings">
            <div className="col-10">
              <div className="mx-auto" style={{width:"600px",height:"900px"}}>
                {/* INPUTS */}
                  <div className="d-flex flex-column">
                    {/* NAVBAR */}
                    <div className="d-flex flex-row border-bottom">
                      <NavLink exact to="/settings" style={{textDecoration:"none",color:"black",marginRight:"10px"}} activeStyle={{color:"orange"}} onClick={()=>{setHandleRefresh(0)}}>User Info</NavLink>
                      <NavLink to="/settings/profilepic" style={{textDecoration:"none",color:"black",marginRight:"10px"}} activeStyle={{color:"orange"}} onClick={()=>{setHandleRefresh(0); setChangingProfilePic(false)}}>Profile Picture</NavLink>
                      <NavLink to="/settings/changepw" style={{textDecoration:"none",color:"black",marginRight:"10px"}} activeStyle={{color:"orange"}} onClick={()=>{setHandleRefresh(0)}}>Change password</NavLink>
                    </div>
                    <Route path="/settings/profilepic">
                      {/* PROFILE PICTURE */}
                      <div className="justify-content-center d-flex mt-5">
                        <div>
                          <div className="rounded-circle border border-warning" style={{width:"150px",height:"150px"}}>
                            {
                              userInfo.profile_pic && !changingProfilePic ? 
                              <img className="rounded-circle" style={{width:"100%",height:"100%",objectFit:"cover"}} src={userInfo.profile_pic}/>
                              :
                              <img className="rounded-circle" style={{width:"100%",height:"100%",objectFit:"cover"}} src={handleRefresh > 0 && changingProfilePic ? window.URL.createObjectURL(profilePic.current.files[0]) : '/avataricon.png'}/>
                            }
                          </div>
                          <label type="button" for="submitProfilePic" style={{fontSize:"13px",width:"150px",textAlign:"center",textDecoration:"underline"}}>click to upload</label>
                          <input ref={profilePic} onChange={handleProfilePic} class="form-control form-control-sm" id="submitProfilePic" type="file" style={{display: "none"}}/>
                        </div>
                      </div>
                      <div>
                        <div class="col-12 mt-5 d-flex justify-content-end">
                            <button onClick={submitProfilePic} class="btn btn-warning">Submit</button>
                        </div>
                      </div>
                    </Route>
                    <Route exact path="/settings">
                      {/* EMAIL */}
                      <div class="mb-3 mt-5">
                        <label for="emailInput" class="form-label">Email address</label>
                        <input ref={userEmail} defaultValue={userInfo.email} type="email" class="form-control" id="emailInput" />
                      </div>
                      {/* SELF_INTRODUCTION */}
                      <div class="mb-3">
                        <label for="selfIntroduction" class="form-label">Self-introduction</label>
                        <textarea ref={userSelfIntroduction} defaultValue={userInfo.self_introduction} class="form-control" id="selfIntroduction" rows="3"></textarea>
                      </div>
                      {/* SUBMIT BUTTON */}
                      <div class="col-12 mt-5 d-flex justify-content-end">
                          <button data-bs-toggle="modal" data-bs-target="#passwordModal" class="btn btn-warning">Submit change</button>
                      </div>
                      {/* MODAL */}
                      <div class="modal fade" id="passwordModal" tabindex="-1" aria-labelledby="passwordModalLabel" aria-hidden="true">
                          <div class="modal-dialog modal-dialog-centered">
                              <div class="modal-content">
                                  <div class="modal-header">
                                      <h5 class="modal-title" id="passwordModalLabel">Enter password</h5>
                                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                  </div>
                                  <div class="modal-body">
                                      <form>
                                        <div class="mb-3">
                                          <label for="inputPassword3" class="form-label">Password</label>
                                          <input type="password" autofocus="true" ref={oldPassword} class="form-control" id="inputPassword3"/>
                                        </div>
                                      </form>
                                  </div>
                                  <div class="modal-footer">
                                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                      <button type="button" onClick={verifyPassword} class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                                  </div>
                              </div>
                          </div>
                      </div>
                    </Route>
                    <Route path="/settings/changepw">
                      {/* PASSWORD */}
                      <div class="mb-3 mt-5">
                        <label for="inputPassword1" class="form-label">New password</label>
                        <input type="password" ref={preNewPassword} class="form-control" id="inputPassword1"/>
                      </div>
                      <div class="mb-3">
                        <label for="inputPassword2" class="form-label">Type password again</label>
                        <input type="password" ref={newPassword} class="form-control" id="inputPassword2"/>
                      </div>
                      {/* SUBMIT BUTTON */}
                      <div class="col-12 mt-5 d-flex justify-content-end">
                          <button data-bs-toggle="modal" data-bs-target="#passwordChangeModal" class="btn btn-warning">Submit change</button>
                      </div>
                      {/* MODAL */}
                      <div class="modal fade" id="passwordChangeModal" tabindex="-1" aria-labelledby="passwordChangeModalLabel" aria-hidden="true">
                          <div class="modal-dialog modal-dialog-centered">
                              <div class="modal-content">
                                  <div class="modal-header">
                                      <h5 class="modal-title" id="passwordModalLabel">Enter old password</h5>
                                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                  </div>
                                  <div class="modal-body">
                                      <form>
                                        <div class="mb-3">
                                          <label for="inputPassword3" class="form-label">Password</label>
                                          <input type="password" autofocus="true" ref={oldPassword} class="form-control" id="inputPassword3"/>
                                        </div>
                                      </form>
                                  </div>
                                  <div class="modal-footer">
                                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                      <button type="button" onClick={verifyPasswordForPassword} class="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                                  </div>
                              </div>
                          </div>
                      </div>
                    </Route>
                  </div>
              </div>
            </div>
          </Route>
        </div>
      </div>
      </>
    )
}

export default SettingsPage