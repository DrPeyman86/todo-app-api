const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc';

//number of rounds you want to create the salt
//the bigger the number, the longer it will take 
//some even go up to 120 rounds, so people can't bruteforce the value
//it would take a long time. for passwords this would be a good idea
//even though it makes things slower. 
bcrypt.genSalt(10, (err,salt) => {
    //.hash() the password. 
    //the salt comes from the function above where it takes 10 rounds to create some salt value
    bcrypt.hash(password, salt, (err, hash)=>{
        console.log(hash);//this hash value is what you want to store in the database
    })
})


//below illustrates how you would use that hash value stored in database
//to the user that is attempting to login to verify their password
var hashedPassword = '$2a$10$oeQLRLBmRcYIAZLBvs.gBOLdUx1pDqBuiZxNP3aQCorY6jPJu3cKe'

bcrypt.compare(password, hashedPassword, (err, res)=>{
    console.log(res);
})