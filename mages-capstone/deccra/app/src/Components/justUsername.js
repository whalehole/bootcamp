import axios from 'axios'; 
import { useState } from 'react';
import { useQuery } from 'react-query';

function JustUsername(props) {
    const { isLoading, isError, data:username, error } = useQuery('username', ()=>{
        return axios.get(`http://127.0.0.1:8000/api-auth/userdetails/?userid=${props.userid}`)
    })

    if (isLoading) {
        return <span>Loading...</span>
      }
    
    if (isError) {
        return <span>Error: {error.message}</span>
    }

    return (
        <>
        <div className="row">
            <div className="col">
                <p style={{textDecoration: "none", color: "gray", padding: "10px", paddingTop:"0px", display:"block",fontSize:"13px", padding: "0px"}}>{username.data.username}</p>
            </div>
        </div>
        </>
    )
}

export default JustUsername