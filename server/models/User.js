var mongoose = require('mongoose');


var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var User = mongoose.model('User', {
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
        trim: true
        //validate: [validateEmail, "Please fill valid email address"]
     }//,
    // password: {
    //     type: String,
    //     required: true,
    //     minLength: 1,
    //     trim: true
    // }
})


module.exports = {User}//ES6 format, when the property name and value are same, you can just have one