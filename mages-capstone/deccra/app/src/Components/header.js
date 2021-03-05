import React, { useEffect, Suspense, useRef } from 'react';
import ReactDOM from 'react-dom';
// REDUX
import { connect } from 'react-redux';
// JQUERY
import $ from 'jquery'
// ROUTER
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from 'react-router-dom';
import { setCookie, getCookie, checkCookie } from '../cookie';
import FileUploadButton from './fileuploadbutton';
import { propTypes } from 'react-bootstrap/esm/Image';
import firebase from './../firebase';

var storage = firebase.storage();
var storageRef = storage.ref();

// AXIOS
const axios = require('axios');

// User controls component 
function UserControls({states, dispatch}) {
    // User controls toggling
    let userControlsView = (<h1></h1>)
    // when signed in
    $(()=>{
        $("#signOutButton").off().on("click", ()=>{
            // remove cookie
            document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "expires_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "token_type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "scope=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            // dispatch sign out ->component remounted with sign out status
            dispatch({type: "SAVEGUEST"})
        })
    })
    if (states.user.signed_in == true) {
        userControlsView = (
            <div>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
 
                <div class="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a style={{backgroundColor:"orange",color:"white",fontWeight:"bold"}} class="nav-link rounded-pill" aria-current="page" href="/submit">Submit Creation</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {states.user.username}
                            </a>
                            <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                                <li><h6 class="dropdown-header">{states.user.username}</h6></li>
                                <li><Link class="dropdown-item" to="/dashboard">Dashboard</Link></li>
                                {/* <li><Link class="dropdown-item" to="/bookmarks">Bookmarks</Link></li> */}
                                <li><Link to="/" id="signOutButton" class="dropdown-item">Sign out</Link></li>
                                <li><hr class="dropdown-divider"/></li>
                                <li><Link class="dropdown-item" to="/settings">Settings</Link></li>
                                {/* <li><Link class="dropdown-item" to="/helpcenter">Help center</Link></li> */}
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
    // when not signed in 
    if (states.user.signed_in == false && states.user.checked == true) {
        userControlsView = (
                <div>
                    {/* <FileUploadButton /> */}
                    <Link to="/register">
                        <button type="button" style={{color: "orange"}} class="btn btn-link">Create account</button>
                    </Link>
                    <Link to="/signin">
                        <button type="button" class="btn btn-warning">Sign in</button>
                    </Link>
                </div>
        )
    }
    return userControlsView
}

function Header({states, dispatch}) {
    const searchKeywords = useRef()
    const handleSearchEnter = event => {
        if (event.key == "Enter") {
            window.location.href = `http://localhost:3000/search/?keywords=${searchKeywords.current.value}`
        }
    }

    useEffect(() => {
        // check sign in status
        // if not signed in -> auto sign in 
        if (states.user.signed_in == false && states.user.checked == false) {
            axios.get('http://127.0.0.1:8000/api-auth/user/changedetails/', {
                headers: {
                    'Authorization': `Bearer ${getCookie("access_token")}`
                }
            }).then(resp => {
                    dispatch({type: "SAVEUSER", payload: resp.data})
                    console.log(resp.data)
                    return states.user
            }).catch(error => {
                    axios.post('http://127.0.0.1:8000/api-auth/refreshtoken/', {
                        refresh_token: getCookie("refresh_token")
                    }).then(resp => {
                        for (let x in resp.data) {
                            setCookie(x, resp.data[x], 365)
                            console.log(resp.data)
                        }
                        })
                        .then(() => {
                            axios.get('http://127.0.0.1:8000/api-auth/user/changedetails/', {
                                headers: {
                                    'Authorization': `Bearer ${getCookie("access_token")}`
                                }
                            }).then(resp => {
                                    dispatch({type: "SAVEUSER", payload: resp.data})
                                    console.log(resp.data)
                                    return states.user
                            })
                            .catch(error => {
                                dispatch({type: "SAVEGUEST"})
                                console.log("error logging in")
                            })
                        })
            })
        }
        // if signed 
        else {
            console.log("signed in")
            console.log(states.user.checked)
        }
    })

    return (
        <Route path="/">
            <nav className="navbar navbar-expand-lg sticky-top navbar-light bg-light shadow-sm">
                <div className="container-fluid d-flex justify-content-center">
                    <div class="row w-100">
                        <div class="col-sm headerCol">
                            <a href="/" className="navbar-brand" id="header-logo">
                                <img src={"/logo.svg"} alt="" width="140" height="30" />
                            </a> 
                        </div>
                        <div class="col-lg headerCol" id="headerSearchbarCol">
                            {/* SEARCH BAR */}
                            <input onKeyPress={handleSearchEnter} ref={searchKeywords} class="form-control me-2 headerSearchbar" type="search" placeholder="Search" aria-label="Search"/>
                        </div>
                        <div class="col-sm d-flex align-items-end flex-column headerCol">
                            <UserControlsContainer />
                        </div>
                    </div>
                </div>
            </nav>
        </Route>
    )
}

const mapStateToProps = state => {
    return {
      states: {user: state.userDetailsReducer, redirectLink: state.redirectLinkReducer}
    }
  }

const UserControlsContainer = connect(mapStateToProps)(UserControls);
const HeaderContainer = connect(mapStateToProps)(Header);

export default HeaderContainer