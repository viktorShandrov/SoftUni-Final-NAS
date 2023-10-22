const express = require("express")
const utils = require("../utils/utils");
const stripe = require('stripe')(utils.stripeSecretKey);
const filesManager = require("../managers/filesManager")
const stripeManager = require("../managers/stripeManager");

const router = express.Router()
router.use(express.urlencoded({ extended: true, limit: "1gb" }))
router.use(express.json({ limit: "1gb" }))
// router.use(express.raw({ type: 'application/json' }))

// router.post("/paymentMade",async (req,res)=>{
//     try {
//
//         const sig = req.headers['stripe-signature'];
//         const event = stripe.webhooks.constructEvent(req.body, sig, utils.stripeSecret);
//
//         //checkout.session.completed
//         if (event.type === 'payment_intent.succeeded') {
//
//             const paidFileContainer = await filesManager.createFileContainer("paid",req.user._id,req.user.rootId,100)
//             const root = await filesManager.getOnlyRootInfo(req.user.rootId)
//             root.paidFileContainer = paidFileContainer._id
//             await root.save()
//         }
//
//         res.json({ received: true });
//     } catch (error) {
//         console.log(error);
//         res.status(400).json({message:error.message})
//     }
// })

router.post("/stripeWebhook",async (req,res)=>{
    try {
        const {type} = req.body
        // req.user = {
        //     _id:"6533c417dbc3bba0399573c8",
        //     rootId:"6533c417dbc3bba0399573ca"
        // }
        if(type==="customer.subscription.created"){
            await stripeManager.paymentIsSuccessful(req.user)
        }else if(type==="customer.subscription.deleted"){
            await stripeManager.paymentIsUnsuccessful(req.user)
        }

        res.status(200).end()
    } catch (error) {

        res.status(400).json({message:error.message})
    }
})
// router.post("/paymentNotSuccessful",async (req,res)=>{
//     try {
//         const {type} = req.body
//         req.user = {
//             _id:"6533c417dbc3bba0399573c8",
//             rootId:"6533c417dbc3bba0399573ca"
//         }
//
//         res.status(200).end()
//     } catch (error) {
//
//         res.status(400).json({message:error.message})
//     }
// })

router.post('/create-checkout-session', async (req, res) => {
    try {

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: "price_1O3DfUHWjRJobyftOq1PQGlj",
                    // For metered billing, do not pass quantity
                    quantity: 1,
                },
            ],
            // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
            // the actual Session ID is returned in the query parameter when your customer
            // is redirected to the success page.
            success_url: `${utils.FEdomain}/#/storage/(storage-outlet:dashboard)`,
            cancel_url: `${utils.FEdomain}/#/storage/(storage-outlet:dashboard)`,
        });


        res.json({ id: session.id });

    }catch (error) {
        console.log(error);
        res.status(400).json({message:error.message})
    }
}
)




module.exports = router