const models = require('../../models/brainees');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
module.exports = {
    poststatus: (req, res) => {

        let post = new models.Post({
            post: req.body.content,
            author: req.user,
        });

        post.save((err, newPost) => {
            if (err) {
                let errMsg = `Sorry, there was an error saving the post. ${err}`;
                res.status(503).send({ message: errMsg });
            }
            else {
                let successMessage = `Post was saved`;
                res.status(200).send({ message: successMessage, post: newPost });
            }
        });


    },
    getposts: async (req, res) => {
        let posts;
        let returnPosts = [];
        try {
            posts = await models.Post.find({ author: req.user }).lean();
            console.log(posts);
            if (!posts)
                throw err
        } catch (err) {
            console.log('Error in recieving posts');
            return res.status(503).send({ message: "Error in recieving posts!" });
        }
        if (posts) {
            for (let j of posts) {

                //Check for everyposts if there is a like entry in likes collection.

                let likeEntryofJ = await models.PostLike.find({ postId: mongoose.Types.ObjectId(j._id), role: { kind: 'Mentor', roleId: mongoose.Types.ObjectId(j.author) } });

                console.log("LikeEntry: " + likeEntryofJ);

                if (likeEntryofJ.length > 0)
                    j.likestate = 'unlike';
                else
                    j.likestate = 'like';

                returnPosts.push(j);
            }
        }

        res.status(200).send({ message: "Success", posts: returnPosts });

    },
    getMyStudents: async (req, res) => {
        let students = [];
        let finalStudents = [];
        try {
            //Array of objects!
            students = await models.MentorStudentSubscription.find({ mentor: req.user, isApproved: true });
            if (!students) {
                //This is possibly not an error. Done because Amgular has a way to deal with it
                throw err;
            }
        } catch (err) {
            return res.status(503).send({ message: "Error in recieving mentors!" });
        }
        try {

            for (let i of students) {
                let student = await models.Student.findById(i.student).select('-password').select('-isBanned');
                finalStudents.push(student);
            }
        } catch (error) {

        }
        console.log(finalStudents);
        res.status(201).send({ message: "Success in fetching posts!", myStudents: finalStudents });

    },
    removeStudent: async (req, res) => {
        let studentId = req.params.id;
        try {
            await models.MentorStudentSubscription.deleteOne({ student: studentId });
        } catch (error) {
            return res.status(503).send({ message: "Some error occured while removing student!" });
        }
        res.status(201).send();
    },
    newRequests: async (req, res) => {
        let students = [];
        let finalStudents = [];
        try {
            //Array of objects!
            students = await models.MentorStudentSubscription.find({ mentor: req.user, isApproved: false });
            if (!students) {
                //This is possibly not an error. Done because Amgular has a way to deal with it
                throw err;
            }
        } catch (err) {
            return res.status(503).send({ message: "Error in recieving mentors!" });
        }
        try {

            for (let i of students) {
                let student = await models.Student.findById(i.student).select('-password').select('-isBanned');
                finalStudents.push(student);
            }
        } catch (error) {

        }
        console.log(finalStudents);
        res.status(201).send({ message: "Success in fetching posts!", newRequests: finalStudents });

    },
    approveStudent: async (req, res) => {
        // Will query Subscription collection to set isApproved to true later!
        try {
            // req.user ID OF THE MENTOR
            // req.body field to be changed in mentorstudentsubscription
            await models.MentorStudentSubscription.updateOne({ mentor: req.user, student: req.body._id }, { isApproved: true });
        } catch (error) {
            return res.status(503).send();
        }
        res.status(204).send();
    },
    getMyDetails: async (req, res) => {
        let details;
        try {
            details = await models.Mentor.findById(req.user).select('-password').select('-isBanned');
            if (!details)
                throw err
        } catch (err) {
            // What if no mentors were found, I mean that's not an error, but then how to check for query error
            return res.status(503).send({ message: "Error in recieving details!" });
        }

        res.status(200).send({ message: "Success", details: details });
    },
    deletePost: async (req, res) => {
        try {
            await models.Post.deleteOne({ _id: req.params.id });
            await models.PostLike.deleteMany({ postId: req.params.id });
        } catch (error) {
            return res.status(503).send({ message: "Error in deleting post!" });
        }
        res.status(204).send();
    },
    editPost: async (req, res) => {
        //req.user (Mentor id)
        //req.params.id (Post id)
        try {
            await models.Post.updateOne({ _id: req.params.id }, { post: req.body.post, createdDate: Date.now() });
        } catch (err) {
            return res.status(503).send();
        }
        res.status(204).send();
    },
    changeDetails: async (req, res) => {
        let data = req.body;
        try {
            if (data.firstname) {
                await models.Mentor.updateOne({ _id: req.user }, { 'name.firstname': data.firstname });
            }
            else if (data.lastname) {
                await models.Mentor.updateOne({ _id: req.user }, { 'name.lastname': data.lastname });
            }
            else if (data.email) {
                await models.Mentor.updateOne({ _id: req.user }, { email: data.email });
            }
            else if (data.linkedinUrl) {
                await models.Mentor.updateOne({ _id: req.user }, { linkedinUrl: data.linkedinUrl });
            }
        } catch (err) {
            console.log(err);
            res.status(503).send({ message: "Error" });
        }
        res.status(204).send();
    },
    updatePassword: async (req, res) => {
        try {
            let password = await models.Mentor.findById(req.user).select('password');

            bcrypt.compare(req.body.current, password.password, (err, result) => {
                
                if (!result) {
                    res.status(403).send({ message: "Invalid Password" });

                }
                else if (result) {
                    bcrypt.hash(req.body.password, null, null, async (err, hashNew) => {
                        if (err)
                            res.status(503).send({ message: "Error" });

                        await models.Mentor.updateOne({ _id: req.user }, { password: hashNew });
                        res.status(200).send({ message: "Success" });
                    })
                }
            })
        } catch (err) {
            
            res.status(503).send({ message: "Error" });
        }

    }
}