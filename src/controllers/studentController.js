const models = require('../models/brainees')
const jwt = require('jwt-simple')
module.exports = {
    register:(req,res)=>{
        console.log(req.body);
        
        var entry = new models.Student({
            name : {
                firstname: req.body.nameGroup.firstName,
                lastname: req.body.nameGroup.lastName
            },
            email: req.body.emailId,
            username:req.body.userName,
            password:req.body.passwordGroup.password
        });

        entry.save((err,newStudent)=>{
            if (err) {
                var errMsg = `Sorry, there was an error saving the user. ${err}`;
                res.status(503).send({message:errMsg});
            }
            else {
                let payload = { sub: newStudent._id, role: 'isStudent' };
                let token = jwt.encode(payload, 'brainees');
                let successMessage = `User was saved`;
                res.status(200).send({message:successMessage,token:token});
            }
        });

        
    }
}