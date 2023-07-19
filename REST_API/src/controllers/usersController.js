const { createRoot } = require("../managers/filesManager");
const userManager = require("../managers/usersManager")

const router = require("express").Router()

router.post("/register",async (req,res)=>{
    try {
        //TODO: req.body=> JSON.parse(req.body)
        const {email,password,repeatePassword} = req.body

        const newUser = await userManager.register(email,password,repeatePassword);
        const rootId = await createRoot(newUser._id)
        newUser.rootId = rootId;
        newUser.save()

        const token = await userManager.login(email,password);
        res.send(token)
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message)
    }
})
router.post("/login",async (req,res)=>{
    try {
        //TODO: req.body=> JSON.parse(req.body)
        const {email,password} = req.body
       const token = await userManager.login(email,password);
        res.send(token)
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message)
    }
})


module.exports = router