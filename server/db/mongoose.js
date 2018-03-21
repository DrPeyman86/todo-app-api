var mongoose = require('mongoose')

//tell mongoose which Promise library you want to use.
//mongoose supports regular callbacks, but promises are simpliar and cleaner
mongoose.Promise = global.Promise;//use global.Promise for the mongoose
mongoose.connect('mongodb://localhost:27017/TodoApp');


module.exports = {
    mongoose: mongoose
}