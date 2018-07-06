const express = require('express')
let StudentRouter = express.Router()
let Student = require('../controllers/studentController')

function route() {
    StudentRouter.route('/register')
        .post(Student.register)


    return StudentRouter;
}

module.exports = route();