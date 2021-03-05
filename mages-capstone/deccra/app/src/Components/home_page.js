import React, { useEffect, useState, useRef } from 'react';
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
    NavLink
  } from 'react-router-dom';
import { Tabs, Tab, Nav } from 'react-bootstrap';
import ScrollReveal from 'scrollreveal';
// COMPONENTS
import HeaderContainer from './header';
import SearchBar from './searchbar';
import ItemCard from './itemcard';
import ItemCardChar from './itemcard_char';
import { useInView, InView } from 'react-intersection-observer';
import axios from 'axios';
import firebase from './../firebase';
var storage = firebase.storage();
var storageRef = storage.ref();

function HomePage() {
    // ENTRY POINT
    const [justEntered, setJustEntered] = useState(true)
    const [key, setKey] = useState('home');
    // CHARART
    const [charartPage, getCharartPage] = useState(1)
    const [charart, getCharart] = useState([])
    // CHAR
    const [charPage, getCharPage] = useState(1)
    const [char, getChar] = useState([])
    // SORT FILTER
    const [order, getOrder] = useState('trending')
    // REMOUNT KEY
    const [keyid, setKeyid] = useState(0)
    // FILTER DETAILS
    const [filterChoices, setFilterChoices] = useState({tags: "", genderid: "", species: ""})

    useEffect(()=>{
        if (window.location.pathname == "/") {
            axios.get('http://127.0.0.1:8000/api-auth/charart/', {
                params: {
                    "tags": `${filterChoices.tags}`,
                    "genderid": `${filterChoices.genderid}`,
                    "species": `${filterChoices.species}`,
                    "page": `${charartPage}`,
                    "page_size": "12",
                    "order_by": `${order}`
                }
            })
            .then((resp)=>{
                getCharart(charart.concat(resp.data.results))
            })
        }
        if (window.location.pathname == "/chars") {
            axios.get('http://127.0.0.1:8000/api-auth/char/', {
                params: {
                    "tags": `${filterChoices.tags}`,
                    "genderid": `${filterChoices.genderid}`,
                    "species": `${filterChoices.species}`,
                    "page": `${charPage}`,
                    "page_size": "12",
                    "order_by": `${order}`
                }
            })
            .then((resp)=>{
                getChar(char.concat(resp.data.results))
            })
        }
    }, [charartPage, charPage, justEntered, filterChoices])

    const filterTags = useRef()
    const filterGender = useRef()
    const filterSpecies = useRef()
    const handleFilterSubmit = event => {
        console.log("filtered")
        getCharart([])
        getCharartPage(1)
        setJustEntered(true)
        setKeyid(keyid + 1)
        setFilterChoices({tags: filterTags.current.value, genderid: filterGender.current.value, species: filterSpecies.current.value})
    }
    const handleFilterReset = event => {
        getCharart([])
        getCharartPage(1)
        setJustEntered(true)
        setKeyid(keyid + 1)
        setFilterChoices({tags: "", genderid: "", species: ""})
    }
    const handleFilterSubmit2 = event => {
        console.log("filtered")
        getChar([])
        getCharPage(1)
        setJustEntered(true)
        setKeyid(keyid + 1)
        setFilterChoices({tags: filterTags.current.value, genderid: filterGender.current.value, species: filterSpecies.current.value})
    }
    const handleFilterReset2 = event => {
        getChar([])
        getCharPage(1)
        setJustEntered(true)
        setKeyid(keyid + 1)
        setFilterChoices({tags: "", genderid: "", species: ""})
    }
    const handleClick = event => {
        getCharart([])
        getCharartPage(1)
        getOrder('trending')
        setJustEntered(true)
        setKeyid(keyid + 1)
        setFilterChoices({tags: "", genderid: "", species: ""})
    }
    const handleClick2 = event => {
        getCharart([])
        getCharartPage(1)
        getOrder('newest')
        setJustEntered(true)
        setKeyid(keyid + 1)
        setFilterChoices({tags: "", genderid: "", species: ""})
    }
    const handleClick3 = event => {
        getChar([])
        getCharPage(1)
        getOrder('trending')
        setJustEntered(true)
        setKeyid(keyid + 1)
        setFilterChoices({tags: "", genderid: "", species: ""})
    }
    const handleClick4 = event => {
        getChar([])
        getCharPage(1)
        getOrder('newest')
        setJustEntered(true)
        setKeyid(keyid + 1)
        setFilterChoices({tags: "", genderid: "", species: ""})
    }
    
    return (
            <div className="container-fluid page-container">
                {console.log("homepage looping")}
                <HeaderContainer />
                <SearchBar />
                {/* body container */}
                <div className="container mt-5">
                    {/* navigation */}
                    <nav class="navbar navbar-expand-lg">
                        <div class="container-fluid shadow-sm rounded">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item">
                                    <div>
                                        <NavLink onClick={handleClick} aria-current="page" exact to="/" style={{textDecoration: "none", color: "gray", padding: "10px", paddingTop:"0px", display:"block",fontSize:"12px"}} activeStyle={{color: "orange", textDecoration: "none"}}>
                                            <img style={{marginLeft:"auto",marginRight:"auto",display:"block", width: "48px", height: "48"}} src="https://img.icons8.com/cotton/64/000000/image--v2.png"/>
                                            Character art
                                        </NavLink>
                                    </div>
                                </li>
                                {/* <li class="nav-item">
                                    <div>
                                        <NavLink to="/chars" onClick={handleClick3} style={{textDecoration: "none", color: "gray", padding: "10px", paddingTop:"0px", display:"block",fontSize:"12px"}} activeStyle={{color: "orange", textDecoration: "none"}}>
                                            <img style={{marginLeft:"auto",marginRight:"auto",display:"block"}} src="https://img.icons8.com/color/48/000000/gender-neutral-user.png"/>
                                            Characters
                                        </NavLink>
                                    </div>
                                </li> */}
                            </ul>
                        </div>
                    </nav>
                    {/* content */}
                    {/* FOR CHAR ART */}
                    <Route exact path="/">
                        {/* sort filter navigation bar */}
                        <ul class="nav justify-content-end mt-4 mb-0">
                            <li class="nav-item">
                                <a type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" class="nav-link" style={{color: "orange"}}>Filter</a>
                                {/* FILTER MODAL */}
                                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel">Filter options</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                <form>
                                                <div class="mb-3">
                                                    <label for="submitFilterTagsInput" class="col-form-label">Tags</label>
                                                    <input type="text" class="form-control" id="submitFilterTagsInput" ref={filterTags}/>
                                                </div>
                                                <div class="mb-3">
                                                    <label for="submitFilterGenderInput" class="col-sm-1 col-form-label">Gender</label>
                                                    <select class="form-select" aria-label="Default select example" id="submitFilterGenderInput" ref={filterGender}>
                                                        <option selected disabled value="">Choose</option>
                                                        <option value="">All genders</option>
                                                        <option value="1">Male</option>
                                                        <option value="2">Female</option>
                                                        <option value="3">Mix</option>
                                                        <option value="4">None</option>
                                                        <option value="5">Unknown</option>
                                                    </select>
                                                </div>
                                                <div class="mb-3">
                                                    <label for="submitFilterSpeciesInput" class="col-form-label">Species</label>
                                                    <input type="text" class="form-control" id="submitFilterSpeciesInput" ref={filterSpecies}/>
                                                </div>
                                                </form>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-danger me-auto" data-bs-dismiss="modal" onClick={handleFilterReset}>Reset</button>
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={handleFilterSubmit}>Filter</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <nav class="navbar navbar-expand-lg navbar-light shadow-sm rounded">
                            <div class="container-fluid">
                                <div id="navbarNav">
                                    <ul class="navbar-nav">
                                        <li class="nav-item">
                                            <Link class="nav-link" to="/" style={{fontWeight: order == 'trending' ? "bold" : null}} onClick={handleClick}>Trending</Link>
                                        </li>
                                        <li class="nav-item">
                                            <Link class="nav-link" to="/" style={{fontWeight: order == 'newest' ? "bold" : null}} onClick={handleClick2}>New</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                        <div class="container mt-4">
                            <div class="row">
                                {console.log(charart)}
                                {
                                    charart.map(charart => {
                                        console.log(charart)
                                        return <ItemCard details={charart} />
                                    })
                                }

                                <InView as="div" onChange={(inView, entry) => {
                                    console.log(entry)
                                    if (inView == true && justEntered == false) {
                                        getCharartPage(charartPage + 1)
                                    } 
                                    justEntered && setJustEntered(false)
                                }}>
                                    <h2></h2>
                                </InView>
                                <div style={{height: "700px"}}></div>
                            </div>
                        </div>
                    </Route>
                    {/* FOR CHAR */}
                    <Route path="/chars">
                        {/* sort filter navigation bar */}
                        <ul class="nav justify-content-end mt-4 mb-0">
                            <li class="nav-item">
                            <a type="button" data-bs-toggle="modal" data-bs-target="#exampleModal2" class="nav-link" style={{color: "orange"}}>Filter</a>
                                {/* FILTER MODAL */}
                                <div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModal2Label" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModal2Label">Filter options</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                <form>
                                                <div class="mb-3">
                                                    <label for="submitFilterTagsInput2" class="col-form-label">Tags</label>
                                                    <input type="text" class="form-control" id="submitFilterTagsInput2" ref={filterTags}/>
                                                </div>
                                                <div class="mb-3">
                                                    <label for="submitFilterGenderInput2" class="col-sm-1 col-form-label">Gender</label>
                                                    <select class="form-select" aria-label="Default select example" id="submitFilterGenderInput2" ref={filterGender}>
                                                        <option selected disabled value="">Choose</option>
                                                        <option value="">All genders</option>
                                                        <option value="1">Male</option>
                                                        <option value="2">Female</option>
                                                        <option value="3">Mix</option>
                                                        <option value="4">None</option>
                                                        <option value="5">Unknown</option>
                                                    </select>
                                                </div>
                                                <div class="mb-3">
                                                    <label for="submitFilterSpeciesInput2" class="col-form-label">Species</label>
                                                    <input type="text" class="form-control" id="submitFilterSpeciesInput2" ref={filterSpecies}/>
                                                </div>
                                                </form>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-danger me-auto" data-bs-dismiss="modal" onClick={handleFilterReset2}>Reset</button>
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={handleFilterSubmit2}>Filter</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <nav class="navbar navbar-expand-lg navbar-light shadow-sm rounded">
                            <div class="container-fluid">
                                <div id="navbarNav">
                                    <ul class="navbar-nav">
                                        <li class="nav-item">
                                            <Link class="nav-link" to="/chars" style={{fontWeight: order == 'trending' ? "bold" : null}} onClick={handleClick3}>Trending</Link>
                                        </li>
                                        <li class="nav-item">
                                            <Link class="nav-link" to="/chars" style={{fontWeight: order == 'newest' ? "bold" : null}} onClick={handleClick4}>New</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                        <div class="container mt-4">
                            <div class="row">
                                {console.log(char)}
                                {
                                    char.map(char => {
                                        console.log(char)
                                        return <ItemCardChar details={char} />
                                    })
                                }

                                <InView key={keyid} as="div" onChange={(inView, entry) => {
                                    if (inView == true && justEntered == false) {
                                        getCharPage(charPage + 1)
                                    }
                                    justEntered && setJustEntered(false)
                                }}>
                                    <h2></h2>
                                </InView>
                                <div style={{height: "700px"}}></div>
                            </div>
                        </div>
                    </Route>
                </div>
            </div>
    )
}

export default HomePage