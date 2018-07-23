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

const AdminSchema = new Schema({
    name: {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true }
    },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },

})

const PostSchema = new Schema({
    post: { type: String, required: true },
    createdDate: { type: Date, default: Date.now() },
    likesCount: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: 'Mentor' }
})

const mentorStudentSubscriptionSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
    mentor: { type: Schema.Types.ObjectId, ref: 'Mentor' },
    isApproved: { type: Boolean, default: false }
})
// dynammic referneces
const PostLikesSchema = new Schema({
    postId: { type: Schema.Types.ObjectId, ref: 'Post' },
    role: {
        kind: String,
        roleId: { type: Schema.Types.ObjectId, refPath: 'role.kind' }
    }
})

const quizCategorySchema = new Schema({
    name: { type: String, required: true }
})

const answerSchema = new Schema({
    answerText: { type: String, required: true },
    isCorrect: { type: Boolean, required: true, default: false }

})

const questionSchema = new Schema({
    questionText: { type: String },
    answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }]
})

const quizSchema = new Schema({
    name: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'QuizCategory' },
    level: { type: String, required: true },
    rating: { type: Number, default: 0, required: true },
    description: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'Mentor', required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    isPublished: { type: Boolean, required: true, default: false }
})

const analyticsSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    completed: { type: Boolean, default: false, required: true },
    score: { type: Number, default: 0, required: true },
    questions: [
        {
            question: { type: Schema.Types.ObjectId, ref: 'Question' },
            response: { type: Schema.Types.ObjectId, ref: 'Answer' },
        }
    ]
})

// Pre hooks
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

// Models
let Student = mongoose.model('Student', StudentSchema);
let Mentor = mongoose.model('Mentor', MentorSchema);
let Post = mongoose.model('Post', PostSchema);
let MentorStudentSubscription = mongoose.model('MentorStudentSubscription', mentorStudentSubscriptionSchema);
let PostLike = mongoose.model('PostLike', PostLikesSchema);
let Quiz = mongoose.model('Quiz', quizSchema);
let QuizCategory = mongoose.model('QuizCategory', quizCategorySchema);
let Question = mongoose.model('Question', questionSchema);
let Answer = mongoose.model('Answer', answerSchema);
let Analytics = mongoose.model('Analytics', analyticsSchema);
let Admin = mongoose.model('admin',AdminSchema)
//Exports
module.exports = {
    Student: Student,
    Mentor: Mentor,
    Post: Post,
    MentorStudentSubscription: MentorStudentSubscription,
    PostLike: PostLike,
    Quiz: Quiz,
    QuizCategory: QuizCategory,
    Question: Question,
    Answer: Answer,
    Analytics: Analytics,
    Admin:Admin
}