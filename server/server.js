var express = require('express')
var bodyParser = require('body-parser')
var {mongoose} = require('./db/mongoose')


var {Todo} = require('./models/todo')
var {user} = require('./models/users')


var app = express();

app.use(bodyParser.json());//this is middleware telling the app to use bodyParser to parse all JSON requests. 

app.post('/todos', (req,res)=> {
    console.log(req.body)//the body gets stored by the bodyParser
    var todo = new Todo({
        text: req.body.text
    })
    todo.save().then((docs)=>{
        res.status(200).send(docs);//send the request back to the user
    },(err)=> {
        res.status(400).send(err)
    })
})

app.listen(3000, () => {
    console.log("Listening to port 3000")
})

// var newUser = new user({
//     name: "Peyman",
//     email: "test@att.com",
//     password: "kristen"
// })
// newUser.save().then((docs) => {
//     console.log(docs)
// }, (err) => {
//     console.log(err, "There was error inserting record")
// })

// //once you have your model, you can use it as a constructor function, calling it as a new instance
// //in this case, this is fine because the other fields are not required, so this would get inserted no problem
// var newTodo = new Todo({
//     // text: 'Eat dinner'
//     text: "Take a shit tonight",
//     completed: false,
//     completedAt: "123"
// })
// //then use .save() to actually save it in the database. .save() returns a PROMISE, so you can chain a then() call after
// newTodo.save().then((docs)=> {
//     console.log(docs)
// }, (err)=>{
//     console.log('Error saving', err)
// })

// var secTodo = new Todo({
//     text: 'Take a dump at night',
//     completed: false
// })

// secTodo.save().then((doc)=>{
//     console.log(JSON.stringify(doc, undefined, 2))
// }, (err)=> {
//     console.log('Error saving data', err);
// })