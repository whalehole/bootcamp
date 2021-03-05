import CommentSection from './commentsection';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import HeaderContainer from './header';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from 'react-router-dom';
import firebase from './../firebase';
import { setCookie, getCookie, checkCookie } from '../cookie';
var storage = firebase.storage();
var storageRef = storage.ref();
var formatDistanceToNow = require('date-fns/formatDistanceToNow')

function CharartPage() {
    const [charartID, setCharartID] = useState(window.location.pathname.split("/charart/")[1])
    const [charartDetails, setCharartDetails] = useState({url: "", details: "", user: ""})
    const [charartCounts, setCharartCounts] = useState({})
    const [action, setAction] = useState(0)
    const [charartLiked, setCharartLiked] = useState(false)
    // const [charartBookmarked, setCharartBookmarked] = useState(false)
    const [pageViews, setPageViews] = useState(0)
    const image = useRef()

    useEffect(()=>{
        axios.get(`http://127.0.0.1:8000/api-auth/charart/?character_artid=[${charartID}]`)
        .then((details)=>{
            axios.get(`http://127.0.0.1:8000/api-auth/userdetails/?userid=${details.data[0].userid}`)
            .then((user)=>{
                storageRef.child(`charart/${charartID}`).getDownloadURL()
                .then((url)=>{
                    setCharartDetails({url: url, details: details.data, user: user.data})
                })
            })
        })
        axios.patch(`http://127.0.0.1:8000/api-auth/addCharartPageViews/?character_artid=${charartID}`, {
            character_artid: charartID,
            page_views: "1"
        })
        .then((resp)=>{
            console.log("page views: ", resp.data.page_views)
            setPageViews(resp.data.page_views)
        })
    }, [])

    useEffect(()=>{
        axios.get(`http://127.0.0.1:8000/api-auth/charartcount/?character_artid=${charartID}&type=counts`)
        .then((counts)=>{
            setCharartCounts(counts.data)
        })
        // HEART
        axios.get(`http://127.0.0.1:8000/api-auth/likecharart/?character_artid=${charartID}`, {
            headers: {
                'Authorization': `Bearer ${getCookie("access_token")}`
            }
        })
        .then((resp)=>{
            if (resp.data.character_artid == charartID) {
                setCharartLiked(true)
            }
        })
        .catch(()=>{
            setCharartLiked(false)
        })
        // // BOOKMARK
        // axios.get(`http://127.0.0.1:8000/api-auth/bookmarkcharart/?character_artid=${charartID}`, {
        //     headers: {
        //         'Authorization': `Bearer ${getCookie("access_token")}`
        //     }
        // })
        // .then((resp)=>{
        //     if (resp.data.character_artid == charartID) {
        //         setCharartBookmarked(true)
        //     }
        // })
        // .catch(()=>{
        //     setCharartBookmarked(false)
        // })
    }, [action])

    const handleHeart = event => {
        axios.post(`http://127.0.0.1:8000/api-auth/likecharart/`, {
            character_artid: charartID
        }, {
            headers: {
                'Authorization': `Bearer ${getCookie("access_token")}`
            }
        })
        .then(()=>{
            setAction(action+1)
        })
    }

    const handleUnheart = event => {
        axios.delete(`http://127.0.0.1:8000/api-auth/likecharart/?character_artid=${charartID}`, {
            headers: {
                'Authorization': `Bearer ${getCookie("access_token")}`
            }
        })
        .then(()=>{
            setAction(action+1)
        })
    }

    // const handleBookmark = event => {
    //     axios.post(`http://127.0.0.1:8000/api-auth/bookmarkcharart/`, {
    //         character_artid: charartID
    //     }, {
    //         headers: {
    //             'Authorization': `Bearer ${getCookie("access_token")}`
    //         }
    //     })
    //     .then(()=>{
    //         setAction(action+1)
    //     })
    // }

    // const handleUnbookmark = event => {
    //     axios.delete(`http://127.0.0.1:8000/api-auth/bookmarkcharart/?character_artid=${charartID}`, {
    //         headers: {
    //             'Authorization': `Bearer ${getCookie("access_token")}`
    //         }
    //     })
    //     .then(()=>{
    //         setAction(action+1)
    //     })
    // }
    return (
        <div className="container-fluid page-container">
            <HeaderContainer />
            <div className="container mt-5">
                <div className="d-flex justify-content-between mb-2 ">
                    <div className="d-flex align-items-center">
                        {/* page statistics */}
                        <img style={{height: "40%", opacity: "0.2"}} src="https://img.icons8.com/dotty/80/000000/visible.png"/>
                        <p style={{fontSize: "13px", color: "orange", marginBottom: "0px", marginLeft: "5px"}}>{pageViews}</p>
                    </div>
                    
                    <div className="d-flex align-items-center">
                        {/* created by */}
                        <div className="col-auto">
                            <div className="row justify-content-end">
                                <div className="col-auto">
                                    {
                                        charartDetails.details &&
                                        <p className="p-0 m-0" style={{textDecoration: "none", color: "gray", padding: "10px", paddingTop:"0px", display:"block",fontSize:"12px"}}>
                                        created {charartDetails.details[0].date_created ? formatDistanceToNow(new Date(charartDetails.details[0].date_created)) : null}
                                        </p>
                                    }
                                </div>
                                <div class="w-100"></div>
                                <div className="col-auto">
                                    <Link className="p-0 m-0" to={`/user/${charartDetails.user.id}`} style={{textDecoration: "none", color: "gray", padding: "10px", paddingTop:"0px", display:"block",fontSize:"12px"}}>
                                        by {charartDetails.user.username}
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {/* profile pic */}
                    </div>
                </div>
                <div className="row">
                    {/* charart image */}
                    <div className="col">
                        <div className="container-fluid" style={{height: "60vh"}}>
                            {charartDetails.url && <img ref={image} src={charartDetails.url} className="mx-auto" style={{height: "100%", display: "block"}}></img>}
                        </div>
                    </div>
                </div>
                {/* charart info */}
                <div className="row mt-3 shadow-sm rounded">
                    {/* gender */}
                    <div className="col-auto d-flex align-items-center">
                        <div className="d-flex flex-column">
                            <div><p className="p-0 m-0" style={{textDecoration: "none", color: "gray", padding: "10px", paddingTop:"0px", display:"block",fontSize:"12px"}}>Gender</p></div>
                            {
                                charartDetails.details && 
                                <div className="d-flex align-items-center" style={{width: "70px", height: "40px"}}>
                                    {charartDetails.details[0].genderid == 1 ? <Link className="mx-auto" style={{height: "80%", display: "block"}} to={`/search/?genderid=${charartDetails.details[0].genderid}`}><img className="mx-auto" style={{height: "80%", display: "block"}} src="https://img.icons8.com/officel/80/000000/male-stroke-v.png"/></Link> : charartDetails.details[0].genderid == 2 ? <Link className="mx-auto" style={{height: "80%", display: "block"}} to={`/search/?genderid=${charartDetails.details[0].genderid}`}><img className="mx-auto" style={{height: "80%", display: "block"}} src="https://img.icons8.com/officel/80/000000/female.png"/></Link> : <img className="mx-auto" style={{height: "80%", display: "block"}} src="https://img.icons8.com/bubbles/100/000000/question-mark.png"/>}
                                </div>
                            }
                        </div>
                    </div>

                    {/* species */}
                    <div className="col-auto d-flex align-items-center">
                        <div className="d-flex flex-column">
                            <div><p className="p-0 m-0" style={{textDecoration: "none", color: "gray", padding: "10px", paddingTop:"0px", display:"block",fontSize:"12px"}}>Species</p></div>
                            {
                                charartDetails.details && 
                                <div className="d-flex align-items-center" style={{width: "70px", height: "40px"}}>
                                    {charartDetails.details[0].character_species ? <Link to={`/search/?species=${charartDetails.details[0].character_species}`} style={{textDecoration: "none", color:"black"}}><p className="m-0" style={{textAlign: "center", width: "100%"}}>{charartDetails.details[0].character_species}</p></Link> : <img className="mx-auto" style={{height: "100%", display: "block"}} src="https://img.icons8.com/bubbles/100/000000/question-mark.png"/>}
                                </div>
                            }
                        </div>
                    </div>
                </div> 
                {/* charart */}
                <div className="row mt-3 shadow-sm rounded">
                    <div className="col-9">
                        <div className="row">
                            <div className="col">
                                {
                                    charartDetails.details && 
                                    <p className="p-0 m-0" style={{textDecoration: "none", color: "rgb(78, 78, 78)", padding: "10px", paddingTop:"0px", display:"block",fontSize:"20px", fontWeight: "bold"}}>{charartDetails.details[0].title}</p>
                                }
                            </div>
                            <div class="w-100"></div>
                            <div className="col">
                                {
                                    charartDetails.details && 
                                    <p className="p-0 m-0" style={{textDecoration: "none", color: "rgb(78, 78, 78)", padding: "10px", paddingTop:"0px", display:"block",fontSize:"16px"}}>{charartDetails.details[0].caption}</p>
                                }
                            </div>
                            <div class="w-100"></div>
                            <div className="col mt-3">
                                <div className="row">
                                    {
                                        charartDetails.details && 
                                        charartDetails.details[0].character_art_tag.split(',').map((tag)=>{
                                            return <Link to={`/search/?tags=${tag}`} style={{textDecoration: "none", color: "gray", padding: "10px", paddingTop:"0px", display:"block",fontSize:"13px", minWidth: "60px", textAlign: "center"}} to={`/search/?tags=${tag}`} className="col-auto">{tag}</Link>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-3">
                        {/* interactions */}
                        <div className="d-flex flex-row-reverse">
                            <div className="d-flex flex-column">
                                <div className="d-flex align-items-center" style={{width: "70px", height: "40px"}}>
                                    {charartLiked ? <img className="mx-auto" onClick={handleUnheart} type="button" style={{height: "80%", display: "block"}} src="https://img.icons8.com/color/96/000000/like--v3.png"/> : <img onClick={handleHeart} type="button" className="mx-auto" style={{height: "80%", display: "block", opacity: "0.5"}} src="https://img.icons8.com/office/96/000000/like--v2.png"/>}
                                </div>
                                <div><p className="p-0 m-0" style={{textAlign: "center", textDecoration: "none", color: "gray", padding: "10px", paddingTop:"0px", display:"block", fontSize:"12px"}}>{charartCounts.like_count}</p></div> 
                            </div>
                            {/* <div className="d-flex flex-column">
                                <div className="d-flex align-items-center" style={{width: "70px", height: "40px"}}>
                                    {charartBookmarked ? <img className="mx-auto" onClick={handleUnbookmark} type="button" style={{height: "80%", display: "block"}} src="https://img.icons8.com/color/96/000000/bookmark-ribbon--v1.png"/> : <img onClick={handleBookmark} type="button" className="mx-auto" style={{height: "80%", display: "block", opacity: "0.5"}} src="https://img.icons8.com/color/96/000000/bookmark-ribbon--v2.png"/>}
                                </div>
                                <div><p className="p-0 m-0" style={{textAlign: "center", textDecoration: "none", color: "gray", padding: "10px", paddingTop:"0px", display:"block",fontSize:"12px"}}></p></div> 
                            </div> */}
                        </div>
                    </div>
                </div>
                {/* comment section */}
                <div className="row mt-3 shadow-sm rounded">
                    <CommentSection character_artid={charartID}/>
                </div>
            </div>
        </div>
        
    )
}

export default CharartPage