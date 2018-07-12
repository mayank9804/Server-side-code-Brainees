const express = require('express')
let MentorQuizRouter = express.Router()
let mentor = require('../../controllers/mentorGeneralController/mentorQuizController');
let auth = require('../../auth');
function route() {
    //mentor/general/poststatus
    MentorQuizRouter.route('/getunpublishedquiz')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .get(mentor.getUnpublishedQuiz)

    MentorQuizRouter.route('/getcategories')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .get(mentor.getCategories)

    MentorQuizRouter.route('/setquiz')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .post(mentor.setQuiz)

    MentorQuizRouter.route('/pushquestion')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .post(mentor.pushQuestion)

    MentorQuizRouter.route('/updatequestion/')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .patch(mentor.updateQuestion)

    MentorQuizRouter.route('/getquiz/:id')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .get(mentor.getQuiz)

    MentorQuizRouter.route('/deletequiz/:id')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .delete(mentor.deleteQuiz)

    MentorQuizRouter.route('/getquestionwithanswers/:id')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .get(mentor.getQuestionWithAnswers)

    MentorQuizRouter.route('/publishquiz')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .patch(mentor.publishQuiz)
        
    MentorQuizRouter.route('/getpublishedquiz')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .get(mentor.getPublishedQuiz)

    return MentorQuizRouter;
}

module.exports = route();