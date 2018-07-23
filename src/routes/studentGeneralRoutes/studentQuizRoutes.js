const express = require('express')
let StudentQuizRouter = express.Router()
let student = require('../../controllers/studentGeneralController/studentQuizController');
let auth = require('../../auth');
function route() {

    StudentQuizRouter.route('/getquizzes')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .get(student.getQuizzes)

    StudentQuizRouter.route('/activatetest/:id')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .get(student.activateTest)

    StudentQuizRouter.route('/attendedquizzes')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .get(student.attendedQuizzes)

    StudentQuizRouter.route('/checkresponse')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .post(student.checkResponse)

    StudentQuizRouter.route('/nextquestion/:id')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .get(student.nextQuestion)

    StudentQuizRouter.route('/getcompletedquiz')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .get(student.completedQuiz)

    StudentQuizRouter.route('/getanalysedquestion/:id')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .get(student.getAnalysedQuestion)
    return StudentQuizRouter;
}

module.exports = route();