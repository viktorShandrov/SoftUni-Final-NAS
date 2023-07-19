const jwt = require("./utils")

exports.auth= async(req,res,next)=>{
    // const token = req.body.userToken
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjExMUAxIiwiX2lkIjoiNjRiMjhiYWI5MmQ1MjUzOGNhNDQ0OWMwIiwiaWF0IjoxNjg5NDIyNzYzfQ.ZyC2IUaHvtg8pzkZc2cueGEk8z_K487kfamsOB2UPJQ"
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