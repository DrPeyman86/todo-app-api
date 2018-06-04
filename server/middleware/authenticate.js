var {User} = require('./../models/User.js')

//create a middleware so that all routes will be send into this middleware so that the user 
//can be authenticated first before any route is called
var authenticate = (req,res,next) => {
    var token = req.header('x-auth');
    //this is a model method-read up top of model method
    User.findByToken(token).then((user)=>{
        if(!user) {
            return Promise.reject();//this will essentially break code and send to the catch block
        }
        //middleware can manipulate the req object that it being called from
        req.user = user;//this is sending the user property of the req object back to where this middleware is being called
        req.token = token;//making the req argument of the route that client made the request from to act as 
        //if the req was made to this middleware
        //res.send(user);
        next();//call next to continue with the regular route otherwise it will not return back to the normal route that was called
    }).catch((e)=> {
       res.status(401).send(); 
    })
};

module.exports = {authenticate};//export the authenticate return results
