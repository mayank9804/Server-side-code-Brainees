const models = require('../../models/brainees');
const mongoose = require('mongoose');
module.exports = {
    getUnpublishedQuiz: async (req, res) => {
        let uQuiz;
        try {
            await models.Quiz.find({ author: req.user, isPublished: false }).populate('questions[0]')
                .populate('category')
                .exec(function (err, data) {
                    if (err)
                        throw err;
                    console.log(data);
                    uQuiz = data;
                    res.status(200).send({ message: "Success", unpublishedQuiz: uQuiz });
                })

        } catch (err) {
            console.log('Error in recieving unpublished quizzes');
            return res.status(503).send({ message: "Error in recieving unpublished quizzes" });
        }
    },
    setQuiz: (req, res) => {
        let entryQuiz;
        try {
            entryQuiz = new models.Quiz({
                name: req.body.quizName,
                category: mongoose.Types.ObjectId(req.body.categoryName),
                level: req.body.level,
                description: req.body.description,
                author: req.user
            })
            entryQuiz.save((err, entryQuiz) => {
                if (err) {
                    throw err;
                }
                else {
                    let successMessage = `Quiz was created`;
                    res.status(200).send({ message: successMessage, quizDetails: entryQuiz });
                }
            })
        } catch (error) {
            let errMsg = `Sorry, there was an error creating the quiz. ${err}`;
            res.status(503).send({ message: errMsg });
        }
    },
    getCategories: (req, res) => {
        try {
            models.QuizCategory.find((err, categories) => {
                if (err)
                    throw err;
                res.status(200).send({ message: "Success", categories: categories });
            })
        } catch (error) {
            res.status(503).send({ message: "Error" })
        }
    },
    pushQuestion: (req, res) => {
        let question;
        try {
            // req.body.correctOption
            let answersId = [];
            let answers = [];
            let correctOption = req.body.question.correctOption;
            let counter = 0;
            Object.keys(req.body.question).map(e => {
                let answer;
                if (e[e.length - 1] == correctOption) {
                    answer = new models.Answer({
                        answerText: req.body.question[e],
                        isCorrect: true
                    })
                    answers.push(answer);
                }
                else if (e != 'question' && e != 'correctOption') {
                    answer = new models.Answer({
                        answerText: req.body.question[e],
                        isCorrect: false
                    })
                    answers.push(answer);
                }
            });

            async function saveAnswer(i) {
                let a = await i.save();
                answersId.push(a._id);
                counter += 1;
                if (counter == answers.length) {
                    saveQuestion();
                }
            }
            //You have an array with answers which needs to be saved in db
            // Each iteration 
            (async function () {
                for (let i of answers) {
                    await saveAnswer(i);
                }
            })();

            async function saveQuestion() {
                question = new models.Question({
                    questionText: req.body.question.question,
                    answers: answersId
                })

                await question.save((err, entryQuiz) => {
                    if (err)
                        throw err;

                    models.Quiz.update({ _id: mongoose.Types.ObjectId(req.body.quizId) }, { $push: { questions: entryQuiz._id } }, () => {
                        console.log("Quiz Modified");
                        models.Quiz.findOne({ _id: mongoose.Types.ObjectId(req.body.quizId) }, (err, modifiedQuiz) => {
                            let successMessage = `Quiz was modified`;
                            res.status(200).send({ message: successMessage, modifiedQuiz: modifiedQuiz });
                        });
                    });
                });
            }
        } catch (err) {
            let errMsg = `Sorry, there was an error creating the quiz. ${err}`;
            console.log(errMsg);
            res.status(503).send({ message: errMsg });
        }
    },
    updateQuestion: async (req, res) => {
        try {
            let quesId = req.body.questionId;
            //Question updated
            await models.Question.update({ _id: quesId }, { questionText: req.body.question.question });
            //Time for answer to update
            let correctOption = req.body.question.correctOption;
            let j = 0;
            for (let i of req.body.answerId) {
                await models.Answer.update({ _id: mongoose.Types.ObjectId(i) }, { answerText: req.body.answers[j], isCorrect: false });
                j += 1;
            }

            if (correctOption == 'A')
                correctOption = 0
            else if (correctOption == 'B')
                correctOption = 1
            else if (correctOption == 'C')
                correctOption = 2
            else if (correctOption == 'D')
                correctOption = 3

            await models.Answer.update({ _id: mongoose.Types.ObjectId(req.body.answerId[correctOption]) }, { isCorrect: true });
            res.status(204).send();

        } catch (error) {
            res.status(503).send({ "message": "Error" });
        }
    },
    getQuiz: async (req, res) => {
        quizId = req.params.id;
        let quiz;
        try {
            quiz = await models.Quiz.findById(quizId);
        } catch (error) {
            res.status(503).send({ error: "Error in recieving quiz" });
        }
        res.status(200).send({ success: "Success", quiz: quiz });
    },
    // Deep population
    deleteQuiz: async (req, res) => {
        let quizId = req.params.id;
        try {
            let query = await models.Quiz.findById(quizId);
            for (let e of query.questions) {
                let question = await models.Question.findById(e);
                for (v of question.answers) {
                    await models.Answer.deleteOne({ _id: v });
                }
                await models.Question.deleteOne({ _id: e });
            }
            await models.Quiz.deleteOne({ _id: query });

        } catch (error) {
            res.status(503).send({ error: "Error in recieving quiz" });
        }
        res.status(204).send();
    },
    getQuestionWithAnswers: async (req, res) => {
        let questionId = req.params.id;
        let question;
        try {
            await models.Question.findById(questionId).populate('answers')
                .exec(function (err, data) {
                    if (err)
                        throw err
                    let correctOption;

                    data.answers.forEach((e, index) => {
                        if (Boolean(e.isCorrect) == true) {
                            correctOption = index;
                        }
                    })
                    if (correctOption == 0)
                        correctOption = 'A'
                    else if (correctOption == 1)
                        correctOption = 'B'
                    else if (correctOption == 2)
                        correctOption = 'C'
                    else if (correctOption == 3)
                        correctOption = 'D'
                    else
                        correctOption = null;

                    question = {
                        question: data.questionText,
                        answerA: data.answers[0].answerText,
                        answerB: data.answers[1].answerText,
                        answerC: data.answers[2].answerText,
                        answerD: data.answers[3].answerText,
                        correctOption: correctOption
                    }

                    console.log(question);
                    res.status(200).send({ message: "Success", question: question, additional: data });
                })
        } catch (error) {
            res.status(503).send({ error: "Error in recieving questions" });
        }

    },
    publishQuiz: async (req, res) => {
        try {

            await models.Quiz.updateOne({ _id: (req.body.id) }, { isPublished: true });
        } catch (err) {
            console.log(err);
            res.status(503).send({ message: "Error" });
        }
        res.status(204).send();
    },
    getPublishedQuiz: async (req, res) => {
        let uQuiz;
        try {
            await models.Quiz.find({ author: req.user, isPublished: true }).populate('questions[0]')
                .populate('category')
                .exec(function (err, data) {
                    if (err)
                        throw err;
                    console.log(data);
                    uQuiz = data;
                    res.status(200).send({ message: "Success", publishedQuiz: uQuiz });
                })

        } catch (err) {
            console.log('Error in recieving unpublished quizzes');
            return res.status(503).send({ message: "Error in recieving published quizzes" });
        }

    }
}