import TextareaAutosize from 'react-textarea-autosize';
import {useState, useRef, useEffect} from 'react';
import axios from 'axios';
import { setCookie, getCookie, checkCookie } from '../cookie';
import JustUsername from './justUsername';

function ReplyTextArea(props) {
    const textInput = useRef("")
    const [replied, setReplied] = useState(false)
    const [replies, setReplies] = useState([])
    const [page, setPage] = useState(0)
    const [endOfPage, setEndOfPage] = useState(false)
    const [repliesCount, setRepliesCount] = useState(0)
    // const [replying, setReplying] = useState(true)

    useEffect(()=>{
        axios.get(`http://127.0.0.1:8000/api-auth/charart/comments/responses?commentid=${props.commentid}&order_by=newest`, {
            params: {
                "page_size": "2",
                "page": `${page}`
            }
        })
        .then((resp)=>{
            setReplies(replies.concat(resp.data.results))
            if (resp.data.next == null) {
                setEndOfPage(true)
            }
        })
    }, [page])

    useEffect(()=>{
            axios.get(`http://127.0.0.1:8000/api-auth/commentcount/?commentid=${props.commentid}&type=counts`)
            .then((count)=>{
                setRepliesCount(count.data.response_count)
            })
    })

    const handleSubmit = event => {
        axios.post(`http://127.0.0.1:8000/api-auth/createcommentresponse/`, {
            comment: textInput.current.value,
            commentid: props.replyingNow
        }, {
            headers: {
                'Authorization': `Bearer ${getCookie("access_token")}`
            }
        })
        .then(()=>{
            textInput.current.value = null
            props.handleOnBlur()
        })
    }

    const handleBlur = event => {
        if (!textInput.current.value) {
            props.handleOnBlur()
        }

    }
    return (
        <>
        {console.log("loopiung")}
        {
            page == 0 ? 
            <div className="row">
                {
                    repliesCount > 0 ?
                    <p type="button" onClick={()=>{setPage(page+1)}} className="col-auto mt-2" style={{fontSize: "13px", color: "orange"}}>
                        view replies ({repliesCount})
                    </p>
                    :
                    null
                }

            </div> 
            : null
        }
        {props.replyingNow == props.commentid ? 
            <div className="row">
                <div className="form-floating mt-2 col-9" style={{paddingLeft: "30px"}}>
                    <TextareaAutosize ref={textInput} autoFocus onBlur={handleBlur} class="form-control commentReplyBox border-bottom border-warning border-1" style={{overflow: "hidden", resize: "none", border: "none"}}/>
                    <label className="pt-2" style={{paddingLeft: "30px", fontSize: "14px"}}>type your reply here</label>
                </div>
                <div className="mt-2 col-9 d-flex justify-content-end">
                    <button class="btn" onClick={props.handleOnBlur}>Cancel</button>
                    <button class="btn btn-warning" onClick={handleSubmit}>Submit</button>
                </div>
            </div> : null
        }
        {
            replies &&
            replies.map((reply)=>{
                return (
                <div className="row">
                    <div className="form-floating mt-2 col-9" style={{paddingLeft: "80px"}}>
                        <JustUsername userid={reply.userid} />
                        <div className="col-9" style={{fontSize: "13px"}}>
                            <p style={{marginBottom: "0px"}}>{reply.comment}</p>
                        </div>
                    </div>
                </div>
                )
            })
        }
        {
            page >= 1 && !endOfPage ? 
            <div className="row">
                <p type="button" onClick={()=>{setPage(page+1)}} className="col-auto mt-2" style={{fontSize: "13px", color: "orange"}}>view more replies</p>
            </div> 
            : 
            null
        }
        </>
    )
}

export default ReplyTextArea