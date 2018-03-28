const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/User')//watch case sensitive. the variable here has to be exactly
//what the module.export is 

//id is a certain length object, so if you add to it, it will cause error.
//var id = '5ab1d08b2b17c408ecac2dc9'
//todo.find can find you anything based on what you give it
// Todo.find({
//     _id: id//mongoose automatically convets this string into an objectID to evaluate against the _id field. you don't have to convert to 
//     //objectID manually. 
// }).then((docs)=> {
//     console.log('todos', docs);
// })

// if(!ObjectID.isValid(id)) {
//     console.log('id is invalid');
// }

// //it returns one document at most, like TOP 1
// //findOne returns NULL if not find anything
// Todo.findOne({
//     _id: id//findONe finds you the first documents of a given logic. This case since _id is unique, it will 
//     //always find one.``` 
// }).then((todo)=> {//Since findOne always retunrs ONE, so the variable passed into the callback is singular. 
//     console.log('todo', todo)
// }) 

//findById returns NULL if not find anything so you can test for it in .then()
// Todo.findById(id).then((todo)=> {
//     if(!todo) {
//         return console.log('No id found');
//     }
//     console.log('todobyid', todo)
// }).catch((e) => console.log(e))


User.findById('5ab9c939ab2e1d3f58b2c65e').then((user)=> {
    if(!user) {
        return console.log('No users found')
    }
    console.log('user',user)
}, (e) => {
    console.log('error',e);
});
 
