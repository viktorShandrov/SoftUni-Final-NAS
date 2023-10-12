const { default: mongoose } = require("mongoose");
const { createRoot } = require("../managers/filesManager");
const userManager = require("../managers/usersManager");
const { isAuth } = require("../utils/authentication");
const { admins } = require("../utils/utils");
const router = require("express").Router()

const stripe = require('stripe')('sk_test_51MVy7FHWjRJobyftLPhg8KC5HmzfnRDipJQtsFebHEwGW40AdzYcJMNO7i9P7FrdasPkYrOYZw3HmUnDbj2mL8Kh00w0nNNBBf');

async function stripeConfig (){
    
    const product = await stripe.products.create({
        name: 'T-shirt',
      });
      console.log(product);
    
      const price = await stripe.prices.create({
        product: product,
        unit_amount: 2000,
        currency: 'usd',
      });
}
// stripeConfig()








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
router.get("/isAdmin",isAuth,async (req,res)=>{
    try {
        const {_id} = req.user
        if(admins.includes(_id)){
            res.status(200).json({isAdmin:true})
        }else{
            res.status(200).json({isAdmin:false})
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error.message})
    }
})
router.get("/getNotifications",isAuth,async (req,res)=>{
    try {
        const {_id} = req.user
        const notifications = await userManager.getNotifications(_id)
        res.status(200).json(notifications)
        userManager.makeAllNotificationsSeen(_id)
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error.message})
    }
})
router.post("/createNotification",isAuth,async (req,res)=>{
    try {
        const {_id} = req.user
        const {message,level,userId} = req.body
        await userManager.newNotification(message,level,userId)

        res.status(200)
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error.message})
    }
})
router.get("/areThereUnSeenNotifications",isAuth,async (req,res)=>{
    try {
        const {_id}= req.user
        const response = await userManager.areThereUnSeenNotifications(_id)
        res.status(200).send(response)  
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error.message})
    }
})
router.post("/paymentMade",isAuth,async (req,res)=>{
    try {
        console.log("here1")
        const sig = req.headers['stripe-signature'];
        
            const event = stripe.webhooks.constructEvent(req.body, sig, 'your_stripe_webhook_secret');

            if (event.type === 'checkout.session.completed') {
                console.log("super")
            }

            res.json({ received: true });
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error.message})
    }
    })

router.post('/create-checkout-session', async (req, res) => {
    try {

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'T-shirt',
                        },
                        unit_amount: 2000,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'https://example.com/success',
            cancel_url: 'https://example.com/cancel',
        });

        res.json({ id: session.id });

    }catch (error) {
        console.log(error);
        res.status(400).json({message:error.message})
    }
    }
)
module.exports = router