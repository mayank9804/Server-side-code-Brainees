const express = require('express')
let MentorGeneralRouter = express.Router()
let mentor = require('../../controllers/mentorGeneralController/mentorGeneralController');
let auth = require('../../auth');
function route() {
    //mentor/general/poststatus
    MentorGeneralRouter.route('/poststatus')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .post(mentor.poststatus)

    MentorGeneralRouter.route('/getposts')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .get(mentor.getposts)

    MentorGeneralRouter.route('/getmystudents')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .get(mentor.getMyStudents)

    MentorGeneralRouter.route('/removestudent/:id')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .delete(mentor.removeStudent)

    MentorGeneralRouter.route('/newrequests')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .get(mentor.newRequests)

    MentorGeneralRouter.route('/approvestudent')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .patch(mentor.approveStudent)

    MentorGeneralRouter.route('/getmydetails')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .get(mentor.getMyDetails)

    MentorGeneralRouter.route('/deletepost/:id')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .delete(mentor.deletePost)


    MentorGeneralRouter.route('/editpost/:id')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .patch(mentor.editPost)

    MentorGeneralRouter.route('/change')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .post(mentor.changeDetails);

    MentorGeneralRouter.route('/updatepassword')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .post(mentor.updatePassword);

    return MentorGeneralRouter;
}

module.exports = route();