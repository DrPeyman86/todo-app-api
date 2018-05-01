require('./config/config'); 

const _ = require('lodash');
const {ObjectID} = require('mongodb');

var express = require('express')
var bodyParser = require('body-parser')
var {mongoose} = require('./db/mongoose')


var {Todo} = require('./models/todo')
var {User} = require('./models/User')

const port =     process.env.PORT// || 3000;//a hosting environment like heroku will set process.env.PORT, so that
//the app will use that as the port. If it's not defined, when we run locally, it will use regular 3000. 
//removed the // 3000 because we set it before based on what the "env" variable is

var app = express();

app.use(bodyParser.json());//this is middleware telling the app to use bodyParser to parse all JSON requests. 

app.post('/todos', (req,res)=> {
    //console.log(req.body)//the body gets stored by the bodyParser
    var todo = new Todo({
        text: req.body.text
    })
    todo.save().then((docs)=>{
        res.status(200).send(docs);//send the request back to the user
    },(err)=> {
        res.status(400).send(err)
    })
})

app.get('/todos', (req, res) => {
    Todo.find().then((todos)=>{
        res.send({todos})//sending back and object gives more flexibility rather than an array because
        //you can send along other properties with the object. 
    }, (e)=>{
        res.status(400).send(e);
    })
})

app.get('/todos/:id', (req, res) => {
    //res.send(req.params)//req.params is the object of params sent through the URL. 
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send('Id is not valid')
    }

    Todo.findById(id).then((todo)=> {
        if(!todo) {
            res.status(404).send('No todo found')
        }
        res.status(200).send({todo})
    }).catch((e)  => {
        res.status(400).send('Error finding todo');
    })

})

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;


    if(!ObjectID.isValid(id)) {
        return res.status(404).send('Id is not valid')
    }

    Todo.findByIdAndRemove(id).then((todo)=> {
        if(!todo) {
            res.status(404).send('No Id found')
        }
        res.status(200).send({todo});
    }).catch((e)=> {
        res.status(400).send('Error in delete request')
    })
})

app.post('/user', (req,res)=> {
    var user = new User({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email
    })
    user.save().then((docs)=> {
        res.status(200).send(docs);
    }, (e) => {
        res.status(400).send(e);
    })
})

app.get('/users', (req, res)=> {
    User.find().then((users)=>{
        res.send(users)
    }, (e) => {
        res.status(400).send(e);
    })
})

app.patch(`/todos/:id`, (req, res) => {
    var id = req.params.id;
    //lodash .pick() takes an object as first argument and array as other. 
    //only properties that exist in the array defined in the first argument will be set. 
    var body = _.pick(req.body, ["text", "completed"])//only allow users to update what exists in this Array and set it to the var body

    if(!ObjectID.isValid(id)) {
        return res.status(404).send('Id is not valid')
    }
    //_isBoolean checks to see if a value is a boolean type
    if(_.isBoolean(body.completed) && body.completed) {
        //if boolean and body.completed is true, set the body.completedAt property to true, which 
        //will eventually set the Todo model property in the database
        body.completedAt = new Date().getTime()
    } else {//if it is not a boolean and body.completed is not true
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, ({$set: body}), {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send("Id was not found to update");
        }
        res.status(200).send({todo})
    }).catch((err,res)=> {
        res.status(400).send("Error in process")
    })
})

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})

module.exports = {app}//export the app so that it is available to other files

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