{
    "name": "todo-api",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "start": "node server/server.js",//this will tell hosting servers like herkou what file to start running first. like application.cfm
      "test": "mocha server/**/*.test.js",
      "test-watch": "nodemon --exec \"npm test\""
    },
    "engines": {//engines lets us configure some properties to the http server like heroku
        "node": "9.5.0"//telll heroku to use node 9.5.0
    }
    "author": "",
    "license": "ISC",
    "dependencies": {
      "body-parser": "^1.18.2",
      "express": "^4.16.3",
      "mongodb": "^3.0.4",
      "mongoose": "^5.0.10"
    },
    "devDependencies": {
      "expect": "^1.20.2",
      "mocha": "^3.0.2",
      "nodemon": "^1.17.2",
      "request": "^2.31.0",
      "supertest": "^3.0.0"
    }
  }
  
  //node -v //lets you see what version of node you are running 
  