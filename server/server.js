var mongoose = require('mongoose')

//tell mongoose which Promise library you want to use.
//mongoose supports regular callbacks, but promises are simpliar and cleaner
mongoose.Promise = global.Promise;//use global.Promise for the mongoose
mongoose.connect('mongodb://localhost:27017/TodoApp');

//create model
//a model tells mongoose what each collection should have as it's fields
//since in mongoDB not every document has the same fields as the other documents. 
//models force mongoose to always have the same fields whenever something is inserted
var Todo = mongoose.model('Todo', {
    text: {
        type: String   
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});
//once you have your model, you can use it as a constructor function, calling it as a new instance
//in this case, this is fine because the other fields are not required, so this would get inserted no problem
var newTodo = new Todo({
    text: 'Eat dinner'
})
//then use .save() to actually save it in the database. .save() returns a PROMISE, so you can chain a then() call after
newTodo.save().then((docs)=> {
    console.log(docs)
}, (err)=>{
    console.log('Error saving', err)
})

var secTodo = new Todo({
    text: 'Take a dump at night',
    completed: false
})

secTodo.save().then((doc)=>{
    console.log(doc)
}, (err)=> {
    console.log('Error saving data', err);
})