Kavenegar = require('kavenegar');
const RSA_PRIVATE_KEY = fs.readFileSync('./security/monosisgroup-user.key');
const RSA_PUBLIC_KEY = fs.readFileSync('./security/monosisgroup-user.crt');
//----------------------------------------------
middleware = {
    generate_secrity_code: function (req, res, next) {
        var totpObj = new TOTP();
        var otp = totpObj.getOTP(req.params.mobile);
        //var api = Kavenegar.KavenegarApi({ apikey: '726B41576C52307950384F6946555A4F787838674D55744543534E50684A6A4D' });
        // api.VerifyLookup({
        //     receptor: "09163069302",
        //     token: otp,
        //     template: "security"
        // }, function (response, status) {
        //     if(status == 200) req.body.scode = otp;
        //     else req.body.scode = '000000';
        //     next();
        // });
        req.body.scode = otp;
        next();
    },
    hashing: function (req, res, next) {
        var hashing = new HASHING();
        req.body.hashcode = hashing.hashPassword(req.body.scode);
        next();
    },
    hashPWD: function (req, res, next) {
        var hashing = new HASHING();
        if (!req.body.flagUpdate) {
            req.body.passwordHash = hashing.hashPassword(req.body.password);
            next();
        }
        else {
            req.body.passwordHash = req.body.passwordHash;
            next();
        }
    },
    sessionToken: function (data) {
        token_value = { user_id: data.insertedIds[0] }
        return jwt.sign({ token_value }, RSA_PRIVATE_KEY, {
            algorithm: 'RS256',
            expiresIn: "7d",
            subject: JSON.stringify(token_value)
        });
    },
    sessionTokenUpdate: function (data) {
        token_value = { user_id: data._id }
        return jwt.sign({ token_value }, RSA_PRIVATE_KEY, {
            algorithm: 'RS256',
            expiresIn: "7d",
            subject: JSON.stringify(token_value)
        });
    },
    verifyToken: function (req, res, next) {
        jwt.verify(req.get('Authorization'), RSA_PUBLIC_KEY, (err, res) => {
            if (err) {
                req.body.decode = false;
            } else {
                req.body.decode = true;
            }
        });
        next();
    },
    verifyPassword: function (password, hash) {
        var hashing = new HASHING();
        return hashing.verfiyHash(password, hash);
    }
}