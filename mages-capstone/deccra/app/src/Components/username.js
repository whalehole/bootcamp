import axios from 'axios'; 
import { useState } from 'react';
import { useQuery } from 'react-query';
var formatDistanceToNow = require('date-fns/formatDistanceToNow')

function Username(props) {
    const { isLoading, isError, data:username, error } = useQuery(`username${props.userid}`, ()=>{
        return axios.get(`http://127.0.0.1:8000/api-auth/userdetails/?userid=${props.userid}`)
    })
    const { isLoading:commentCountIsLoading, isError:commentCountIsError, data:commentCount, error:commentCountError } = useQuery(`commentCount${props.comment.commentid}`, ()=>{
        return axios.get(`http://127.0.0.1:8000/api-auth/commentcount/?commentid=${props.comment.commentid}&type=counts`)
    })

    if (isLoading || commentCountIsLoading) {
        return <span>Loading...</span>
      }
    
    if (isError || commentCountIsError) {
        return <span>Error: {error.message}</span>
    }

    return (
        <>
        <div className="row">
            <div className="col">
                <p style={{textDecoration: "none", color: "gray", padding: "10px", paddingTop:"0px", display:"block",fontSize:"13px", padding: "0px"}}>{username.data.username}</p>
            </div>
            <div className="col">
                <div className="d-flex flex-row-reverse">
                    <div><p style={{textDecoration: "none", color: "rgb(167, 167, 167)", padding: "10px", paddingTop:"0px", display:"block",fontSize:"12px", padding: "0px", textAlign: "end"}}>posted {formatDistanceToNow(new Date(props.comment.date_created))} ago</p></div>
                    <div style={{marginRight: "10px"}}><p style={{textDecoration: "none", color: "rgb(167, 167, 167)", padding: "10px", paddingTop:"0px", display:"block",fontSize:"12px", padding: "0px", textAlign: "end"}}>{commentCount.data.like_count} likes</p></div>
                    <div style={{marginRight: "10px"}}><p style={{textDecoration: "none", color: "rgb(167, 167, 167)", padding: "10px", paddingTop:"0px", display:"block",fontSize:"12px", padding: "0px", textAlign: "end"}}>{commentCount.data.response_count} replies</p></div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Username