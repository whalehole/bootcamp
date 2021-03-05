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
    Redirect,
    NavLink
  } from 'react-router-dom';
import { setCookie, getCookie, checkCookie } from '../cookie';
import HeaderContainer from './header';
import firebase from './../firebase';
import axios from 'axios';

var storage = firebase.storage();
var storageRef = storage.ref();

class SubmissionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {tags: [], chartags: [], submitted: false, fileInputSubmitted: 0, charImageFileInputSubmitted: 0, charProfileImageFileInputSubmitted: 0};
        this.tagInput = React.createRef();
        this.fileInput = React.createRef();
        this.titleInput = React.createRef();
        this.captionInput = React.createRef();
        this.genderInput = React.createRef();
        this.speciesInput = React.createRef();
        this.backgroundInput = React.createRef();
        this.dialogueInput = React.createRef();
        this.loader = React.createRef();
        this.submitButton = React.createRef();
        this.charTagInput = React.createRef();
        this.charImgFileInput = React.createRef();
        this.charProfileImageFileInput = React.createRef();
        this.charAvatarPicFileInput = React.createRef();
        this.charNameInput = React.createRef();
        this.charNicknameInput = React.createRef();
        this.charGenderInput = React.createRef();
        this.charSpeciesInput = React.createRef();
        this.charBackgroundInput = React.createRef();
        this.charDialogueInput = React.createRef();
    }
    
    handleOnChange0 = event => {
        URL.revokeObjectURL(this.fileInput.current.files[0])
        this.setState({fileInputSubmitted: this.state.fileInputSubmitted+1})
   }
   
    handleOnChange = file => {
        URL.revokeObjectURL(this.charImgFileInput.current.files[0])
        this.setState({charImageFileInputSubmitted: this.state.charImageFileInputSubmitted+1})
    }

    handleOnChange2 = event => {
        URL.revokeObjectURL(this.charProfileImageFileInput.current.files[0])
        this.setState({charProfileImageFileInputSubmitted: this.state.charProfileImageFileInputSubmitted+1})
    }

    componentDidUpdate() {
        console.log('looping')
    }

    handleChange = event => {
        this.speciesInput.current.style.textTransform = "capitalize"
    }

    handleChange2 = event => {
        this.charSpeciesInput.current.style.textTransform = "capitalize"
    }
    
    handleClick = event => {
        event.preventDefault();
        console.log(this.fileInput.current.files[0])
        // submission validation
        if (this.fileInput.current.files.length !== 0) {
            this.submitButton.current.style.display = "none"
            this.loader.current.style.display = "block"
            axios.post('http://127.0.0.1:8000/api-auth/createcharart/', {
                title: this.titleInput.current.value,
                caption: this.captionInput.current.value,
                genderid: this.genderInput.current.value,
                character_species: this.speciesInput.current.value,
                // character_background: this.backgroundInput.current.value,
                // character_dialogue: this.dialogueInput.current.value,
                character_art_tag: this.state.tags.toString(),
            }, {
                headers: {
                    'Authorization': `Bearer ${getCookie("access_token")}`
                }
            })
            .then((resp)=>{
                for (let tag in this.state.tags) {
                    axios.post('http://127.0.0.1:8000/api-auth/createchararttags/', {
                        character_artid: resp.data.id,
                        tag: this.state.tags[tag],
                    }, {
                        headers: {
                            'Authorization': `Bearer ${getCookie("access_token")}`
                        }
                    })
                }
                var imageRef = storageRef.child(`charart/${resp.data.id}`);
                imageRef.put(this.fileInput.current.files[0])
                .then((snapshot)=>{
                    console.log(snapshot)
                })
                .then(()=>{
                    this.setState({submitted: true})
                })
                .catch(error=>{console.log("error")})
            })
        }
    }

    // handleClick2 = event => {
    //     event.preventDefault();
    //     console.log(this.charNameInput.current.value)
    //     console.log(this.charImgFileInput.current.files[0])
    //     // submission validation
    //     if (this.charImgFileInput.current.files.length !== 0) {
    //         this.submitButton.current.style.display = "none"
    //         this.loader.current.style.display = "block"
    //         axios.post('http://127.0.0.1:8000/api-auth/createchar/', {
    //             character_name: this.charNameInput.current.value,
    //             character_nickname: this.charNicknameInput.current.value,
    //             genderid: this.charGenderInput.current.value,
    //             character_species: this.charSpeciesInput.current.value,
    //             character_background: this.charBackgroundInput.current.value,
    //             character_dialogue: this.charDialogueInput.current.value,
    //             character_tag: this.state.chartags.toString(),
    //         }, {
    //             headers: {
    //                 'Authorization': `Bearer ${getCookie("access_token")}`
    //             }
    //         })
    //         .then((resp)=>{
    //             for (let tag in this.state.chartags) {
    //                 axios.post('http://127.0.0.1:8000/api-auth/createchartags/', {
    //                     characterid: resp.data.characterid,
    //                     tag: this.state.chartags[tag],
    //                 }, {
    //                     headers: {
    //                         'Authorization': `Bearer ${getCookie("access_token")}`
    //                     }
    //                 })
    //             }
    //             var imageRef = storageRef.child(`char_profile_illust/${resp.data.characterid}`);
    //             imageRef.put(this.charImgFileInput.current.files[0])
    //             .then((snapshot)=>{
    //                 console.log(snapshot)
    //             })
    //             .then(()=>{
    //             var imageRef = storageRef.child(`char_avatar_image/${resp.data.characterid}`);
    //             imageRef.put(this.charProfileImageFileInput.current.files[0])
    //             })
    //             .then((snapshot)=>{
    //                 console.log(snapshot)
    //             })
    //             .then(()=>{
    //                 this.setState({submitted: true})
    //             })
    //             .catch(error=>{console.log("error")})
    //         })
    //     }
    // }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            let tags = this.state.tags
            if (tags.indexOf(this.tagInput.current.value) === -1) {
                tags.push(this.tagInput.current.value)
                this.tagInput.current.value = ""
                this.setState({tags: tags})
            }
        }
    }

    handleKeyPress2 = (e) => {
        if (e.key === 'Enter') {
            let tags = this.state.chartags
            if (tags.indexOf(this.charTagInput.current.value) === -1) {
                tags.push(this.charTagInput.current.value)
                this.charTagInput.current.value = ""
                this.setState({chartags: tags})
            }
        }
    }

    handleDelete = (e) => {
        let tags = this.state.tags
        let index = tags.indexOf(e.currentTarget.innerHTML)
        tags.splice(index, index+1)
        console.log(tags)
        this.setState({tags: tags})
    }

    handleDelete2 = (e) => {
        let tags = this.state.chartags
        let index = tags.indexOf(e.currentTarget.innerHTML)
        tags.splice(index, index+1)
        console.log(tags)
        this.setState({chartags: tags})
    }
    render() {
        return (
            <Route path="/submit">
                {this.state.submitted ? <Redirect to="/" /> : null}
                {getCookie("access_token") ? 
                <>
                <HeaderContainer />
                <div className="container mt-5">
                    {/* nav */}
                    <nav class="navbar navbar-expand-lg">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0 mx-auto">
                            <li class="nav-item">
                                <div>
                                    <NavLink aria-current="page" href="/submit" exact to="/submit" style={{textDecoration: "none", color: "gray", padding: "10px", paddingTop:"0px", display:"block",fontSize:"12px"}} activeStyle={{color: "orange", textDecoration: "none"}}>
                                        <img style={{marginLeft:"auto",marginRight:"auto",display:"block", width: "48px", height: "48"}} src="https://img.icons8.com/cotton/64/000000/image--v2.png"/>
                                        Character art
                                    </NavLink>
                                </div>
                            </li>
                            {/* <li class="nav-item">
                                <div>
                                    <NavLink href="/submit/char" to="/submit/char" style={{textDecoration: "none", color: "gray", padding: "10px", paddingTop:"0px", display:"block",fontSize:"12px"}} activeStyle={{color: "orange", textDecoration: "none"}}>
                                        <img style={{marginLeft:"auto",marginRight:"auto",display:"block"}} src="https://img.icons8.com/color/48/000000/gender-neutral-user.png"/>
                                        Character
                                    </NavLink>
                                </div>
                            </li> */}
                        </ul>
                    </nav>
                    {/* form */}
                    <Route exact path="/submit">
                        <div className="container mt-5 container-medium">
                            <div class="row g-3">
                                <div className="row">
                                    <div className="d-flex">
                                        <div className="row">
                                            <div className="col d-flex justify-content-center align-items-center">
                                                {
                                                    !this.state.fileInputSubmitted ?
                                                    <div className="border border-warning d-flex justify-content-center" style={{height:"300px",width:"300px"}}>
                                                        <label className="align-self-center rounded-pill border border-warning p-2" type="button" style={{}} for="submitFileInput">Upload character art</label> 
                                                    </div>
                                                    : 
                                                    null
                                                }
                                                {
                                                    this.state.fileInputSubmitted && !this.state.submitted ? 
                                                    <div className="border border-warning d-flex justify-content-center" style={{height:"300px",width:"300px"}}>
                                                        <label type="button" style={{height: "100%", width:"100%"}} for="submitFileInput">
                                                            <img style={{width: "100%", height:"100%", objectFit:"contain"}} src={window.URL.createObjectURL(this.fileInput.current.files[0])}/>
                                                        </label>
                                                    </div>
                                                    : null
                                                }
                                                <div>
                                                    <input ref={this.fileInput} onChange={this.handleOnChange0} class="form-control form-control-sm" id="submitFileInput" type="file" style={{display: "none"}}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3  mt-5 row">
                                    <div class="col-sm-5">
                                        <label for="submitCharartTitleInput" class="col-sm-1 col-form-label">Title</label>
                                        <input type="text" class="form-control" id="submitCharartTitleInput" ref={this.titleInput}/>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <div class="col-sm-5">
                                        <label for="submitCharartCaptionInput" class="col-sm-1 col-form-label">Caption</label>
                                        <textarea class="form-control" id="submitCharartCaptionInput" ref={this.captionInput}></textarea>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <div class="col-sm-5">
                                        <label for="submitCharartGenderInput" class="col-sm-1 col-form-label">Gender</label>
                                        <select class="form-select" aria-label="Default select example" id="submitCharartGenderInput" ref={this.genderInput}>
                                            <option selected disabled value="">Choose</option>
                                            <option value="1">Male</option>
                                            <option value="2">Female</option>
                                            <option value="3">Both</option>
                                            <option value="4">None</option>
                                            <option value="5">Unknown</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <div class="col-sm-5">
                                        <label for="submitCharartSpeciesInput" class="col-sm-1 col-form-label">Species</label>
                                        <input type="text" class="form-control" id="submitCharartSpeciesInput" ref={this.speciesInput} onChange={this.handleChange}/>
                                    </div>
                                </div>
                                {/* <div class="mb-3 row">
                                    <div class="col-sm-12">
                                        <label for="submitCharartBackgroundInput" class="col-sm-1 col-form-label">Background</label>
                                        <textarea style={{height:"100px"}} class="form-control" id="submitCharartBackgroundInput" ref={this.backgroundInput}></textarea>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <div class="col-sm-12">
                                        <label for="submitCharartDialogueInput" class="col-sm-1 col-form-label">Dialogue</label>
                                        <textarea class="form-control" id="submitCharartDialogueInput" ref={this.dialogueInput}></textarea>
                                    </div>
                                </div> */}
                                <div class="mb-1 row">
                                    <div class="col-sm-5">
                                        <label for="submitCharartTagsInput" class="col-sm-1 col-form-label">Tags</label>
                                        <input type="text" class="form-control" id="submitCharartTagsInput"  ref={this.tagInput} onKeyPress={this.handleKeyPress}/>
                                    </div>
                                </div>
                                <div class="row mb-5">
                                        {this.state.tags.map((tag) => {
                                            return (
                                                <div key={tag} class="col-auto" onClick={this.handleDelete}>{tag}</div>
                                            )
                                        })}
                                </div>
                                {/* <div class="col-12 mt-0">
                                    <Link to="/resetpw" class="font-size-small font-color-gray"><small>forgot your password?</small></Link>
                                </div> */}
                                <div class="col-12 mt-5 d-flex justify-content-end">
                                    <button onClick={this.handleClick} ref={this.submitButton} class="btn btn-warning">Submit</button>
                                    <div class="disappear" style={{width: "76px"}} ref={this.loader}><div class="loader mx-auto"></div></div>
                                </div>
                            </div>
                        </div>
                    </Route>
                    <Route path="/nowhere">
                    <div className="container mt-5 container-medium">
                            <div class="row g-3">
                                <div className="row">
                                    <div className="d-flex">
                                        <div className="row">
                                            <div className="col d-flex justify-content-center align-items-center" style={{aspectRatio:"3/2"}}>
                                                {!this.state.charImageFileInputSubmitted ? <label type="button" style={{height: "73px", width:"73px"}} for="submitCharImageInput" class="col-sm-1 col-form-label"><img style={{width: "100%", opacity:"0.6"}} src={"/imageicon.svg"} /></label> : null}
                                                {this.state.charImageFileInputSubmitted && !this.state.submitted ? <label type="button" style={{height: "100%", width:"100%"}} for="submitCharImageInput" class="col-sm-1 col-form-label"><img className="border border-warning" style={{width: "100%", height:"100%", objectFit:"contain"}} src={window.URL.createObjectURL(this.charImgFileInput.current.files[0])}/></label> : null}
                                                <div>
                                                    <input ref={this.charImgFileInput} onChange={this.handleOnChange} class="form-control form-control-sm" id="submitCharImageInput" type="file" style={{display: "none"}}/>
                                                </div>
                                            </div>
                                            <div className="col d-flex justify-content-center align-items-center" style={{aspectRatio:"1/1"}}>
                                                {!this.state.charProfileImageFileInputSubmitted ? <label type="button" style={{height: "73px", width:"73px"}} for="submitCharProfileImageInput" class="col-sm-1 col-form-label"><img style={{width: "100%", opacity:"0.6"}} src={"/avataricon.png"} /></label> : null}
                                                {this.state.charProfileImageFileInputSubmitted && !this.state.submitted ? <label type="button" style={{height: "70%", width:"70%"}} for="submitCharProfileImageInput" class="col-sm-1 col-form-label"><img className="border border-warning rounded-circle" style={{width: "100%", height:"100%", objectFit:"cover"}} src={window.URL.createObjectURL(this.charProfileImageFileInput.current.files[0])}/></label> : null}
                                                <div>
                                                    <input ref={this.charProfileImageFileInput} onChange={this.handleOnChange2} class="form-control form-control-sm" id="submitCharProfileImageInput" type="file" style={{display: "none"}}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3 row mt-5">          
                                    <div class="col-sm-5">
                                        <label for="submitCharNameInput" class="col-sm-1 col-form-label">Name</label>
                                        <input type="text" class="form-control" id="submitCharNameInput" ref={this.charNameInput}/>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <div class="col-sm-5">
                                        <label for="submitCharNicknameInput" class="col-sm-1 col-form-label">Nickname</label>
                                        <input type="text" class="form-control" id="submitCharNicknameInput" ref={this.charNicknameInput}></input>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <div class="col-sm-5">
                                        <label for="submitCharGenderInput" class="col-sm-1 col-form-label">Gender</label>
                                        <select class="form-select" aria-label="Default select example" id="submitCharGenderInput" ref={this.charGenderInput}>
                                            <option selected disabled value="">Choose</option>
                                            <option value="1">Male</option>
                                            <option value="2">Female</option>
                                            <option value="3">Both</option>
                                            <option value="4">None</option>
                                            <option value="5">Unknown</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <div class="col-sm-5">
                                        <label for="submitCharSpeciesInput" class="col-sm-1 col-form-label">Species</label>
                                        <input type="text" class="form-control" id="submitCharSpeciesInput" ref={this.charSpeciesInput} onChange={this.handleChange2}/>
                                    </div>
                                </div>
                                {/* <div class="mb-3 row">
                                    <div class="col-sm-12">
                                    <label for="submitCharBackgroundInput" class="col-sm-1 col-form-label">Background</label>
                                        <textarea class="form-control"  style={{height:"100px"}} id="submitCharBackgroundInput" ref={this.charBackgroundInput}></textarea>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <div class="col-sm-12">
                                        <label for="submitCharDialogueInput" class="col-sm-1 col-form-label">Dialogue</label>
                                        <textarea class="form-control" id="submitCharDialogueInput" ref={this.charDialogueInput}></textarea>
                                    </div>
                                </div> */}
                                <div class="mb-1 row">
                                    <div class="col-sm-5">
                                        <label for="submitCharTagsInput" class="col-sm-1 col-form-label">Tags</label>
                                        <input type="text" class="form-control" id="submitCharTagsInput"  ref={this.charTagInput} onKeyPress={this.handleKeyPress2}/>
                                    </div>
                                </div>
                                <div class="row mb-5">
                                        {this.state.chartags.map((tag) => {
                                            return (
                                                <div key={tag} class="col-auto" onClick={this.handleDelete2}>{tag}</div>
                                            )
                                        })}
                                </div>
                                {/* <div class="col-12 mt-0">
                                    <Link to="/resetpw" class="font-size-small font-color-gray"><small>forgot your password?</small></Link>
                                </div> */}
                                <div class="col-12 mt-5 d-flex justify-content-end">
                                    <button onClick={this.handleClick2} ref={this.submitButton} class="btn btn-warning">Submit</button>
                                    <div class="disappear" style={{width: "76px"}} ref={this.loader}><div class="loader mx-auto"></div></div>
                                </div>
                            </div>
                        </div>
                    </Route>
                </div>
                </> :
                <>
                <Redirect to="/" />
                </>
                }
            </Route>
        )
    }
}

export default SubmissionPage