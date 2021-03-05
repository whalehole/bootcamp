import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import HeaderContainer from './header';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useLocation
  } from 'react-router-dom';
import firebase from './../firebase';
import { setCookie, getCookie, checkCookie } from '../cookie';
import { useInView, InView } from 'react-intersection-observer';
import ItemCard from './itemcard';
import ItemCardChar from './itemcard_char';
var storage = firebase.storage();
var storageRef = storage.ref();

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

function SearchResultPage() {
    // ENTRY POINT
    const [justEntered, setJustEntered] = useState(true)
    // REMOUNT KEY
    const [keyid, setKeyid] = useState(0)
    // SEARCH KEYWORDS
    const [keywords, setKeywords] = useState("")
    // FILTER CHOICES
    const [filterChoices, setFilterChoices] = useState({tags: "", genderid: "", species: ""})
    // SORT CHOICE
    const [sort, setSort] = useState("")
    // CATEGORY CHOICE
    const [category, setCategory] = useState("charart")
    // EXTRACT URL QUERY VALUES
    let query = useQuery();
    // CURRENT PAGE
    const [page, setPage] = useState(1)
    // SEARCH RESULTS
    const [searchResult, setSearchResult] = useState([])
    // REDIRECT STATUS
    const [redirected, setRedirected] = useState(false)

    // REF VALUES
    const filterTags = useRef()
    const filterGender = useRef()
    const filterSpecies = useRef()

    // METHODS
    // CHANGE TO CHARACTER ART CATEGORY
    const handleCategoryCharart = event => {
        setCategory("charart")
        setPage(1)
        setSearchResult([])
        setKeyid(keyid + 1)
        setJustEntered(true)
    }
    // CHANGE TO CHARACTER CATEGORY
    const handleCategoryChar = event => {
        setCategory("char")
        setPage(1)
        setSearchResult([])
        setKeyid(keyid + 1)
        setJustEntered(true)
    }
    // FILTER SUBMIT
    const handleFilterSubmit = event => {
        setFilterChoices({tags: filterTags.current.value, genderid: filterGender.current.value, species: filterSpecies.current.value})
        setPage(1)
        setSearchResult([])
        setKeyid(keyid + 1)
        setJustEntered(true)
    }
    // FILTER RESET
    const handleFilterReset = event => {
        setFilterChoices({tags: "", genderid: "", species: ""})
        setPage(1)
        setSearchResult([])
        setKeyid(keyid + 1)
        setJustEntered(true)
    }
    // CHANGE TO SORT CHOICE
    const handleSortTrending = event => {
        setSort("trending")
        setPage(1)
        setSearchResult([])
        setKeyid(keyid+1)
        setJustEntered(true)
    }
    const handleSortNewest = event => {
        setSort("newest")
        setPage(1)
        setSearchResult([])
        setKeyid(keyid+1)
        setJustEntered(true)
    }
    const handleSortRelevance = event => {
        setSort("")
        setPage(1)
        setSearchResult([])
        setKeyid(keyid+1)
        setJustEntered(true)
    }
    const handleSearchEnter = event => {
        setSort("")
        setPage(1)
        setSearchResult([])
        setKeyid(keyid+1)
        setJustEntered(true)
        setKeywords(query.get('keywords') ? query.get('keywords') : "")
    }

    // COMPONENT DID MOUNT
    useEffect(()=>{
        // EXTRACT URL QUERY VALUES
        console.log(query.get('keywords'))
        setKeywords(query.get('keywords') ? query.get('keywords') : "")
        setFilterChoices({tags: query.get('tags') ? query.get('tags') : "", genderid: query.get('genderid') ? query.get('genderid') : "", species: query.get('species') ? query.get('species') : ""})
        setRedirected(true)
    }, [])

    // COMPONENT DID UPDATE
    useEffect(()=>{
        redirected &&
        axios.get(`http://127.0.0.1:8000/api-auth/${category}/?keywords=${keywords}&tags=${filterChoices.tags}&genderid=${filterChoices.genderid}&species=${filterChoices.species}&order_by=${sort}&page=${page}&page_size=12`)
        .then((resp)=>{
            setSearchResult(searchResult.concat(resp.data.results))
        })
    },[category, keywords, filterChoices, sort, page, justEntered, redirected])
    
    return (
        <>
        {console.log(searchResult)}
        {console.log("KEYWORDS: ", keywords, "FILTER CHOICES: ", filterChoices)}
        {/* HEADER */}
        <HeaderContainer />

        {/* BODY */}
        <div className="container page-container mt-5">

            {/* SEARCHED FIELDS */}
            <div className="container d-flex">
                <div className="d-flex flex-column" style={{width:"800px"}}>
                    <p className="mb-0">Keywords: {keywords}</p>
                    <p className="mb-0">Tags: {filterChoices.tags}</p>
                    <p className="mb-0">Gender: {filterChoices.genderid == 1 ? "Male" : filterChoices.genderid == 2 ? "Female" : filterChoices.genderid == 3 ? "Mix" : filterChoices.genderid == 4 ? "None" : "All genders"}</p>
                    <p className="mb-0">Species: {filterChoices.species}</p>
                </div>
            </div>
            {/* CATEGORIES NAVBAR */}
            <div className="row mt-5">
                <nav class="navbar navbar-expand-lg navbar-light shadow-sm rounded">
                    <div class="container-fluid p-0">
                        <div id="navbarNav">
                            <ul class="navbar-nav">
                                <li class="nav-item">
                                    <p type="button" class="nav-link mb-0" style={{fontWeight: category == 'charart' ? "bold" : null}} onClick={handleCategoryCharart}>Character art</p>
                                </li>
                                {/* <li class="nav-item">
                                    <p type="button" class="nav-link mb-0" style={{fontWeight: category == 'char' ? "bold" : null}} onClick={handleCategoryChar}>Characters</p>
                                </li> */}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            {/* SORTING NAVBAR */}
            <ul class="nav nav-tabs mt-4" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button onClick={handleSortRelevance} class="nav-link active" id="relevance-tab" data-bs-toggle="tab" type="button" role="tab" aria-controls="trending" aria-selected="true">Relevance</button>
            </li>
            <li class="nav-item" role="presentation">
                <button onClick={handleSortTrending} class="nav-link" id="trending-tab" data-bs-toggle="tab" type="button" role="tab" aria-controls="trending" aria-selected="true">Trending</button>
            </li>
            <li class="nav-item" role="presentation">
                <button onClick={handleSortNewest} class="nav-link" id="newest-tab" data-bs-toggle="tab" type="button" role="tab" aria-controls="newest" aria-selected="false">Newest</button>
            </li>
            </ul>
            {/* FILTER OPTION */}
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
            {/* SEARCH RESULT */}
            <div class="container mt-4">
                <div class="row">
                    {   
                        category == "charart" &&
                        searchResult.map(charart => {
                            console.log(charart)
                            return <ItemCard details={charart} />
                        })
                    }
                    {   
                        category == "char" &&
                        searchResult.map(char => {
                            console.log(char)
                            return <ItemCardChar details={char} />
                        })
                    }
                    <InView key={keyid} as="div" onChange={(inView, entry) => {
                        if (inView == true && justEntered == false) {
                            setPage(page + 1)
                        }
                        justEntered && setJustEntered(false)
                    }}>
                        <h2></h2>
                    </InView>
                    <div style={{height: "700px"}}></div>
                </div>
            </div>

        </div>
        </>
    )
}   

export default SearchResultPage