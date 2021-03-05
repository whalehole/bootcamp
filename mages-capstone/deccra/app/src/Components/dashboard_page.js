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
import firebase from './../firebase';
import { setCookie, getCookie, checkCookie } from '../cookie';
import UserItems from './userItems';
var storage = firebase.storage();
var storageRef = storage.ref();

function DashboardPage() {
    // CATEGORY
    const [category, setCategory] = useState("charart")
    // SORT TYPE
    const [sort, setSort] = useState("newest")
    // NUMBER OF CHANGES
    const [change, setChange] = useState(0)
    // USER INFO
    const [userInfo, setUserInfo] = useState({})
    // PAGE NUMBER 
    const [page, setPage] = useState(1)
    // TOTAL NUMBER OF PAGES
    const [numOfPages, setNumOfPages] = useState([])
    // PAGE CONTENT
    const [pageContent, setPageContent] = useState([])
    // CHANGED?
    const [changed, setChanged] = useState(false)

    // REFERENCED VALUES
    // SORT CHOICE
    const sortChoice = useRef()

    // METHODS
    // SET CATEGORY
    const handleCategoryCharart = event => {
        setCategory("charart")
        setChanged(false)
        setChange(change+1)
    }
    const handleCategoryChar = event => {
        setCategory("char")
        setChanged(false)
        setChange(change+1)
    }
    // SEND CHANGE
    const handleChange = event => {
        setChange(change+1)
        setChanged(false)
    }

    // COMPONENT DID UPDATE
    useEffect(()=>{
        axios.get(`http://127.0.0.1:8000/api-auth/${category}/changedetails/?order_by=${sort}&page=${page}&page_size=9`, {
            headers: {
                'Authorization': `Bearer ${getCookie("access_token")}`
            }
        })
        .then((resp)=>{
            console.log(resp.data.results)
            let pageNumbers = []
            for (let i=1; i <= Math.ceil(resp.data.count/9); i++) {
                pageNumbers.push(i)
            }
            setNumOfPages(pageNumbers)
            setPageContent(resp.data.results)
            setChanged(true)
        })
    },[change, page, sort, category])

    return (
        <>
        {console.log("PAGE: ", page)}
        {console.log("SORT BY: ", sort)}
        {console.log("TOTAL PAGES: ", numOfPages)}
        {console.log("PAGE CONTENT: ", pageContent)}
        {/* HEADER COMPONENT */}
        <HeaderContainer />
        {/* BODY CONTAINER */}
        <div className="container page-container mt-5">
            {/* DASHBOARD CONTAINER */}
            <div className="container-fluid">
                {/* TITLE */}
                <div className="row"><span style={{fontSize:"30px"}}>Dashboard</span></div>
                {/* CATEGORIES */}
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
                {/* SORT BY */}
                <div className="row mt-3 justify-content-end">
                    <select className="col-auto" aria-label="Default select example" ref={sortChoice} onChange={()=>{setChanged(false);setSort(sortChoice.current.value)}}>
                        <option value="newest" selected>Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </div>
                {/* CONTENT */}
                <div className="row mt-5">
                    {console.log(pageContent)}
                    {
                        changed &&
                        pageContent.map((content)=>{
                            return (
                                <>
                                <UserItems itemContent={content} category={category} change={handleChange}/>
                                </>
                            )
                        })
                    }
                </div>
                {/* PAGINATION */}
                <nav>
                    <ul class="pagination pagination-sm mt-5">
                        {
                            numOfPages.map((pageNum)=>{
                                return (
                                    <li class="page-item">
                                        <Link type="button" style={{backgroundColor: pageNum==page? "orange":null, color: pageNum==page? "white":"black"}} class="page-link" to={`/dashboard/${pageNum}`} onClick={()=>{setChanged(false);setPage(pageNum)}}>{pageNum}</Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </nav>
            </div>
        </div>
        </>
    )
}

export default DashboardPage