const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken')

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/User');



const userOneId = new ObjectID();//reference the id you want so you can use it anywhere
const userTwoId = new ObjectID();
//tokens array is an array of objects having 2 properties access and token
const users = [{
    _id: userOneId,
    email: 'peymanctest@seed.com',
    name: 'peyman 1 test',
    password: 'userOnePasstest',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoId,
    email: 'peymancttest@seed.com',
    name: 'peyman 2 test',
    password: 'userTwopasstest',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
    }]
}]

const todos = [{
    _id: new ObjectID(),//used for the Get/ todo/id test because we need to know the id that will be inserted into collection
    text: "First todos",
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: "Second todos22",
    completed: true,
    completedAt: 333,
    _creator: userTwoId
}]

const populateTodos = (done)=> {
    //this will remove all todo collections from the database so that in the test it will always start with 0
    //so that the todos.length below expecting to be 1, will pass.
   //Todo.remove({}).then(() => done());//this will remove all TOdo collections before each test
    Todo.remove({}).then(() =>{
        return Todo.insertMany(todos, (err)=> {
            if(err) {
                done(err);
            }
        })//return allows you to chain callbacks
        done()
    }).then(()=> done())
};


const populateUsers = (done) => {
    //first, remove everything already in there.
    User.remove({}).then(()=> {
        //these two return a promise from the User model. 
        var userOne = new User(users[0]).save();//save the users array first index to database
        var userTwo = new User(users[1]).save();

        //Promise.all is an array of promises. All Promises inside its array have to be resolved before the callback is called
        return Promise.all([userOne, userTwo])
    }).then(() => done())
}

module.exports = {todos, populateTodos, users, populateUsers}//export a function like this. todos is the array, populateTodos is function