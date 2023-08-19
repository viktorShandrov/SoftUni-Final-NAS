const jwt = require("jsonwebtoken")
const util = require('util');
exports.sign = util.promisify(jwt.sign)
exports.verify = util.promisify(jwt.verify)

exports.secret = "kjsdhgLKJGHDLKJGHkljhlkjhh43iu4h8osioduhfis"
exports.googleClientId = "341272107557-fp6lu6llorj0912vt59nj8j4mrstekst.apps.googleusercontent.com"