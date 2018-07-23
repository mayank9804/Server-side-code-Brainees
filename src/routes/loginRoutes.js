const express = require('express');
let LoginRouter = express.Router();
const models = require('../models/brainees');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');

function route() {

    //Route to handle login
    LoginRouter.route('/')
        .post(async (req, res) => {
            let user = req.body;
            try {
                let admin = await models.Admin.findOne({ username: user.username });
                
                
                if (!admin)
                    throw err;
                if (admin.password == user.password) {
                    let payload = { sub: admin._id, role: 'isAdmin' };
                    let token = jwt.encode(payload, 'brainees');
                    return res.status(200).send({ message: "Authorized user", token: token });
                }
                else
                    return res.status(401).send({ message: "Invalid username or password" });
            }
            catch (err) {
                try {
                    let student = await models.Student.findOne({ username: user.username });
                    if (!student)
                        throw err;

                    bcrypt.compare(user.password, student.password, (err, isMatch) => {
                        if (isMatch) {
                            let payload = { sub: student._id, role: 'isStudent' };
                            let token = jwt.encode(payload, 'brainees');
                            return res.status(200).send({ message: "Authorized user", token: token });
                        }
                        else
                            return res.status(401).send({ message: "Invalid username or password" });
                    })
                } catch (err) {
                    try {
                        let mentor = await models.Mentor.findOne({ username: user.username });
                        if (!mentor)
                            throw err;

                        bcrypt.compare(user.password, mentor.password, (err, isMatch) => {
                            if (isMatch) {
                                //Mentor found
                                let payload = { sub: mentor._id, role: 'isMentor' };
                                let token = jwt.encode(payload, 'brainees');
                                return res.status(200).send({ message: "Authorized user", token: token });
                            }
                            else
                                return res.status(401).send({ message: "Invalid username or password" });
                        })
                    } catch (err) {
                        //None found
                        return res.status(401).send({ message: "Invalid username or password" });
                    }
                }
            }
        });

    return LoginRouter;
}
module.exports = route();