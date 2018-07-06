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


    return CommonRouter;
}

module.exports = route();