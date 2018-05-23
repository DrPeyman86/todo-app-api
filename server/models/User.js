const mongoose = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken')


var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

// {
//     email: 'peymanc@hotmail.com',
//     password: 'mypass123',//this will be a hash value, which will be a one way value, meaning you can hash a value, but you can never un-hash a value, so one way
//     //tokens will be stored as an array of objects, which each object is a login, meaning if you login on different devices will have different authentication tokens. 
//     tokens: [{
//         access: 'auth',//this is the access type of the token.
//         token: 'sdfsfasdfasdfasdfasdfsa'//this is the token assigned to the user once they are logged in on whatever device. It is also a hash value. 
//         //the token will be included everytime with the HTTP request to make sure the user has access to do whatever they want in the database
//     }]
// }

var UserSchema = new mongoose.Schema({
    // name: {
    //     type: String,
    //     required: true,
    //     minLength: 1,
    //     trim: true
    // },
    email: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
        unique: true,//this makes sure the email is unique for every user. Meaning there can't be several users with the same email
        //validate: [validateEmail, "Please fill valid email address"]
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email'
        }
        //you could also do validator like below to make it shorter
        // validate: {
        //     validator: validator.isEmail,
        //     message: '{VALUE} is not valid email'
        // }
     },//,
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
    //tokens may not be available in SQL database like postgress and maybe Oracle?????
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }        
    }]
})//store schema for a User

//it is an object -- these are instance methods -- instace methods are available to access individual document properties
//because we need that information to create the JWT
//this is a custom function we created to call through the app
//which just adds a token property to that array that gets sent to db
UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user.id.toHexString(), access: access},'123Pemy').toString()
    //add to the user array the token property 
    user.tokens = user.tokens.concat({access, token})
    console.log('here1111')
    //save the user inside the database
    // the return will allow other files to use the return value 
    //of this .then() promise which would include the token we could use
    return user.save().then(()=> {
        return token
    })
        
}

var User = mongoose.model('User', UserSchema)


module.exports = {User}//ES6 format, when the property name and value are same, you can just have one