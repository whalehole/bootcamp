import React, { useEffect } from 'react';
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
    Link,
    Redirect,
    useHistory
  } from 'react-router-dom';
import axios from 'axios';
import { setCookie, getCookie, checkCookie } from '../cookie';
import RedirectContainer from './redirect';



function UserGatePage({states, dispatch}) {
    let email, password, username, country;
    // redirects signed in user from sign in & register page & password reset
    $(()=>{
        console.log(states.redirectLink)
        // register page
        $(".notMatchingPasswordWarning").hide()
        $("#registerSubmitButton").off().on("click", ()=>{
            console.log("working")
            // validation NOT DONE
            email = $("#registerEmailInput").val()
            password = document.getElementById("registerPasswordInput").value
            username = $("#registerUsernameInput").val()
            country = $("#registerCountryInput").val()
            if ($("#registerEmailInput").val() == "" || document.getElementById("registerPasswordInput").value == "" || document.getElementById("registerPasswordAgainInput").value == "" || $("#registerUsernameInput").val() == "" || $("#registerCountryInput").val() == "") {
                $(".fieldsNotFilledWarning").css("cssText", "color: red !important;")
            }
            if (password == document.getElementById("registerPasswordAgainInput").value) {
                axios.post('http://127.0.0.1:8000/api-auth/signup/', {
                    email: email,
                    password: password,
                    username: username,
                    country: country
                }).then((resp)=>{
                    for (let x in resp.data) {
                        setCookie(x, resp.data[x], 365)
                        console.log(resp.data)
                    }
                    window.location.href = states.redirectLink;
                }, (error)=>{console.log(error)})
            }
            else {
                $(".notMatchingPasswordWarning").show()
                $(".notMatchingPasswordLabel").css("color", "red")
                document.getElementById("registerPasswordInput").value = ""
                document.getElementById("registerPasswordAgainInput").value = ""
            }
        })
        // sign in page
        $("#signInSubmitButton").off().on("click", ()=>{
            console.log("working")
            email = $("#signInEmailInput").val()
            password = document.getElementById("signInPasswordInput").value
            if (email != "" && password != "") {
                axios.post('http://127.0.0.1:8000/api-auth/signin/', {
                    email: email,
                    password: password,
                }).then((resp)=>{
                    for (let x in resp.data) {
                        setCookie(x, resp.data[x], 365)
                        console.log(resp.data)
                    }
                    window.location.href = states.redirectLink;
                }, (error)=>{alert("Incorrect combination")})
            }
            else {
                document.getElementById("signInPasswordInput").value = ""
            }
        })
    })
    console.log(states.user.signed_in)
    return(
        <div>
            <Route path="/signin">
            {getCookie('access_token') ? <Redirect to="/" /> : 
            <>                
            <div className="container container-small">
                <div class="row g-3">
                    <div class="col-12">
                        <img className="usergate-logo" src="logo.svg" alt="" width="160" height="100" />
                    </div>
                    <div class="form-floating mt-0 mb-1">
                        <input type="email" class="form-control" id="signInEmailInput" name="email" required/>
                        <label for="signInEmailInput">Email address</label>
                    </div>
                    <div class="form-floating">
                        <input type="password" class="form-control" id="signInPasswordInput" name="password" required/>
                        <label class="notMatchingPasswordLabel" for="signInPasswordInput">Password</label>
                    </div>
                    <div class="col-12 mt-0">
                        <Link to="/resetpw" class="font-size-small font-color-gray"><small>forgot your password?</small></Link>
                    </div>
                    <div class="col-12 mt-5 d-flex justify-content-center">
                        <button id="signInSubmitButton" class="btn btn-warning">Sign in</button>
                    </div>
                </div>
            </div>
            </>
            }
            </Route>
            <Route path="/register">
                {getCookie('access_token') ? <Redirect to="/" /> :
                <>
                <div className="container container-small">
                    <div class="row g-3">
                        <div class="col-12">
                            <img className="usergate-logo" src="logo.svg" alt="" width="160" height="100" />
                        </div>
                        <div class="col-12 mb-0">
                            <p class="text-muted fieldsNotFilledWarning"><small>*All fields are required</small></p>
                        </div>
                        <div class="form-floating mt-0 mb-1">
                            <input type="email" class="form-control" id="registerEmailInput" name="email" required/>
                            <label for="registerEmailInput">Email address</label>
                        </div>
                        <div class="col-12 mb-0 mt-0">
                            <p class="text-muted notMatchingPasswordWarning mb-0"><small>*Passwords do not match</small></p>
                        </div>
                        <div class="form-floating">
                            <input type="password" class="form-control" id="registerPasswordInput" name="password" required/>
                            <label class="notMatchingPasswordLabel" for="registerPasswordInput">Password</label>
                        </div>
                        <div class="form-floating">
                            <input type="password" class="form-control" id="registerPasswordAgainInput" name="password" required/>
                            <label class="notMatchingPasswordLabel" for="registerPasswordAgainInput">Confirm password</label>
                        </div>
                        <div class="form-floating">
                            <input type="text" class="form-control" id="registerUsernameInput" name="username" required/>
                            <label for="registerUsernameInput">Desired username</label>
                        </div>
                        {/* <div class="col-6">
                            <div class="form-floating">
                            <select class="form-select" id="registerCountryInput" aria-label="Floating label select example" name="country" required>
                                <option value="" disabled selected>Country</option>
                                <option value="America">America</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                            <label for="registerCountryInput">Select</label>
                            </div>
                        </div> */}
                        <div class="col-12 mt-5 d-flex justify-content-center">
                            <button id="registerSubmitButton" class="btn btn-warning">Register</button>
                        </div>
                    </div>
                </div>
                </>
                }
            </Route>
        </div>
    )
}

const mapStateToProps = state => {
    return {
      states: {redirectLink: state.redirectReducer, user: state.userDetailsReducer}
    }
  }

const UserGatePageContainer = connect(mapStateToProps)(UserGatePage);

export default UserGatePageContainer