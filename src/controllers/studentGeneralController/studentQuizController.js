const models = require('../../models/brainees');
const mongoose = require('mongoose');
module.exports = {
    getQuizzes: async (req, res) => {
        let quiz;
        try {
            let subscription = await models.MentorStudentSubscription.find({ student: req.user, isApproved: true });
            for (let mentor of subscription) {
                quiz = await models.Quiz.find({ author: mentor.mentor, isPublished: true }).populate('author', '-isBanned -email -password -linkedinUrl -__v').populate('category').select('-questions -isPublished -__v');
            }
            res.status(200).send({ message: "success", quizzes: quiz });
        } catch (err) {
            console.log("Sorry an error occured while fetching quizzes!" + err);
            res.status(503).send({ message: "Error" });
        }

    },
    activateTest: async (req, res) => {
        let quizId = req.params.id;
        let question;
        try {
            let quiz = await models.Analytics.findOne({ quiz: quizId, student: req.user, completed: false });
            if (quiz) {
                //Send quiz.questions.length along with a question
                if (quiz.questions.length < 20) {
                    let quizDetails = await models.Quiz.findById(quizId).select('questions');
                    question = await models.Question.findById(quizDetails.questions[quiz.questions.length]).populate('answers', '-isCorrect -__v').select('-__v');
                }
                else
                    throw err
            }
            else {
                //Make the quiz
                let entry = new models.Analytics({
                    student: req.user,
                    quiz: quizId,
                })
                await entry.save(err => {
                    if (err)
                        throw err;
                })
                let quizDetails = await models.Quiz.findById(quizId).populate('category', '-_id -__v').select('-_id -isPublished');
                question = await models.Question.findById(quizDetails.questions[0]).populate('answers', '-isCorrect -__v');

            }
        } catch (err) {
            console.log(`Error while activating the quiz! ${err}`);
            res.status(503).send({ message: "Error" });
        }
        res.status(201).send({ message: "Success", question: question });
    },
    attendedQuizzes: async (req, res) => {
        let myQuizzes;
        try {
            myQuizzes = await models.Analytics.find({ student: req.user }).select('-questions -score -student -_id -__v');
        } catch (err) {
            console.log(`Error ${err}`);
            res.status(503).send({ message: "Error" });
        }
        res.status(200).send({ message: "Success", myQuizzes: myQuizzes });
    },
    checkResponse: async (req, res) => {
        let quesId = req.body.questionId;
        let answerId = req.body.answerId;
        let answer, question, correctAnswer;

        try {
            answer = await models.Answer.findById(answerId);
            question = await models.Question.findById(quesId).populate('answers', '-__v');

            await models.Analytics.update({ student: req.user, quiz: req.body.quizId },
                { $push: { questions: { question: quesId, response: answerId } } });
            
            if (answer.isCorrect == true)
                await models.Analytics.update({ student: req.user, quiz: req.body.quizId },
                    { $inc: { score:1 } });
            else
                await models.Analytics.update({ student: req.user, quiz: req.body.quizId },
                    { $inc: { score:-1 } });  
            
            question.answers.forEach(e => {
                if (e.isCorrect == true)
                    correctAnswer = e;
            });

        } catch (err) {
            console.log(err);
            res.status(503).send({ message: "Error" })
        }

        res.status(200).send({ message: "Success", isCorrect: answer.isCorrect, correctAnswer: correctAnswer });
    },
    nextQuestion: async (req, res) => {
        let quizId = req.params.id;
        let question;
        try {
            let quiz = await models.Analytics.findOne({ quiz: quizId, student: req.user, completed: false });

            //Send quiz.questions.length along with a question
            if (quiz.questions.length < 20) {
                let quizDetails = await models.Quiz.findById(quizId).select('questions');
                question = await models.Question.findById(quizDetails.questions[quiz.questions.length]).populate('answers', '-isCorrect -__v').select('-__v');
            }
            else{
                await models.Analytics.update({ student: req.user, quiz: quizId },{ completed:true });
                let score = await models.Analytics.findOne({student: req.user, quiz: quizId,completed:true}).select('-student -quiz -completed -questions -_id -__v');
                res.status(200).send({message:"Success",completed:true,score:score});
            }
                

        } catch (err) {
            console.log(`Error while activating the quiz! ${err}`);
            res.status(503).send({ message: "Error" });
        }
        res.status(200).send({ message: "Success", question: question });
    },
    completedQuiz: async (req,res) => {
        let completedQuizzes=[];
        try {
            let cquiz = await models.Analytics.find({student:req.user,completed:true}).select('-__v -student -completed -questions -_id');
            console.log(cquiz);
            
            for(let e of cquiz){
                let quiz = await models.Quiz.findById(e.quiz).populate('category','-_id -__v').populate('author','-email -isBanned -password  -__v').select('-__v -questions -isPublished -_id').lean();
                
                if(quiz){
                    quiz.score = e.score;
                    quiz._id = e.quiz;
                    completedQuizzes.push(quiz);
                }
                    
            }
            console.log(completedQuizzes);
            
        } catch (err) {
            console.log(err);
            res.status(503).send({message:"Error"});
        }
        res.status(200).send({message:"Success",completedQuiz:completedQuizzes})
        
    },
    getAnalysedQuestion: async (req,res)=>{
        let quizId = req.params.id;
        let questions=[];
        try {
            let quiz = await models.Analytics.findOne({student:req.user,quiz:quizId,completed:true}).select('-student -quiz -completed -_id -__v').populate('questions','-_id');
            
            for(let e of quiz.questions){
                let ques = await models.Question.findById(e.question).select('-_id -__v').populate('answers','-_id -__v').lean();
                console.log(ques.answers);
                
                let ans=await models.Answer.findById(e.response).select('-_id -__v');
                ques.response = ans;
                questions.push(ques);
                
            }  
        } catch (err) {
            console.log(`Error ${err}`);
            res.status(503).send({message:"Error"});
        }
        res.status(200).send({message:"Success",questions:questions});
    }
}