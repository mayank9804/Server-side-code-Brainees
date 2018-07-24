const jwt = require('jwt-simple');


function checkAuthenticated(req,res,next){
    console.log("Authenticating");
    if(!req.header('authorization'))
        return res.status(401).send({message:'Unauthorized access!'});

    let token = req.header('authorization');
    let payload = jwt.decode(token,'brainees');
    
    if(!payload)
        return res.status(401).send({message:'Unauthorized access!'});
    
    if(payload.role!='isStudent' && payload.role!='isMentor' && payload.role!='isAdmin')
        return res.status(401).send({message:'Unauthorized access!'});
    
    req.user = payload.sub;
    req.role = payload.role;
    next();
}

module.exports = {
    checkAuthenticated:checkAuthenticated
}