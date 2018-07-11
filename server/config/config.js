var env = process.env.NODE_ENV || 'development';//so if the NODE_ENV is not defined, set it development by default
//console.log('env ****', env);

if (env === 'development' || env === 'test') {
    var config = require('./config.json');
    //console.log(config);
    var envConfig = config[env];
    //console.log(envConfig);

    Object.keys(envConfig).forEach((key)=> {//Object.keys loops a JSON object and loops each property and gets its keys and returns as an array
        process.env[key] = envConfig[key];//set the value of the key from the JSON to whatever [key] we are defininng in the process.end object
    });

}

//the following code would be removed so that this code will not be included in your repository
// if (env === 'development') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
// } else if (env === 'test') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'//when in 'test' env, it will use the TodoAppTest database rather than production 'TodoApp' database
// }