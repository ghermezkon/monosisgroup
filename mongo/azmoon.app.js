const
    express = require('express'),
    router = express.Router(),
    _objectId = require('mongodb').ObjectID,
    Request = require("request");
require('./otp')
require('./middleware')
//--------------------------------------
router
    .get('/find_teacher_for_app/:study', (req, res) => {
        req.app.db.collection('azmoon_base').aggregate([
            {
                $match: {
                    $and: [
                        { teacher_code: { $exists: true } },
                        { teacher_study: req.params.study }
                    ]
                }
            }, {
                $project: {
                    teacher_name: 1, teacher_pic: 1, teacher_rank: 1, teacher_school: 1, teacher_study: 1, _id: 1
                }
            },
        ]).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/find_exam_lesson_by_teacher_name/:exam_teacher/:student_id', (req, res) => {
        req.app.db.collection('azmoon_exam').aggregate([
            {
                $lookup: {
                    from: 'azmoon_app',
                    let: { exam_id1: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$exam_id', '$$exam_id1'] },
                                        { $eq: ['$student_id', _objectId(req.params.student_id)] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'result_exam'
                }
            },
            { $match: { $and: [{ 'isEnable': true }, { 'isAdmin': true }, { 'exam_teacher': req.params.exam_teacher }, { 'result_exam': { $size: 0 } }] } },
            {
                $group:
                    {
                        _id: { exam_study: '$exam_study', exam_lesson: '$exam_lesson', exam_lesson_detail: '$exam_lesson_detail' },
                        count: { $sum: 1 }
                    },
            },
            {
                $sort: { '_id.exam_lesson': 1 }
            }
        ]).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/find_exam_list_by_lesson_name/:exam_lesson/:exam_teacher/:student_id', (req, res) => {
        req.app.db.collection('azmoon_exam').aggregate([
            // {
            //     $match: {
            //         $and: [{ 'isEnable': true }, { 'isAdmin': true },
            //         { 'exam_teacher': req.params.exam_teacher }, { 'exam_lesson': req.params.exam_lesson }]
            //     }
            // },
            // {
            //     $project: {
            //         exam_name: 1, exam_time: 1, last_update_long: 1, last_update_short: 1, exam_price: 1, exam_level: 1, numberOfQuestion: { $size: '$exam_questions' }
            //     }
            // },
            // {
            //     $sort: { 'last_update_short': -1 }
            // }
            {
                $lookup: {
                    from: 'azmoon_app',
                    let: { exam_id1: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$exam_id', '$$exam_id1'] },
                                        { $eq: ['$student_id', _objectId(req.params.student_id)] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'result_exam'
                }
            },
            {
                $match: {
                    $and: [
                        { 'isEnable': true }, { 'isAdmin': true },
                        { 'exam_teacher': req.params.exam_teacher }, { 'exam_lesson': req.params.exam_lesson },
                        { 'result_exam': { $size: 0 } }]
                }
            },
            {
                $project: {
                    exam_name: 1, exam_time: 1, last_update_long: 1, last_update_short: 1, exam_price: 1, exam_level: 1, numberOfQuestion: { $size: '$exam_questions' }
                }
            }
        ]).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/find_exam_by_id/:_id', (req, res) => {
        req.app.db.collection('azmoon_exam').find({ _id: _objectId(req.params._id) },
            {
                fields: {
                    'exam_questions.question_number': 1,
                    'exam_questions.question_text': 1,
                    'exam_questions.question_grade': 1,
                    'exam_questions.answerOne_text': 1,
                    'exam_questions.answerTwo_text': 1,
                    'exam_questions.answerThree_text': 1,
                    'exam_questions.answerFour_text': 1,
                    'exam_questions.answerOne_image': 1,
                    'exam_questions.answerTwo_image': 1,
                    'exam_questions.answerThree_image': 1,
                    'exam_questions.answerFour_image': 1
                }
            }).toArray((err, data) => {
                res.json(data);
            })
    })
    .get('/find_score_by_exam_id/:_id', (req, res) => {
        req.app.db.collection('azmoon_exam').find({ _id: _objectId(req.params._id) },
            {
                fields: {
                    'exam_questions.question_number': 1,
                    'exam_questions.answer_fine': 1,
                    'exam_questions.question_grade': 1
                }
            }).toArray((err, data) => {
                res.json(data);
            })
    })
    .get('/find_student_exam_list/:id', (req, res) => {
        req.app.db.collection('azmoon_exam').aggregate([
            {
                $lookup: {
                    from: 'azmoon_app',
                    let: { exam_id1: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$exam_id', '$$exam_id1'] },
                                        { $eq: ['$student_id', _objectId(req.params.id)] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'result_exam'
                }
            },
            { $match: { $and: [{ 'isEnable': true }, { 'isAdmin': true }, { 'result_exam': { $size: 1 } }] } },
            {
                $project: {
                    exam_name: 1, exam_teacher: 1, exam_study: 1, exam_lesson: 1, exam_price: 1, exam_level: 1, result_exam: 1, _id: 1
                }
            }
        ]).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/find_student_exam_detail/:exam_id/:id', (req, res) => {
        req.app.db.collection('azmoon_exam').aggregate([
            {
                $lookup: {
                    from: 'azmoon_app',
                    let: { exam_id1: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$exam_id', '$$exam_id1'] },
                                        { $eq: ['$student_id', _objectId(req.params.id)] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'result_exam'
                }
            },
            { $match: { $and: [{ 'isEnable': true }, { 'isAdmin': true }, { 'result_exam': { $size: 1 } }, { _id: _objectId(req.params.exam_id) }] } },
            {
                $project: {
                    exam_questions: 1, result_exam: 1, exam_name: 1, _id: 1
                }
            }
        ]).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/check_payment/:kharid_number', (req, res) => {
        req.app.db.collection('azmoon_payment').find({ $and: [{ 'State': 'OK' }, { 'StateCode': '0' }, { 'kharid_number': req.params.kharid_number }] },
            {
                fields: { 'TRACENO': 1 }
            }).toArray((err, data) => {
                res.json(data);
            })
    })
    .get('/check_payment_for_teacher/:kharid_number/:teacher_code', (req, res) => {
        req.app.db.collection('azmoon_payment_teacher').find({ $and: [{ 'kharid_number': req.params.kharid_number }, { 'teacher_code': req.params.teacher_code }] })
            .count((err, data) => {
                res.json(data);
            })
    })
    .get('/find_user_payment/:student_id', (req, res) => {
        req.app.db.collection('azmoon_payment').aggregate([
            { $match: { student_id: _objectId(req.params.student_id) } },
            {
                $lookup: {
                    from: 'azmoon_exam',
                    localField: 'exam_id',
                    foreignField: '_id',
                    as: 'exam_detail'
                }
            },
            { $unwind: '$exam_detail' },
            {
                $project: {
                    State: 1, StateCode: 1, TRACENO: 1, Amount: 1, kharid_date: 1, exam_name: '$exam_detail.exam_name', exam_teacher: '$exam_detail.exam_teacher'
                }
            }
        ]).toArray((err, data) => {
            res.json(data);
        })
    })
    //---------------------------------------
    .post('/result_exam', (req, res) => {
        req.body.exam_id = _objectId(req.body.exam_id)
        req.body.student_id = _objectId(req.body.student_id)
        req.body.user_exam_date = new Date();
        req.app.db.collection('azmoon_app').insertOne(req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.status(200).json(data);
                res.end();
            }
        });
    })
    .put('/result_exam', (req, res) => {
        req.body.exam_id = _objectId(req.body.exam_id)
        req.body.student_id = _objectId(req.body.student_id)
        req.body.user_exam_date = new Date();

        req.app.db.collection('azmoon_app').update({ $and: [{ exam_id: req.body.exam_id }, { student_id: req.body.student_id }] }, req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.status(200).json(data);
                res.end();
            }
        });
    })
    .post('/save_payment_for_teacher', (req, res) => {
        req.body.exam_id = _objectId(req.body.exam_id)
        req.body.student_id = _objectId(req.body.student_id)
        
        req.app.db.collection('azmoon_payment_teacher').insertOne(req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.status(200).json(data);
                res.end();
            }
        });
    })
    .post('/save_shekayat', (req, res) => {
        var ip_address;
        let urlEncodedData = 'secret=6LdGAy8UAAAAABjaPrCn-7skOHm49J849p0uBBPb&response=' + req.body.captchaResponse + '&remoteip=' + req.connection.remoteAddress;
        ip_address = req.connection.remoteAddress;
        Request.post({
            "headers": { "Content-Type": "application/x-www-form-urlencoded" },
            "url": "https://www.google.com/recaptcha/api/siteverify",
            "body": urlEncodedData
        }, (error, response, body) => {
            if (error) {
                res.send(err);
            } else {
                delete req.body.captchaResponse;
                req.body.id_address = ip_address;
                req.app.db.collection('azmoon_shekayat').insertOne(req.body, (err, data) => {
                    if (err) {
                        res.send(err);
                    } else {
                        res.status(200).json(data);
                        res.end();
                    }
                })
            }
        });

    });
//---------------------------------------
module.exports = router