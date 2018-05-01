var mongoose = require('mongoose')

//var dbUrl = 'mongodb://peymanc:kristenhp!2@ds125469.mlab.com:25469/todo-app'
//mongodb://<dbuser>:<dbpassword>@ds125469.mlab.com:25469/todo-app
//tell mongoose which Promise library you want to use.
//mongoose supports regular callbacks, but promises are simpliar and cleaner
mongoose.Promise = global.Promise;//use global.Promise for the mongoose
mongoose.connect(process.env.MONGODB_URI)// || 'mongodb://localhost:27017/TodoApp');//if the MONGODBO_URI exists in the process env use that as the databse, otherwise, use local

//prcess.env.NODE_ENV === 'production'//heroku sets this value to 'production' environment by default. But you also have a 'development' and a 'test' environment also.

module.exports = {
    mongoose: mongoose
}