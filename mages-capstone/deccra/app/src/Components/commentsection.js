import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import Username from './username';
import { setCookie, getCookie, checkCookie } from '../cookie';
import ReplyTextArea from './replyTextArea';
import { useInView, InView } from 'react-intersection-observer';
import TextareaAutosize from 'react-textarea-autosize';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from 'react-router-dom';

function CommentSection(props) {
    // ENTRY POINT
    const [justEntered, setJustEntered] = useState(true)
    // REMOUNT KEY
    const [keyid, setKeyid] = useState(0)
    const [likeAction, setLikeAction] = useState(0)
    const [likedComments, setLikedComments] = useState()
    const [replyingTo, setReplyingto] = useState([0])
    const [comments, setComments] = useState([])
    const [page, setPage] = useState(1)
    const [userDetails, setUserDetails] = useState({})
    const [amReplying, setAmReplying] = useState(false)
    const commentInput = useRef("")

    useEffect(()=>{
        axios.get(`http://127.0.0.1:8000/api-auth/createcommentlike/?character_artid=${props.character_artid}`, {
            headers: {
                'Authorization': `Bearer ${getCookie("access_token")}`
            }
        })
        .then((resp)=>{
            setLikedComments(resp.data)
        })
    }, [likeAction])

    useEffect(()=>{
        axios.get(`http://127.0.0.1:8000/api-auth/charart/comments/?character_artid=${props.character_artid}&order_by=newest`, {
            params: {
                "page_size": "3",
                "page": `${page}`
            }
        })
        .then((resp)=>{
            setComments(comments.concat(resp.data.results))
        })
    },[page])
    useEffect(()=>{
        axios.get(`http://127.0.0.1:8000/api-auth/user/changedetails/`, {
            headers: {
                'Authorization': `Bearer ${getCookie("access_token")}`
            }
        })
        .then((resp)=>{
            setUserDetails(resp.data)
        })
    }, [])

    const handleLike = commentid => {
        axios.post('http://127.0.0.1:8000/api-auth/createcommentlike/', {
            commentid: commentid
        }, {
            headers: {
                'Authorization': `Bearer ${getCookie("access_token")}`
            }
        })
        .then(()=>{setLikeAction(likeAction+1)})
    }
    
    const handleUnlike = commentid => {
        axios.delete(`http://127.0.0.1:8000/api-auth/createcommentlike/?commentid=${commentid}`, {
            headers: {
                'Authorization': `Bearer ${getCookie("access_token")}`
            }
        })
        .then(()=>{setLikeAction(likeAction+1)})
    }
    
    const handleOnBlur = event => {
        setReplyingto([0])
    }

    const handleSubmitComment = event => {
        axios.post(`http://127.0.0.1:8000/api-auth/createcomment/`, {
            comment: commentInput.current.value,
            character_artid: props.character_artid
        }, {
            headers: {
                'Authorization': `Bearer ${getCookie("access_token")}`
            }
        })
        .then(()=>{
            commentInput.current.value = ""
            setAmReplying(false)
        })
    }

    return (
        <>
        {console.log(comments)}
        {console.log("looping")}
        <div className="col">
            <p className="p-0 m-0" style={{textDecoration: "none", color: "rgb(78, 78, 78)", padding: "10px", paddingTop:"0px", display:"block",fontSize:"16px"}}>Comments</p>
        </div>
        <div class="w-100"></div>
        <div className="col mt-3">
            <ul style={{listStyleType: "none"}}>
                {
                    userDetails.id ?
                    <li>
                        <div className="col-9">
                            <p style={{textDecoration: "none", color: "gray", padding: "10px", paddingTop:"0px", display:"block",fontSize:"13px", padding: "0px"}}>{userDetails.username}</p>
                            <TextareaAutosize placeholder="comment here..." ref={commentInput} onFocus={()=>{setAmReplying(true)}} onBlur={()=>{if (!commentInput.current.value) {setAmReplying(false)}}} className={`form-control commentReplyBox ${amReplying ? "border-bottom border-warning border-2" : null }`} style={{width: "100%", overflow: "hidden", resize: "none", border: "none", padding: "0px", marginBottom: "16px"}}/>
                            <div className="d-flex justify-content-end">
                                {   
                                    amReplying ? 
                                    <>
                                    <button class="btn" onClick={()=>{setAmReplying(false)}}>Cancel</button>
                                    <button class="btn btn-warning" onClick={handleSubmitComment}>Submit</button>
                                    </>
                                    :
                                    null
                                }

                            </div>
                        </div>
                    </li>
                    :
                    <p><Link to="/signin">Sign in</Link> or <Link to="/register">Register</Link> to view comments.</p>
                }
                {   
                    comments && userDetails.id &&
                    comments.map((comment)=>{
                        console.log(comment)
                        return (
                            <>
                            {console.log(userDetails)}
                            <li className="mb-4" key={comment.commentid} style={{minHeight: "50px"}}>
                                <Username userid={comment.userid} comment={comment} />
                                <div className="row">
                                    <div className="col-9" style={{fontSize: "15px"}}>
                                        <p style={{marginBottom: "0px"}}>{comment.comment}</p>
                                    </div>
                                    <div className="col-3">
                                        <div className="d-flex flex-column">
                                            <div className="d-flex flex-row-reverse mb-2">
                                                <div>
                                                    {likedComments && likedComments.some((element)=>element.commentid_id === comment.commentid) ? <img onClick={()=> handleUnlike(comment.commentid)} type="button" style ={{height: "27px", width: "27px"}} src="https://img.icons8.com/dusk/64/000000/facebook-like.png"/> : <img onClick={()=> handleLike(comment.commentid)} type="button" style ={{height: "27px", width: "27px", opacity: "0.2"}} src="https://img.icons8.com/wired/64/000000/facebook-like.png"/>}
                                                </div>
                                                <div style={{marginRight: "10px"}}>
                                                    {replyingTo[0] == comment.commentid ? <img onClick={handleOnBlur} type="button" style ={{height: "27px", width: "27px", opacity: "0.2"}} src="https://img.icons8.com/ios-filled/50/000000/left2.png"/> : <img onClick={()=> {setReplyingto([comment.commentid])}} type="button" style ={{height: "27px", width: "27px", opacity: "0.2"}} src="https://img.icons8.com/ios/50/000000/left2.png"/>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <ReplyTextArea replyingNow={replyingTo[0]} commentid={comment.commentid} handleOnBlur={handleOnBlur} />
                            </li>
                            </>
                        )
                    })
                }
            </ul>
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
        </>
    )
}

export default CommentSection 