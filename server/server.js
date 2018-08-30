require('./config/config'); 

const _ = require('lodash');
const {ObjectID} = require('mongodb');

var express = require('express')
var bodyParser = require('body-parser')
var {mongoose} = require('./db/mongoose')


var {Todo} = require('./models/todo')
var {User} = require('./models/User')
var {authenticate} = require('./middleware/authenticate.js')

const port =     process.env.PORT// || 3000;//a hosting environment like heroku will set process.env.PORT, so that
//the app will use that as the port. If it's not defined, when we run locally, it will use regular 3000. 
//removed the // 3000 because we set it before based on what the "env" variable is

var app = express();

app.use(bodyParser.json());//this is middleware telling the app to use bodyParser to parse all JSON requests. 

app.post('/todos', authenticate, (req,res)=> {
    //console.log(req.body)//the body gets stored by the bodyParser
    //since _creator is required and it assigns the user ObjectID to that property, add it.
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    })
    todo.save().then((docs)=>{
        res.status(200).send(docs);//send the request back to the user
    },(err)=> {
        res.status(400).send(err)
    })
})

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos)=>{
        res.send({todos})//sending back and object gives more flexibility rather than an array because
        //you can send along other properties with the object. 
    }, (e)=>{
        res.status(400).send(e);
    })
})

app.get('/todos/:id', authenticate, (req, res) => {
    //res.send(req.params)//req.params is the object of params sent through the URL. 
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send('Id is not valid')
    }

    //Todo.findById(id)//Todo.findById(id) no longer applicable since authenticate we only want 
    //Todos that are assigned to that user that was authenticated
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo)=> {
        if(!todo) {
            res.status(404).send('No todo found')
        }
        res.status(200).send({todo})
    }).catch((e)  => {
        res.status(400).send('Error finding todo');
    })

})

//todo - convert to async/await
// app.delete('/todos/:id',authenticate, (req, res) => {
//     var id = req.params.id;


//     if(!ObjectID.isValid(id)) {
//         return res.status(404).send('Id is not valid')
//     }

//     //Todo.findByIdAndRemove(id)//we don't just want to find by Id, we also want to find by creator
//     Todo.findOneAndRemove({
//         _id: id,
//         _creator: req.user._id
//     })
//     .then((todo)=> {
//         if(!todo) {
//             res.status(404).send('No Id found')
//         }
//         res.status(200).send({todo});
//     }).catch((e)=> {
//         res.status(400).send('Error in delete request')
//     })
// })

//convert above function to async/await
app.delete('/todos/:id',authenticate, async (req, res) => {
    var id = req.params.id;


    if(!ObjectID.isValid(id)) {
        return res.status(404).send('Id is not valid')
    }
    try {
        const todo = await Todo.findOneAndRemove({_id: id,_creator: req.user._id});
        if(!todo) {
            res.status(404).send('No Id found')
        }
        res.status(200).send({todo});
    } catch (e) {
        res.status(400).send('Error in delete request')
    }
})

//todo - convert to async/await
// app.post('/users', (req,res)=> {
//     var body = _.pick(req.body,["password","email","name"])//this will only allow the user request to update what is included in the array. So if you don't want users to update "token" or "completed date" do not include in array
    
//     // var user = new User({
//     //     name: req.body.name,
//     //     password: req.body.password,
//     //     email: req.body.email
//     // })
//     var user = new User(body)//since body is already an object above, just pass it in as argument to the instance. ANd it will only include properties defined by the _.pick method above
    
//     //two types of methods calls
//     //User -- where the first letter is capitlaized is a MODEL function. Model methods do not require an individual document
//     //User.findByToken - findByToken does not exist in mongoose, it is a custom method, which we 
//     //we will send token into and find that User. 
//     //user -- where letter is lowercase is INSTANCE. are called on an individual document
//     //user.generateAuthToken -- responsible for adding a token to the individual user object to pass to the server/database.
//     //user.generateAuthToken -- it is a method meant to handle one user at a time, which is why it is an INSTANCE method
//     //console.log('here0000')
    
//     user.save().then(()=> {
//         //get the return value from the user.generateAuthToken() method
//         return user.generateAuthToken();
//         //res.status(200).send(user);//no need to send the same user as the client gave us.need to send back the user
//         //with the token added
//     }).then((token)=> {
//         //send back the http header back to client, which is the goal
//         res.header('x-auth', token).send(user);//when you create a header with 'x-' you are creating a custom header
//         //which mean the http does not support by default, but it could be used
//         //for your own app
//     }).catch((e) => {
//         console.log(e)
//         res.status(400).send(e);
//     })
// })


