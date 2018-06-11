const expect = require('expect');
const express = require('express');
//const request = require('request');
const request = require('supertest');
const {ObjectID} = require('mongodb')


const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/User')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')//pull of properties

// const todos = [{
//     _id: new ObjectID(),//used for the Get/ todo/id test because we need to know the id that will be inserted into collection
//     text: "First todos"
// }, {
//     _id: new ObjectID(),
//     text: "Second todos22",
//     completed: true,
//     completedAt: 333
// }]

/******Put todos array above into seed.js */

//var test_id = new ObjectID();

//testing lifecycle method -
//beforeEach runs before each test, before each .it()
// beforeEach((done)=> {
//     //this will remove all todo collections from the database so that in the test it will always start with 0
//     //so that the todos.length below expecting to be 1, will pass.
//    //Todo.remove({}).then(() => done());//this will remove all TOdo collections before each test
//     Todo.remove({}).then(() =>{
//         return Todo.insertMany(todos, (err)=> {
//             if(err) {
//                 done(err);
//             }
//         })//return allows you to chain callbacks
//         done()
//     }).then(()=> done())
// })

/*****replaced above with below to split out the beforeEach */
beforeEach(populateUsers);
beforeEach(populateTodos);


describe('Post/todos', () => {
    it('should create a new todo', (done) => { 
        var text = "text to do text";
        
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text)//want the response we get from body to be exactly same as the text above
            })
            .end((err, res)=> {
                if (err) {
                    return done(err);//call done function to make the test synchronos and send the err message
                    //return just stops further reading of the function below 
                }
                //look into the database now for the text that you tested with to see if it was inserted and matches
                Todo.find({text}).then((todos)=> {//Todo.find(text) - find the only Todo document that matches that text variable
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done()
                }).catch((err) => done(err))//this is statement syntax for short
                //the catch is for the Todo.find above since that happens afte the (err) so they will always
                //get passed the test unless you have the .catch()
            })
    })

    it('should not create todo with invalid body data', (done)=> {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) =>{
                if(err) {
                    return done(err);
                }
                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(2);//since above we added 2 bogus ones everytime, the count will need to be 0 to check
                    done()
                }).catch((err) => done(err))
            })
    })
    
})

describe('GET /todos', () => {
    it('should get all todos', (done)=> {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end((done))
    })
})

describe('GET /todos/id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)//this will make a request to this URL with the first [0] position of the 
            //todos array and its _id property. Convert to hexString() to convert it from object to string
            .expect(200)
            .expect((res)=> {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    })

    it('should return a 404 for none found in collection', (done) => {
        var hex_id = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hex_id}`)
            .expect(404)
            .end(done)
    })

    it('should return a 404 for invalid ObjectID', (done) => {
        request(app)
            .get('/todos/12133113')
            .expect(404)
            .end(done)
    })
})

describe('DELETE', () => {
    it('should remove a todo', (done)=> {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId)
            })
            .end((err, res)=> {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo)=> {
                    expect(todo).toNotExist();
                    done();
                }).catch((e)=> done(e))
            })
        
            
    })

    it('should return 404 if not found', (done) => {
        var hex_id = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hex_id}`)
            .expect(404)
            .end(done) 
    })

    it('should return a 404 for invalid ObjectID', (done) => {
        request(app)
            .delete('/todos/12133113')
            .expect(404)
            .end(done)
    })
})

describe('Patch/todos/:id', () => {
    it('should update the todo',(done)=>{
        var hexId = todos[0]._id.toHexString();
        var text = 'This should be new test'

        request(app)
            //use .send() if you want to send something to that URL to test with
            .patch(`/todos/${hexId}`)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res)=> {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done)

    })

    it('should clear completedAt when todo is not complted',(done)=>{
        var hexId = todos[1]._id.toHexString();
        var text = 'This should be new text!!!'

        request(app)
            //use .send() if you want to send something to that URL to test with
            .patch(`/todos/${hexId}`)
            .send({
                completed: false,
                text
            })
            .expect(200)
            .expect((res)=> {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist('number');
            })
            .end(done)
    })
})

describe('GET /users/me', () => {
    //get the user name back from client based on the users array created in seed.js
    it('should return user if authenticated', (done)=> {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)//set a header to your request http. we want to get
            //the same token value as set in the users[0].token property to check for
            .expect(200)
            .expect((res)=> {
                //expecting the id of the response equals to the _id of the users[0]
                expect(res.body._id).toBe(users[0]._id.toHexString());
                //expect the email to be same email as users[0] email
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    })

    it('should return 401 if not authenticated', (done)=> {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res)=> {
                expect(res.body).toEqual({})//when you expect the body of an object to be blank, use toEqual({}) rather than .toBe();
        })
        .end(done);
    })
    
})

describe('POST /users', () => {
    it('should create a user',(done)=> {
        var email = 'example@example.com',
        password = '123mmb!',
        name = 'peyman users test';

        request(app)
            .post('/users')
            .send({email, password, name})//ES6 format. variables above, senda as an object
            .expect(200)
            .expect((res)=> {
                //when header has hyphen in it, have to use [] notations instead of . dot notation
                expect(res.headers['x-auth']).toExist();//don't care of value, just that it exists
                expect(res.body._id).toExist();//dont care of value just that it exists
                expect(res.body.email).toBe(email)//we know the email so we can use .toBe()
            })
            //make further assertions when the data is inserted into DB
            .end((err) => {
                if(err) {
                    return done(err);
                }
                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);//are expecting the password to not be 
                    //what is in the database because the database password should be hashed
                    done()
                })
            })
    })

    it('should return validation errors if request invalid',(done)=> {
        var email = 'exampleexample.com',
        password = '123mmb!',
        name = 'peyman users test';

        request(app)
            .post('/users')
            .send({email, password, name})//ES6 format. variables above, senda as an object
            .expect(400)           
            .end(done);
    })

    it('should not create a user if email is in use',(done)=> {
        var email = users[0].email,
        name = 'peyman 3',
        password = 'password 3 test';
        
        request(app)
            .post('/users')
            .send({email, password, name})
            .expect(400)
            .end(done);
    })
})