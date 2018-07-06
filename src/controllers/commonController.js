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
                    postId : req.body._id,
                    role: {
                        kind: 'Student',
                        roleId: req.user
                    }
                })
            }
            else if (req.role == 'isMentor') {
                var likeRecord = new models.PostLike({
                    postId : req.body._id,
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

            if(req.role=='isStudent'){
                
                await models.PostLike.deleteOne(
                    {
                        postId:req.body._id,
                        role:{
                            kind:'Student',
                            roleId:mongoose.Types.ObjectId(req.user)
                        }
                    }
                )
            }

            else if(req.role=='isMentor'){
                
                await models.PostLike.deleteOne(
                    {
                        postId:req.body._id,
                        role:{
                            kind:'Mentor',
                            roleId:mongoose.Types.ObjectId(req.user)
                        }
                    }
                )
            }
                
        } catch (error) {
            return res.status(503).send();
        }
        res.status(204).send();
    }
}