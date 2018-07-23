const express = require('express');
const models = require('../models/brainees');
let paginateRouter = express.Router();

maxPageData = 5;


function route() {

	paginateRouter.route('/students/:id')
		.post(async (req, res) => {
			try {
				if (req.params.id && req.params.id != '') {
					if (req.body.pageLimit)
						this.maxPageData = req.body.pageLimit;

					let users = await models.Student.find({}).skip((req.params.id - 1) * this.maxPageData).limit(this.maxPageData).lean();
					let totalItems = await models.Student.count({});

					users.forEach(e => {
						if (e.password) {
							let a = e.password.length;
							e.password = e.password.slice(0, a / 2).padEnd(a, '*');
						}
					})
					res.status(200).json({
						error: false,
						totalItems: totalItems,
						users: users
					});
				} else {
					res.status(403).json({
						error: true,
						message: `Invalid page Id.`
					});
				}
			} catch (err) {
				res.status(503).json({
					message: "Error"
				})
			}
		})


	paginateRouter.route('/mentors/:id')
		.post(async (req, res) => {
			try {
				if (req.params.id && req.params.id != '') {
					if (req.body.pageLimit)
						this.maxPageData = req.body.pageLimit;

					let users = await models.Mentor.find({}).skip((req.params.id - 1) * this.maxPageData).limit(this.maxPageData).lean();
					let totalItems = await models.Mentor.count({});

					users.forEach(e => {
						if (e.password) {
							let a = e.password.length;
							e.password = e.password.slice(0, a / 2).padEnd(a, '*');
						}
					})
					res.status(200).json({
						error: false,
						totalItems: totalItems,
						users: users
					});
				} else {
					res.status(403).json({
						error: true,
						message: `Invalid page Id.`
					});
				}
			} catch (err) {
				res.status(503).json({
					message: "Error"
				})
			}
		})
	return paginateRouter;
}

module.exports = route();