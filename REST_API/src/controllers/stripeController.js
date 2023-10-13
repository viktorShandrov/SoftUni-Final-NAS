const express = require("express")
const {stripeSecret, stripeSecretKey} = require("../utils/utils");
const stripe = require('stripe')(stripeSecretKey);
const router = express.Router()

router.use(express.raw({ type: 'application/json' }))

router.post("/paymentMade",async (req,res)=>{
    try {

        const sig = req.headers['stripe-signature'];
        const event = stripe.webhooks.constructEvent(req.body, sig, stripeSecret);
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