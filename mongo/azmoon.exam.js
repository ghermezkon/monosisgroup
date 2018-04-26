const
    tableDB = 'azmoon_exam',
    express = require('express'),
    _objectId = require('mongodb').ObjectID,
    router = express.Router();
//------------------------------------------------------------
router
    .get('/exam/:exam_name', (req, res) => {
        req.app.db.collection(tableDB).find({'exam_name': req.params.exam_name}).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/exam_validate_for_update/:exam_id/:exam_name', (req, res) => {
        req.app.db.collection(tableDB).find({
            $and: [{ 'exam_name': req.params.exam_name }, { _id: { $ne: _objectId(req.params.exam_id) } }]
        }).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/exam_find_by_teacher_name/:exam_teacher', (req, res) => {
        req.app.db.collection(tableDB).find({ exam_teacher: req.params.exam_teacher }).toArray((err, data) => {
            res.json(data);
        })
    })
    .post('/exam', (req, res) => {
        req.app.db.collection(tableDB).insert(req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                res.end();
            }
        });
    })
    .put('/exam', (req, res) => {
        let _id = req.body._id;
        delete req.body._id;
        req.app.db.collection(tableDB).update({ _id: _objectId(_id) }, req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                res.end();
            }
        })
    })

//-------------------------------------------------------------
module.exports = router