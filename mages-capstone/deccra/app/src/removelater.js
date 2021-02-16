import axios from 'axios';
import React from 'react';

function Example() {
    axios.post('http://127.0.0.1:8000/signup/', {
        "email": "user1@gmail.com",
        "password": "Iamnotadmin!9"
    }).then(response => console.log(response.data)).catch(error => console.log(error));
    return (
        <div>component loaded</div>
    )
}

export default Example;

//! create user, as unauthenticated, ['email', 'username', 'password', 'country]

//! user edit self details, user delete self user as authenticated user ['email', 'username', 'country', 'self_introduction', 'date_of_birth', 'language']

//! user edit self password, as authenticated user ['old_password', 'new_password']

//! user create self character, as authenticated user

//! user get self character details, edit self character details, user delete self character, as authenticated user

//! user edit self character art details, user self create character art, user self delete character art, as authenticated user

//! user edit self comment, user create self comment, user delete self comment, as authenticated user

//! user get self character like, user create self character like, user delete self character like, as authenticated user

//! user get self character follow, user create self character follow, user delete self character follow, as authenticated user

//! user get self character tags, user create self character tags, user delete self character tags, as authenticated user

//! user get self character art like, user create self character art like, user delete self character art like, as authenticated user

//! user get self comment like, user create self comment like, user delete self comment like, as authenticated user

//! user get self user follow, user create self user follow, user delete self user follow, as authenticated user

//! user get self character art bookmark, user create self character art bookmark, user delete self character bookmarks, as authenticated user

//! any user get users, as unauthenticated user [userid]

//! any user get specific users, as unauthenticated user

//! any user get characters, as unauthenticated user

//! any user get specific characters, as unauthenticated user

//! any user get character art, as unauthenticated user

//! any user get specific character art, as unauthenticated user

//! any user get comments, as unauthenticated user

//! any user get one comment, as unauthenticated user

//! any user get 1 parent character art of a character art, as unauthenticated user

//! any user get child character art(s) of a character art, as unauthenticated user

//! any user get child character art(s) of a character, as unauthenticated user

//! any user get what character likes, as unauthenticated user

//! any user get what character hates, as unauthenticated user

//! any user get tags of character, as unauthenticated user

//! any user get bookmarks of users, as unauthenticated user

//! any user get following & followers of user-user, as unauthenticated user

//! any user get following of user-char, as unauthenticated user

//! any user get # of users liking character, as unauthenticated user

//! any user get # of users following character, as unauthenticated user

//! any user get # of users liking character art, as unauthenticated user

//! any user get # of child character art of character, as unauthenticated user

//! any user get # page views of character, as unauthenticated user

//! any user get # page views of character art, as unauthenticated user

//! any user edit # page views of character, as unauthenticated user

//! any user edit # page views of character art, as unauthenticated user



