const models = require('../../models/brainees');
const mongoose = require('mongoose');

module.exports = {
    //  student/general/browsementors
    browsementors: async (req, res) => {
        let mentors;
        let finalMentors = [];
        try {
            mentors = await models.Mentor.find({}).select('-password').select('-__v').select('-isBanned');

            if (!mentors)
                throw err

            for (i of mentors) {
                console.log((await models.MentorStudentSubscription.find({ mentor: i._id })).length);
                if ((await models.MentorStudentSubscription.find({ mentor: i._id })).length != 0) { }
                else {
                    console.log(i);
                    finalMentors.push(i);
                }
            }
        } catch (err) {
            console.log('Error in recieving mentors');
            return res.status(503).send({ message: "Error in recieving mentors!" });
        }

        //Demo Resolvers
        await setTimeout(() => {
            res.status(200).send({ message: "Success", mentors: finalMentors })
        }
            , 3000);

    },
    //  student/general/subscribementor
    subscribementor: async (req, res) => {
        //req.body._id has mentors id
        if (!req.body._id) {
            var errMsg = `Sorry, there was an error subscribing the mentor. ${err}`;
            res.status(503).send({ message: errMsg });
        }
        let entry = new models.MentorStudentSubscription({
            student: req.user,
            mentor: req.body._id
        })

        entry.save(async (err, subscription) => {
            if (err) {
                var errMsg = `Sorry, there was an error subscribing the mentor. ${err}`;
                res.status(503).send({ message: errMsg });
            }
            else {
                let successMessage = `Mentor Subscribed`;
                //Find mentor here
                res.status(201).send({ message: successMessage });
            }
        });
    },
    //  student/general/getmymentors
    getMyMentors: async (req, res) => {
        let mentors;
        try {
            mentors = await models.MentorStudentSubscription.find({ student: req.user, isApproved: true }).select('-student');
            if (!mentors)
                throw err
        } catch (err) {
            // What if no mentors were found, I mean that's not an error, but then how to check for query error
            return res.status(503).send({ message: "Error in recieving mentors!" });
        }
        let returnMentors = [];
        for (mentor of mentors) {
            let xd = await models.Mentor.findById(mentor.mentor).select('-password').select('-__v').select('-isBanned');

            returnMentors.push(xd);
        }
        res.status(201).send({ message: "Success", mentors: returnMentors });
    },

    unSubscribeMentor: async (req, res) => {
        let mentorId = req.params.id;
        let studentId = req.user;

        try {
            await models.MentorStudentSubscription.deleteOne({ mentor: mentorId, student: studentId });

        } catch (err) {
            return res.status(503).send({ message: "Some error occured while unsubscribing mentor!" });
        }

        res.status(201).send();
    },

    //Home Component
    getMyPosts: async (req, res) => {
        let mentors;
        let posts = [];
        try {
            //Array of objects!
            mentors = await models.MentorStudentSubscription.find({ student: req.user });
            if (!mentors) {
                //This is possibly not an error. Done because Amgular has a way to deal with it
                throw err;
            }
        } catch (err) {
            return res.status(503).send({ message: "Error in recieving mentors!" });
        }
        console.log("Mentors: " + mentors);
        try {
            console.log("Posts: ");
            for (let i of mentors) {
                let mentorName = await models.Mentor.findById(i.mentor).select('name');
                console.log(mentorName);
                let postPerMentor = await models.Post.find({ author: i.mentor }).lean();

                if (postPerMentor) {
                    for (let j of postPerMentor) {

                        //Check for everyposts if there is a like entry in likes collection.

                        let likeEntryofJ = await models.PostLike.find(
                            {
                                postId: mongoose.Types.ObjectId(j._id),
                                role: {
                                    kind: 'Student',
                                    roleId: mongoose.Types.ObjectId(req.user)
                                }
                            }
                        );

                        console.log("LikeEntry: " + likeEntryofJ);

                        if (likeEntryofJ.length > 0)
                            j.likestate = 'unlike';
                        else
                            j.likestate = 'like';

                        j.name = mentorName.name;

                        posts.push(j);
                    }
                }

            }
            //Fetched all posts of mentor to which a student is subscribed to
        } catch (error) {

        }
        console.log(posts);

        res.status(201).send({ message: "Success in fetching posts!", posts: posts });
    },

    //Settings Component
    getMyDetails: async (req, res) => {
        let details;
        try {
            details = await models.Student.findById(req.user).select('-password').select('-isBanned');
            if (!details)
                throw err
        } catch (err) {
            // What if no mentors were found, I mean that's not an error, but then how to check for query error
            return res.status(503).send({ message: "Error in recieving details!" });
        }
        
        res.status(200).send({ message: "Success", details: details });
    }
}