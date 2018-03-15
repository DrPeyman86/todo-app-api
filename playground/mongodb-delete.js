const {MongoClient, ObjectID} = require('mongodb')


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err) {
        return console.log('Unable to connect to mongo db');//if you don't put return, it will run the rest of the function
        //regardless if there was an error. So return will exit the function if there was error
    }
    console.log('Successfully conneced to mongo db')
    const db = client.db('TodoApp');//specify the db you want to use

    //delete many - delete any document that contains the logic
    // db.collection('Todo').deleteMany({
    //     text: 'Eat lunch'
    // }).then((result)=>{
    //     console.log(result)
    // })

    //delete the first instance with deleteOne
    // db.collection('Todo').deleteOne({text: 'Eat lunch'}).then((result)=>{
    //     console.log(result);
    // })
  
    //findONeAndDelete
    //find the data that you want to delete before deleting it
    //findOneAndDelete deletes the first instance it finds of what logic you have. And it 
    //also gets the _id that was deleted. 
    // db.collection('Todo').findOneAndDelete({completed: false}).then((result)=>{
    //     console.log(result);
    // })

    // db.collection('Users').findOneAndDelete({_id: 123}).then((result)=> {
    //     console.log(JSON.stringify(result, undefined, 2));
    // })

    db.collection('Users').deleteMany({name: 'Peyman'}).then((result)=> {
        console.log(result);
    })

    
    client.close();
})