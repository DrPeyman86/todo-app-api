const {MongoClient, ObjectID} = require('mongodb')


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err) {
        return console.log('Unable to connect to mongo db');//if you don't put return, it will run the rest of the function
        //regardless if there was an error. So return will exit the function if there was error
    }
    console.log('Successfully conneced to mongo db')
    const db = client.db('TodoApp');//specify the db you want to use

    // db.collection('Todo').findOneAndUpdate({
    //     _id: new ObjectID('5aa4c390c73ba118b0fa7399')
    // }, {
    //     $set: {//have to use these mongoDB update operators to actually update fields
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false//we don't want the original document to return. no need
    // }).then((result)=>{
    //     console.log(result);
    // })

    db.collection('Todo').findOneAndUpdate({
        text: 'Eat lunch'
    }, {
        $set: {
            text: 'Eat lunch at 2PM'
        }
    }, {
        returnOriginal: false
    }).then((result)=> {
        console.log(result)
    })

    db.collection('Users').findOneAndUpdate({
        name: 'Mehmet'
    }, {
        $inc: {
            age: 1
        }
    }, {
        returnOriginal:false
    }).then((result)=> {
        console.log(result)
    })
    
    //client.close();
})