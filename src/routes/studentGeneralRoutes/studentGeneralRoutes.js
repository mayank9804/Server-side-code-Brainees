const express = require('express')
let StudentGeneralRouter = express.Router()
let student = require('../../controllers/studentGeneralController/studentGeneralController');
let auth = require('../../auth');

function route() {
    StudentGeneralRouter.route('/browsementors')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .get(student.browsementors)

    StudentGeneralRouter.route('/subscribementor')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .post(student.subscribementor)

    StudentGeneralRouter.route('/getmymentors')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .get(student.getMyMentors)

    StudentGeneralRouter.route('/unsubscribementor/:id')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .delete(student.unSubscribeMentor)

    StudentGeneralRouter.route('/getmyposts')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .get(student.getMyPosts)

    StudentGeneralRouter.route('/getmydetails')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .get(student.getMyDetails)

    StudentGeneralRouter.route('/change')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .post(student.changeDetails);
        
    StudentGeneralRouter.route('/updatepassword')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .post(student.updatePassword);

    return StudentGeneralRouter;
}

module.exports = route();