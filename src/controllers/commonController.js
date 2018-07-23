const models = require('../models/brainees');
const mongoose = require('mongoose');

module.exports = {

    likeThisPost: async (req, res) => {
        try {
            //Increments the post like count in POSTS collection
            await models.Post.updateOne({ _id: req.body._id }, { $inc: { likesCount: +1 } });

            //Entry in Likes Collection
            if (req.role == 'isStudent') {
                var likeRecord = new models.PostLike({
                    postId: req.body._id,
                    role: {
                        kind: 'Student',
                        roleId: req.user
                    }
                })
            }
            else if (req.role == 'isMentor') {
                var likeRecord = new models.PostLike({
                    postId: req.body._id,
                    role: {
                        kind: 'Mentor',
                        roleId: req.user
                    }
                })
            }

            likeRecord.save((err) => {
                if (err) {
                    var errMsg = `Sorry, there was an error liking the post. ${err}`;
                    res.status(503).send({ message: errMsg });
                }
            });

        } catch (error) {
            return res.status(503).send();
        }

        res.status(204).send();
    },
    unlikePost: async (req, res) => {
        try {
            await models.Post.updateOne({ _id: req.body._id }, { $inc: { likesCount: -1 } });

            if (req.role == 'isStudent') {

                await models.PostLike.deleteOne(
                    {
                        postId: req.body._id,
                        role: {
                            kind: 'Student',
                            roleId: mongoose.Types.ObjectId(req.user)
                        }
                    }
                )
            }

            else if (req.role == 'isMentor') {

                await models.PostLike.deleteOne(
                    {
                        postId: req.body._id,
                        role: {
                            kind: 'Mentor',
                            roleId: mongoose.Types.ObjectId(req.user)
                        }
                    }
                )
            }

        } catch (error) {
            return res.status(503).send();
        }
        res.status(204).send();
    },
    getDetails: async (req, res) => {
        let personId = req.params.id;
        console.log("personId");

        let mentor, student;
        try {
            mentor = await models.Mentor.findById(personId).select('-isBanned -password -__v -_id').lean();
            if (!mentor) {
                student = await models.Student.findById(personId).select('-isBanned -password -__v -_id').lean();

                if (!student)
                    throw err;
                else {
                    student.isStudent = true;
                    res.status(200).send({ message: "Success", details: student });
                }

            }
            else {
                mentor.isMentor = true;
                res.status(200).send({ message: "Success", details: mentor });
            }


        } catch (err) {
            console.log(err);
            res.status(404).send({ message: "Cannot find the user!" });
        }

    },
    checkUserName: async (req, res) => {
        let username = req.body.username;
        try {
            let admin = await models.Admin.findOne({ username: username });
            if (admin)
                res.status(200).send({ message: "Success", available: false });
            else {
                let mentor = await models.Mentor.findOne({ username: username });
                if (mentor)
                    res.status(200).send({ message: "Success", available: false });
                else {
                    let student = await models.Student.findOne({ username: username });
                    if (student)
                        res.status(200).send({ message: "Success", available: false });
                    else
                        res.status(200).send({ message: "Success", available: true })
                }
            }
        } catch (err) {
            console.log(err);
            res.status(503).send({ message: "Failure" });
        }
    }
}