//turned above function to a async/await function
app.post('/users', async (req,res)=> {
    try {
        const body = _.pick(req.body,["password","email","name"])//this will only allow the user request to update what is included in the array. So if you don't want users to update "token" or "completed date" do not include in array
    
        // var user = new User({
        //     name: req.body.name,
        //     password: req.body.password,
        //     email: req.body.email
        // })
        const user = new User(body)//since body is already an object above, just pass it in as argument to the instance. ANd it will only include properties defined by the _.pick method above
        
        //two types of methods calls
        //User -- where the first letter is capitlaized is a MODEL function. Model methods do not require an individual document
        //User.findByToken - findByToken does not exist in mongoose, it is a custom method, which we 
        //we will send token into and find that User. 
        //user -- where letter is lowercase is INSTANCE. are called on an individual document
        //user.generateAuthToken -- responsible for adding a token to the individual user object to pass to the server/database.
        //user.generateAuthToken -- it is a method meant to handle one user at a time, which is why it is an INSTANCE method
        //console.log('here0000')
        await user.save();
        const token = user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch(e) {
        console.log(e)
        res.status(400).send(e);
    }

})



//this will be a private route. this will be require auth meaning token needs to be sent with this request and 
//the route will find the associated the user and send back the id of that user
app.get('/users/me',authenticate, (req,res)=>{
    // var token = req.header('x-auth');
    // //this is a model method-read up top of model method
    // User.findByToken(token).then((user)=>{
    //     if(!user) {
    //         return Promise.reject();//this will essentially break code and send to the catch block
    //     }
    //     res.send(user);
    // }).catch((e)=> {
    //    res.status(401).send(); 
    // })
    //since the middleware in authenticate.js, just send what was provided by it
    res.send(req.user);

})

//POST /users/login (email, password)
//this post is used to login the user that already has a token, so that they 
//can be re-authenticated if they login from another device using same email
// app.post('/users/login', (req, res) => {
//     var body = _.pick(req.body, ['email','password'])

//     //res.send(body);
//     //pass email and password to find the user based on credentials
//     User.findByCredentials(body.email,body.password).then((user)=> {
//         //res.send(user);//it will enter here only if the user is found
//         //if user is found, generate a new token and send to client. save as when new user was created
//         return user.generateAuthToken().then((token)=> {//send the token determined to .then()
//             res.header('x-auth', token).send(user);//when you create a header with 'x-' you are creating a custom header  
//         })
//     }).catch((e) => {
//         //it will enter catch if no user is found
//         res.status(400).send();
//     })
// })

//turning the above function to an async await function
app.post('/users/login', async (req, res) => {
    try {
        var body = _.pick(req.body, ['email','password'])
        const user = await User.findByCredentials(body.email,body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send();
    }
})


app.get('/users', (req, res)=> {
    User.find().then((users)=>{
        res.send(users)
    }, (e) => {
        res.status(400).send(e);
    })
})

app.patch(`/todos/:id`,authenticate, (req, res) => {
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
    //findOneANdUpdate
    //Todo.findByIdAndUpdate(id, ({$set: body}), {new: true}).then((todo) => {
    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id}
        , ({$set: body}), {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send("Id was not found to update");
        }
        res.status(200).send({todo})
    }).catch((err,res)=> {
        res.status(400).send("Error in process")
    })
})

//POST /users
//call the authenticate middleware to make sure the user is logged in. 
//authenticate makes the route private, so we know whoever is about to logout, does have authentication with that middleware. 
// app.delete('/users/me/token', authenticate, (req,res) => {
//     //removeToken is an instance method on the user object, which we will make
//     req.user.removeToken(req.token).then(()=> {
//         res.status(200).send();
//     }, ()=> {
//         res.status(400).send();
//     })
// })

//turn the function above to a async await function 
//async will return a promise, not a value. Having no return keyword, we are implicity returning an resolve undefined.
app.delete('/users/me/token', authenticate, async (req,res) => {
    //do not need a const or let value because we are not sending back a value, just want to know if it passed or failed
    try {
    await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (e) {
        res.status(400).send();
    }
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