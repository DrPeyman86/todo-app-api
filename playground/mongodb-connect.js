//const MongoClient = require('mongodb').MongoClient//pull in MongoClient from the mongodb library

//object Destructing way of getting the ID before it is inserted into DB. 
//const {MongoClient, ObjectID} = require('mongodb')//writing this way, object Destructing, you can get properties of 
//the mongodb property as an object later on. 
//var obj = new ObjectID();//this will create a unique objectID as it would if you insert a record into the mongoDB
//but with this you will know the objectID before it is inserted into db. 
//console.log(obj);
const {MongoClient, ObjectID} = require('mongodb')

//object Destructuring ES6 function - lets you parse out an object property into its own variable
//var user = {name: "Peyman", age: 31}
//var {name} = user//this is object Destructuring. Get the name property of within user object into its own "name" variable object
//console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err) {
        return console.log('Unable to connect to mongo db');//if you don't put return, it will run the rest of the function
        //regardless if there was an error. So return will exit the function if there was error
    }
    console.log('Successfully conneced to mongo db')
    const db = client.db('TodoApp');//specify the db you want to use

    //.find() returns all documents in a collection. 
    //.toArray returns those in an array each having their own properties
    //.toArray is a PROMISE, so you can chain a .then() after to continue with process
    //inside the .find() is the actual logic for your query you want returned
    db.collection('Todo').find({
        completed: false,
        _id: new ObjectID('5aa4c1f22c09182f9c9d85a6')
        //_id: '5aa4c390c73ba118b0fa7399' // this won't work because this is saying that _id is a string, but it's objectID
        //so you need to use the objectID constructor
    }).toArray().then((docs)=> {
        console.log(JSON.stringify(docs, undefined, 2))
    }, (err)=>{
        console.log("Error fetching data", err);
    })
    //if you want to count the items
    db.collection('Todo').find().count().then((count)=>{
        console.log(`Todo count: ${count}`)
    }, (err)=> {
        console.log('Error counting the items', err)
    })

    db.collection('Users').find({
        name: 'Peyman'
    }).toArray().then((docs)=>{
        console.log(JSON.stringify(docs, undefined, 2))
    }, (err)=> {
        console.log('Error retrieving data', err)
    })

    // db.collection('Todo').insertOne({
    //     text: 'To do something',
    //     completed: false
    // }, (err, results) => {
    //     if(err) {
    //         return console.log('Unable to insert record', err);
    //     }
    //     console.log(JSON.stringify(results.ops, undefined, 2))//results.ops, .ops attribute returns all the DOCUMENTS, which are fields/columns 
    //     //in a regular SQL database to the console. 
    //     console.log(results.ops[0]._id.getTimestamp());
    // })

    // db.collection('Users').insertOne({
    //     //_id: 123,
    //     name: 'Peyman',
    //     age: 31,
    //     location: 'Marietta GA'
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Could not insert users', err)
    //     }
    //     console.log('Added users to users')
    // })

    client.close();
})