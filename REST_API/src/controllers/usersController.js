const { createRoot } = require("../managers/filesManager");
const userManager = require("../managers/usersManager")

const router = require("express").Router()

router.post("/register",async (req,res)=>{
    try {
        //TODO: req.body=> JSON.parse(req.body)
        const {email,password,repeatePassword} = req.body
        console.log('email,password,repeatePassword: ', email,password,repeatePassword);
       
        const newUser = await userManager.register(email,password,repeatePassword);
        const rootId = await createRoot(newUser._id)
        newUser.rootId = rootId;
        await newUser.save()

        const token = await userManager.login(email,password);
        res.status(201).json({token,rootId})
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error.message})
    }
})
router.post("/login",async (req,res)=>{
    try {
        //TODO: req.body=> JSON.parse(req.body)
        const {email,password} = req.body
       const payload = await userManager.login(email,password);
        res.status(200).json(payload)
    } catch (error) {
        console.log(error);
        res.status(404).json({message:error.message})
    }
})


module.exports = router