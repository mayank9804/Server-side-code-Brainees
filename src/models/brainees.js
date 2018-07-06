const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const StudentSchema = new Schema({
    name: {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true }
    },
    email: { type: String, required: true },
    isBanned: { type: Boolean, default: false },
    username: { type: String, required: true },
    password: { type: String, required: true }
});

const MentorSchema = new Schema({
    name: {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true }
    },
    email: { type: String, required: true },
    isBanned: { type: Boolean, default: false },
    username: { type: String, required: true },
    password: { type: String, required: true },
    linkedinUrl: { type: String, required: true }
});

StudentSchema.pre('save', function (next) {
    let user = this;
    bcrypt.hash(user.password, null, null, (err, hash) => {
        if (err)
            return next(err);

        user.password = hash;
        next();

    })
});

MentorSchema.pre('save', function (next) {
    let user = this;
    bcrypt.hash(user.password, null, null, (err, hash) => {
        if (err)
            return next(err);

        user.password = hash;
        next();
    })
});

const PostSchema = new Schema({
    post: { type: String, required: true },
    createdDate: { type: Date, default: Date.now() },
    likesCount: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: 'Mentor' }
})

const mentorStudentSubscriptionSchema = new Schema({
    student: {type:Schema.Types.ObjectId,ref:'Student'},
    mentor: {type:Schema.Types.ObjectId,ref:'Mentor'},
    isApproved: {type:Boolean,default:false}
})

const PostLikesSchema = new Schema({
    postId : {type:Schema.Types.ObjectId,ref:'Post'},
    role : { 
        kind:String, 
        roleId:{type:Schema.Types.ObjectId,refPath:'role.kind'}
    }
})

let Student = mongoose.model('Student', StudentSchema);
let Mentor = mongoose.model('Mentor', MentorSchema);
let Post = mongoose.model('Post', PostSchema);
let MentorStudentSubscription = mongoose.model('MentorStudentSubscription',mentorStudentSubscriptionSchema);
let PostLike = mongoose.model('PostLike',PostLikesSchema);

module.exports = {
    Student: Student,
    Mentor: Mentor,
    Post: Post,
    MentorStudentSubscription:MentorStudentSubscription,
    PostLike:PostLike
}