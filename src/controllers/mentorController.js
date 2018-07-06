const models = require('../models/brainees');
const jwt = require('jwt-simple');
module.exports = {
    register: (req, res) => {
        var entry = new models.Mentor({
            name: {
                firstname: req.body.name.firstname,
                lastname: req.body.name.lastname
            },
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            linkedinUrl: req.body.linkedinUrl
        });

        entry.save((err,newMentor) => {
            if (err) {
                var errMsg = `Sorry, there was an error saving the user. ${err}`;
                res.status(503).send({ message: errMsg });
            }
            else {
                let payload = { sub: newMentor._id, role: 'isMentor' };
                let token = jwt.encode(payload, 'brainees');
                let successMessage = `User was saved`;
                res.status(200).send({ message: successMessage, token: token  });
            }
        });


    }
}