var mongoose = require('mongoose');


var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var user = mongoose.model('users', {
    name: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
        validate: [validateEmail, "Please fill valid email address"]
    },
    password: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    }
})


module.exports = {user}//ES6 format, when the property name and value are same, you can just have one