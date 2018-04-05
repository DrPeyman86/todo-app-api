const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/User')//watch case sensitive. the variable here has to be exactly
//what the module.export is 

// Todo.remove({}).then((result)=> {
//     console.log(result);
// })

Todo.findByIdAndRemove('5ac55fdc7d0552b67c96bea4').then((todo) => {
    console.log(todo);
})