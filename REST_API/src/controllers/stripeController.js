const express = require("express")
const utils = require("../utils/utils");
const stripe = require('stripe')(utils.stripeSecretKey);
const filesManager = require("../managers/filesManager")

const router = express.Router()

router.use(express.raw({ type: 'application/json' }))

router.post("/paymentMade",async (req,res)=>{
    try {

        const sig = req.headers['stripe-signature'];
        const event = stripe.webhooks.constructEvent(req.body, sig, utils.stripeSecret);
        //checkout.session.completed
        if (event.type === 'payment_intent.succeeded') {

            const paidFileContainer = await filesManager.createFileContainer("paid",req.user._id,req.user.rootId,100)
            const root = await filesManager.getOnlyRootInfo(req.user.rootId)
            root.paidFileContainer = paidFileContainer._id
            await root.save()
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
            success_url: `${constants.FEdomain}/#/storage/(storage-outlet:dashboard)`,
            cancel_url: `${constants.FEdomain}/#/storage/(storage-outlet:dashboard)`,
        });


        res.json({ id: session.id });

    }catch (error) {
        console.log(error);
        res.status(400).json({message:error.message})
    }
}
)




module.exports = router