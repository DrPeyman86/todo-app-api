var env = process.env.NODE_ENV || 'development';//so if the NODE_ENV is not defined, set it development by default
console.log('env ****', env);
if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'//when in 'test' env, it will use the TodoAppTest database rather than production 'TodoApp' database
}