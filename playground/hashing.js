const {SHA256} = require('crypto-js')//to grab a certain property from the return result of the return, make it as an object.

var message = 'I am user number 4'
var hash = SHA256(message).toString();//hashing is a one way method. 

console.log(`message: ${message}`)
console.log(`message: ${hash}`)

//validating the user to make sure they are the valid user of a certain object they want to update/delete, so that other users can't delete other user data
var data = {
    id: 4//the id would equal the Users.ID in the Users table/collection
}
//the above has a flaw because on client side, user could change the ID to something else, send it back to the server with whatever they want to request, and delete/update other users.
//to prevent this
//need to create a new variable token, which will send to the user client
var token = {
    data,
    hash: SHA256(JSON.stringify(data)).toString()
}
//the above code hashes the user ID from client to send back to server. Although not bullet proof. The user could change the data attribute still to whatever, re-hash that
//and then send the token back to server and still be able to make any request they want. 
//to prevent that, we do SALT or SALTING the Hash. Salt means you add something to the HASH value with some secret phrase, you will never get the same HASH result everytime. 
//SALT the hash
var tokenSalt = {
    data,
    hash: SHA256(JSON.stringify(data) + "secretMessage").toString()
}

//to demonstrate what a hacker may do. where they change the client values and send to server
tokenSalt.data.id = 5;//let's say user ID 4 is mad at user ID 5, and wants to delete all their data. So user 4 would go into client and change these values
tokenSalt.hash = SHA256(JSON.stringify(tokenSalt.data)).toString()//here they do not have the secretMessage stored on the server. So it will never match even if it was re-hashed.

//this is what the result of the hash will be back from the server for you to validate on the backend code before you send anything to client. 
var resultHash = SHA256(JSON.stringify(tokenSalt.data) + "secretMessage").toString();

//if the resultHash is exactly the same as the token.hash, we know the data was not changed
if(resultHash === tokenSalt.hash) {
    console.log("Data was not changed")
} else {
    console.log("Data was change, do not trust");
}


//JSON Web Token is the concept of the above