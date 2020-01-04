const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PORT = 5000;
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const profsRouter = require('./routes/profs');
const studentsRouter = require('./routes/students');
const classesRouter = require('./routes/classes');
const elementsRouter = require('./routes/element');




app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/gabs',{ useNewUrlParser: true,useCreateIndex:true} );
const connection = mongoose.connection;

connection.once('open',function(){
    console.log("MongoDB database connection established successfully");
});

app.use('/users',usersRouter);
app.use('/students',studentsRouter);
app.use('/profs',profsRouter);
app.use('/classes',classesRouter);
app.use('/auth',authRouter);
app.use('/elements',elementsRouter);

 
app.listen(PORT,function(){
    console.log("Server is running on Port :"+ PORT);
});