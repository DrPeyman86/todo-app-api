const jwt = require('jsonwebtoken')

//jwt library provides 2 methods, one to

//jwt.sign      //takes the data id and returns it as the hash
//jwt.verify    //takes the hash value and makes sure it was not manipulated. 

var data = {
    id: 10
}

var token = jwt.sign(data, "123Peymy")//sign will return the hashed token, so need to store it in variable to verify() it
console.log(token);

//if anything after above code and before the below code is altered, the tokens will not match and will say invalid signature. 
var decoded = jwt.verify(token, "123Peymy");//test invalid signautre by concantenating something after token + "1" for example
console.log(decoded)
