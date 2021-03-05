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
    Link
  } from 'react-router-dom';
import { setCookie, getCookie, checkCookie } from '../cookie';

function Redirect({states, dispatch}) {
    if (getCookie("access_token") && (window.location.pathname == "/signin" || window.location.pathname == "/register" || window.location.pathname == "/resetpw" || window.location.pathname == "/forgetpw")) {
        window.location.href = "http://localhost:3000/";
    }
    return <span></span>
}

const mapStateToProps = state => {
    return {
        states: {redirectLink: state.redirectLinkReducer}
    }
}

const RedirectContainer = connect(mapStateToProps)(Redirect);

export default RedirectContainer

// import RedirectContainer from './redirect';