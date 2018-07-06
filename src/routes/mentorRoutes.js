const express = require('express')
let MentorRouter = express.Router()
let mentor = require('../controllers/mentorController');

function route() {
    MentorRouter.route('/register')
        .post(mentor.register)

    return MentorRouter;
}

module.exports = route();