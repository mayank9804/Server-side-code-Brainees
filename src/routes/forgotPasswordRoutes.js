let express = require('express');
let forgotPasswordRouter = express.Router();

function route(){

    forgotPasswordRouter.route('/')
    .post((req,res,next)=>{

    })

    return forgotPasswordRouter;
}

module.exports = route();