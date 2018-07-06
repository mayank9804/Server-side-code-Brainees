const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
let app = express();


app.use(bodyParser.json());
app.use(cors());

app.use((req,res,next)=>{
    console.log(req.headers.origin);
    next();
});


let paginateRouter = require('./src/routes/paginateRoutes');
let studentRouter = require('./src/routes/studentRoutes');
let mentorRouter = require('./src/routes/mentorRoutes');
let loginRouter = require('./src/routes/loginRoutes');
let mentorGeneralRouter = require('./src/routes/mentorGeneralRoutes/mentorGeneralRoutes');
let studentGeneralRouter = require('./src/routes/studentGeneralRoutes/studentGeneralRoutes');
let commonRouter = require('./src/routes/commonRoutes');

app.use('/paginate',paginateRouter);
app.use('/student',studentRouter);
app.use('/mentor',mentorRouter);
app.use('/login',loginRouter);
app.use('/student/general',studentGeneralRouter);
app.use('/mentor/general',mentorGeneralRouter);
app.use('/common/',commonRouter)

app.listen(3000,()=>{
    console.log("Server Started on port 3000");
})

mongoose.connect('mongodb://localhost:27017/brainees',()=>{
    console.log("Mongo Connection successful!");
});