const
    tableDB = 'azmoon_base',
    express = require('express'),
    router = express.Router();
const RSA_PRIVATE_KEY = fs.readFileSync('./security/monosisgroup-user.key');
//---------------------------------------
router.get('/login/:username/:password/login', (req, res) => {
    req.app.db.collection(tableDB).find({
        $and:
            [
                { teacher_code: { $exists: true } },
                { teacher_username: req.params.username },
                { teacher_password: req.params.password }
            ]
    }).toArray((err, data) => {
        if (err) {
            res.sendStatus(401);
        } else {
            if (data.length > 0) {
                token_value = {username: data[0].teacher_username}
                value = {
                    teacher_code: data[0].teacher_code,
                    teacher_sex: data[0].teacher_sex,
                    teacher_name: data[0].teacher_name,
                    teacher_study: data[0].teacher_study,
                    teacher_school: data[0].teacher_school,
                    teacher_degree: data[0].teacher_degree,
                    teacher_mobile: data[0].teacher_mobile,
                    teacher_email: data[0].teacher_email,
                    teacher_pic: data[0].teacher_pic,
                    teacher_rank: data[0].teacher_rank,
                    teacher_sabeghe: data[0].teacher_sabeghe,
                    teacher_username: data[0].teacher_username,
                    teacher_role: data[0].teacher_role,
                    teacher_account: data[0].teacher_account,
                    teacher_card: data[0].teacher_card,
                    isEnable: data[0].isEnable,
                    isAdmin: data[0].isAdmin,
                    balance: data[0].balance,
                }
                const token = jwt.sign({}, RSA_PRIVATE_KEY, {
                    algorithm: 'RS256',
                    expiresIn: "7d",
                    subject: JSON.stringify(token_value)
                });
                res.status(200).json({
                    idToken: token,
                    expiresIn: "7d",
                    value: value
                });
            } else {
                res.json('Unauthorized')
            }
        }
    })
})
//---------------------------------------
module.exports = router