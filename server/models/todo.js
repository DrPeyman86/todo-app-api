var mongoose = require('mongoose');

//create model
//a model tells mongoose what each collection should have as it's fields
//since in mongoDB not every document has the same fields as the other documents. 
//models force mongoose to always have the same fields whenever something is inserted
var Todo = mongoose.model('todos', {
    text: {
        type: String ,
        required: true,
        minLength: 1,//the number of characters
        trim: true//it will remove spaces from pre and post string.
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});


module.exports = {Todo}