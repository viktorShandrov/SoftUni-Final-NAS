const jwt = require("jsonwebtoken")
const util = require('util');
const path = require("path");
exports.sign = util.promisify(jwt.sign)
exports.verify = util.promisify(jwt.verify)
exports.admins = [
    "64be708f6849088b65a14498"
]
//levels: 
//3:Critical - the data base is going to be shutted down
//2:Information about your account
//1:"Service info - Change of policies"
exports.notifications = [
      {
        text:"Your storage is running low",
        level:2
      },
]
exports.secret = "kjsdhgLKJGHDLKJGHkljhlkjhh43iu4h8osioduhfis"
exports.googleClientId = "341272107557-fp6lu6llorj0912vt59nj8j4mrstekst.apps.googleusercontent.com"
exports.stripeSecret="whsec_d59df066433e3aee1d167b7b8fd416019540874de9d7a18d65926058046b075d"
exports.stripeSecretKey="sk_test_51MVy7FHWjRJobyftLPhg8KC5HmzfnRDipJQtsFebHEwGW40AdzYcJMNO7i9P7FrdasPkYrOYZw3HmUnDbj2mL8Kh00w0nNNBBf"
exports.GCbucketName="theconfederacyfiles"
exports.FEdomain = "http://localhost:4200"


process.env.GOOGLE_APPLICATION_CREDENTIALS =path.join(__dirname,'./GC-Owner-Credentials.json')