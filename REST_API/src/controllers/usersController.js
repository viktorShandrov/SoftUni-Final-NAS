const { default: mongoose } = require("mongoose");
const { createRoot } = require("../managers/filesManager");
const userManager = require("../managers/usersManager")
const router = require("express").Router()


router.post("/register",async (req,res)=>{
    try {
        //TODO: req.body=> JSON.parse(req.body)
        const {email,password,repeatePassword} = req.body

       if(!email||!password||!repeatePassword){
            throw new Error("All fields are required")
       }
        const newUser = await userManager.register(email,password,repeatePassword);
        const rootId = await createRoot(newUser._id)
        newUser.rootId = rootId;
        await newUser.save()

        const payload = await userManager.login(email,password);
        res.status(201).json(payload)
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})
router.post("/registerViaGoogle",async (req,res)=>{
    try {
        
    const {email,userId} = await userManager.verify(req.body.credential)

    const id =new mongoose.Types.ObjectId(Number(userId).toString(16).padStart(24, '0')) 
    const newUser = await userManager.register(email,undefined,undefined,undefined,id);

    //  newUser._id =  new mongoose.Types.ObjectId(id)   
    const rootId = await createRoot(id)
    newUser.rootId = rootId;
    await newUser.save()
    const payload = await userManager.login(email,undefined,true);
    res.status(200).json(payload)

    //   res.redirect("https://viktorshandrov.github.io/SoftUni-Final-NAS/#/storage/(storage-outlet:dashboard)")
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error.message})
    }
})
router.post("/loginViaGoogle",async (req,res)=>{
    try {
        //TODO: req.body=> JSON.parse(req.body)
        const {email} = await userManager.verify(req.body.credential)
        const payload = await userManager.login(email,undefined,true);
        res.status(200).json(payload)
    } catch (error) {

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
        res.status(400).json({message:error.message})
    }
})


module.exports = router