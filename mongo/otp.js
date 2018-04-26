jsSHA = require("jssha");
crypto = require('crypto'),

TOTP = function () {
    var dec2hex = function (s) {
        return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
    };
    var hex2dec = function (s) {
        return parseInt(s, 16);
    };
    var leftpad = function (s, l, p) {
        if (l + 1 >= s.length) {
            s = Array(l + 1 - s.length).join(p) + s;
        }
        return s;
    };
    var base32tohex = function (base32) {
        var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        var bits = "";
        var hex = "";
        for (var i = 0; i < base32.length; i++) {
            var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
            bits += leftpad(val.toString(2), 5, '0');
        }
        for (var i = 0; i + 4 <= bits.length; i += 4) {
            var chunk = bits.substr(i, 4);
            hex = hex + parseInt(chunk, 2).toString(16);
        }
        return hex;
    };
    this.getOTP = function (secret) {
        try {
            var epoch = Math.round(new Date().getTime());
            var time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, "0");
            var shaObj = new jsSHA("SHA-512", "TEXT");
            shaObj.setHMACKey(secret + time.toString(), "TEXT");
            var hmac = shaObj.getHMAC("HEX");
            var offset = hex2dec(hmac.substring(hmac.length - 1));
            var otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec("7fffffff")) + "";
            otp = (otp).substr(otp.length - 6, 6);
        } catch (error) {
            throw error;
        }
        return otp;
    };
}
HASHING = function(){
    this.hashPassword = function (password) {
        const salt = crypto.randomBytes(32).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
        return [salt, hash].join('$');
    }
    this.verfiyHash = function (password, original) {
        const originalHash = original.split('$')[1];
        const salt = original.split('$')[0];
        const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
    
        if (hash === originalHash)
            return true;
        else
            return false;
    }
}
