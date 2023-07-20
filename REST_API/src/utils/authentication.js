const jwt = require("./utils")

exports.auth= async(req,res,next)=>{
    // const token = req.body.userToken
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpa3Rvcl9zaGFuZHJvdkBhYnYuYmciLCJfaWQiOiI2NGI5MDhiY2U1ZjJjZWRkNTBiMmQ5MGEiLCJpYXQiOjE2ODk4NDc5OTZ9.EeHV7aG0JzJQ3ZsAEUE6SEFjR8O03ZXUwonPJauFh8k"
    if(token){
        req.user = await jwt.verify(token,jwt.secret)
    }
    next()
}
exports.isAuth= async(req,res,next)=>{
    
    if(req.user){
        next()
    }else{
        res.status(403).send("Forbidden for unauthenticated users")
    }


}