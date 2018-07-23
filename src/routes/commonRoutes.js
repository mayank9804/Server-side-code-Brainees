const express = require('express')
let CommonRouter = express.Router()
let common = require('../controllers/commonController');
let auth = require('../auth');

function route() {

    CommonRouter.route('/likethispost')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .patch(common.likeThisPost)

    CommonRouter.route('/unlikepost')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .patch(common.unlikePost)

    CommonRouter.route('/getdetails/:id')
        .all((req, res, next) => {
            auth.checkAuthenticated(req, res, next);
        })
        .get(common.getDetails)

    CommonRouter.route('/checkusername')
        .post(common.checkUserName)


    return CommonRouter;
}

module.exports = route();