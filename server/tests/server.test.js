const expect = require('expect');
const express = require('express');
//const request = require('request');
const request = require('supertest');


const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    text: "First todos"
}, {
    text: "Second todos"
}]

//testing lifecycle method -
//beforeEach runs before each test, before each .it()
beforeEach((done)=> {
    //this will remove all todo collections from the database so that in the test it will always start with 0
    //so that the todos.length below expecting to be 1, will pass.
   //Todo.remove({}).then(() => done());//this will remove all TOdo collections before each test
    Todo.remove({}).then(() =>{
        return Todo.insertMany(todos, (err)=> {
            if(err) {
                return done(err);
            }
        })//return allows you to chain callbacks
        done()
    }).then(()=> done())
})

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