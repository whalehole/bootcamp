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
import ItemCard from './itemcard';
var storage = firebase.storage();
var storageRef = storage.ref();

function CharPage() {
    // CHARACTER ID
    const [charID, setCharID] = useState(window.location.pathname.split("/char/")[1])
    // CHAR INFO
    const [charInfo, setCharInfo] = useState([])
    // CHAR AVATAR IMAGE URL
    const [charAvatarImg, setCharAvatarImg] = useState("")
    // USER INFO
    const [userInfo, setUserInfo] = useState({})
    // USER FOLLOWER STATUS
    const [userFollowerStatus, setUserFollowerStatus] = useState(false)
    // CHAR FOLLOWER COUNT
    const [charFollowerCount, setCharFollowerCount] = useState({})
    // CHAR PAGE VIEW COUNT
    const [charPageViewsCount, setCharPageViewsCount] = useState({})
    // CHILD CHAR ART PAGINATION
    const [charartChildsPage, setCharartChildsPage] = useState([1])
    // CHILD CHAR ART ORDER
    const [charartOrder, setCharartOrder] = useState("trending")
    // CHILD CHAR ART 
    const [charart, setCharart] = useState([])

    // NEED TO BE RETRIEVED ONLY ONCE
    useEffect(()=>{
        // CHAR INFO & USER INFO
        axios.get(`http://127.0.0.1:8000/api-auth/char/?characterid=[${charID}]`)
        .then((resp)=>{
            axios.get(`http://127.0.0.1:8000/api-auth/userdetails/?userid=${resp.data[0].userid}`)
            .then((resp2)=>{
                console.log("CHARACTER INFO: ", resp.data)
                console.log("CREATOR INFO: ", resp2.data)
                setCharInfo(resp.data)
                setUserInfo(resp2.data)
            })
        })
        // CHAR AVATAR IMAGE URL
        storageRef.child(`char_avatar_image/${charID}`).getDownloadURL()
        .then((url)=>{
            setCharAvatarImg(url)
        })
        // CHAR FOLLOWER COUNT
        axios.get(`http://127.0.0.1:8000/api-auth/charcount/?type=follower_count&characterid=${charID}`)
        .then((resp)=>{
            setCharFollowerCount(resp.data)
        })
        // CHAR PAGE VIEWS COUNT
        axios.get(`http://127.0.0.1:8000/api-auth/charcount/?type=page_views&characterid=${charID}`)
        .then((resp)=>{
            setCharPageViewsCount(resp.data)
        })
        console.log("once retrival done")
        // ADD PAGE VIEWS COUNT
        axios.patch(`http://127.0.0.1:8000/api-auth/addCharPageViews/?characterid=${charID}`, {
            characterid: `${charID}`,
            page_views: 1
        })
        // FOLLOWER STATUS
        axios.get(`http://127.0.0.1:8000/api-auth/followcharacter/?characterid=${charID}`, {
            headers: {
                'Authorization': `Bearer ${getCookie("access_token")}`
            }
        })
        .then((resp)=>{
            if (resp.data.characterid == charID) {
                setUserFollowerStatus(true)
            }
        })
    },[])

    // SCREEN NEEDS TO BE UPDATED  
    useEffect(()=>{
        // RETRIEVE CHILD CHAR ART PAGINATION
        axios.get(`http://127.0.0.1:8000/api-auth/charart/?order_by=${charartOrder}&page_size=12&page=${charartChildsPage[0]}&characterid=${charID}`)
        .then((resp)=>{
            setCharart(charart.concat(resp.data.results))
        })

    },[charartChildsPage])

    // SCREEN NEEDS TO BE UPDATED 
    useEffect(()=>{
        // RESET IMAGE GALLERY
        setCharart([])
        setCharartChildsPage([1])
    },[charartOrder])

    // HANDLERS
    const handleTrendingOrder = event => {
        console.log(charartOrder)
        setCharartOrder("trending")
    }
    const handleNewestOrder = event => {
        console.log(charartOrder)
        setCharartOrder("newest")
    }
    const handleFollowButton = event => {
        axios.post(`http://127.0.0.1:8000/api-auth/followcharacter/`, {
            characterid: charID
        }, {
            headers: {
                'Authorization': `Bearer ${getCookie("access_token")}`
            }
        })
        .then(()=>{
            setUserFollowerStatus(true)
        })
    }
    const handleUnfollowButton = event => {
        axios.delete(`http://127.0.0.1:8000/api-auth/followcharacter/?characterid=${charID}`, {
            headers: {
                'Authorization': `Bearer ${getCookie("access_token")}`
            }
        })
        .then(()=>{
            setUserFollowerStatus(false)
        })
    }

    return (
        <>
        {/* CHECK */}
        {console.log('re rendering baby')}
        {/* HEADER */}
        <HeaderContainer />

        <div className="container page-container">
            
            {/* ROOF */}
            <div className="d-flex justify-content-center mt-5">
                <div className="row container-character-page-top shadow-sm rounded p-3">
                    {/* AVATAR IMAGE */}
                    <div className="col-3 p-0">
                        <img src={charAvatarImg} className="rounded-circle" style={{height:"143px", width:"143px", objectFit:"cover"}}></img>
                    </div>
                    {/* CHARACTER INFO */}
                    <div className="col-9">
                        <div className="d-flex flex-column" style={{height:"143px"}}>
                            {/* CHARACTER FIRST INFO */}
                            <div className="d-flex flex-row">
                                {/* CHARACTER GENDER & SPECIES*/}    
                                {
                                    charInfo[0] ? 
                                    (charInfo[0].genderid == 1 ? 
                                    <img style={{height:"20px"}} src="https://img.icons8.com/officel/80/000000/male-stroke-v.png"/> 
                                    : charInfo[0].genderid == 2 ? 
                                    <img style={{height:"20px"}} src="https://img.icons8.com/officel/80/000000/female.png"/> 
                                    : <img style={{height:"20px"}} src="https://img.icons8.com/bubbles/100/000000/question-mark.png"/>)
                                    : null
                                }
                                {
                                    charInfo[0] &&
                                    <p className="mb-0" style={{marginLeft:"5px",opacity:"0.5"}}>{charInfo[0].character_species}</p>
                                }
                            </div>
                            {/* CHARACTER NAME */}
                            {
                                charInfo[0] &&
                                <div className="d-flex flex-row">
                                    <p className="mb-0" style={{fontSize:"25px",fontWeight:"bold"}}>{charInfo[0].character_name}</p>
                                    {/* FOLLOWER STATUS */}
                                    {/* {
                                        userFollowerStatus ? 
                                        <p onClick={handleUnfollowButton} className="mb-0 border border-warning rounded-pill ms-auto" style={{width:"80px",height:"37.33px",lineHeight:"37.33px",textAlign:"center",verticalAlign:"middle",backgroundColor:"orange",color:"white",fontWeight:"bold"}} type="button">Followed</p>
                                        :
                                        <p onClick={handleFollowButton} className="mb-0 border border-warning rounded-pill ms-auto" style={{width:"80px",height:"37.33px",lineHeight:"37.33px",textAlign:"center",verticalAlign:"middle"}} type="button">Follow</p>
                                    } */}
                                </div>
                            }
                            {/* CHARACTER NICKNAME */}
                            {
                                charInfo[0] &&
                                <p className="mb-0" style={{fontSize:"14px"}}>{charInfo[0].character_nickname}</p>
                            }
                            {/* CHARACTER STATISTICS */}
                            <div className="d-flex flex-row mt-auto">
                                {
                                    charInfo[0] &&
                                    <p style={{fontSize:"14px",opacity:"0.5",marginBottom:"0px"}}>{charPageViewsCount.page_views} views</p>
                                }
                                <p style={{fontSize:"14px",marginLeft:"5px",marginRight:"5px",marginBottom:"0px",opacity:"0.5",fontWeight:"bold"}}>&middot;</p>
                                {
                                    charInfo[0] &&
                                    <p style={{fontSize:"14px",opacity:"0.5",marginBottom:"0px"}}>{charFollowerCount.follower_count} followers</p>
                                }
                                <p style={{fontSize:"14px",marginLeft:"5px",marginRight:"5px",marginBottom:"0px",opacity:"0.5",fontWeight:"bold"}}>&middot;</p>
                                {
                                    charInfo[0] &&
                                    <p style={{fontSize:"14px",opacity:"0.5",marginBottom:"0px"}}>{charInfo[0].date_created} date created</p>
                                }
                                <p style={{fontSize:"14px",marginLeft:"5px",marginRight:"5px",marginBottom:"0px",opacity:"0.5",fontWeight:"bold"}}>&middot;</p>
                            </div>
                            {/* CREATOR INFO */}
                            <div className="d-flex flex-row">
                                {
                                    userInfo &&
                                    <p style={{fontSize:"14px",opacity:"0.5",marginBottom:"0px"}}>created by {userInfo.username}</p>
                                }
                                <p style={{fontSize:"14px",marginLeft:"5px",marginRight:"5px",marginBottom:"0px",opacity:"0.5",fontWeight:"bold"}}>&middot;</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BODY */}
            <div className="mt-4">
                {/* ORDER OPTIONS */}
                <div className="row">
                    <nav class="navbar navbar-expand-lg navbar-light shadow-sm rounded">
                        <div class="container-fluid">
                            <div id="navbarNav">
                                <ul class="navbar-nav">
                                    <li class="nav-item">
                                        <Link type="button" to={`/char/${charID}/gallery/trending`} class="nav-link" style={{fontWeight: charartOrder == 'trending' ? "bold" : null}} onClick={handleTrendingOrder}>Trending</Link>
                                    </li>
                                    <li class="nav-item">
                                        <Link type="button" to={`/char/${charID}/gallery/newest`} class="nav-link" style={{fontWeight: charartOrder == 'newest' ? "bold" : null}} onClick={handleNewestOrder}>New</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
                {/* IMAGE GALLERY */}
                <div className="row mt-5">
                    {
                        charart.map((charart)=>{
                            console.log(charart)
                            return <ItemCard details={charart} />
                        })
                    }
                </div>
            </div>

            {/* FOOTER */}
            <div className="row">

            </div>
            
        </div>
        </>
    )
}

export default CharPage