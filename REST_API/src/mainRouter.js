const router = require("express").Router()
const usersRouter = require("./controllers/usersController")
const filesRouter = require("./controllers/filesController")
const stripeController = require("./controllers/stripeController")

router.use("/users",usersRouter)
router.use("/files",filesRouter)
router.use("/stripe",stripeController)


module.exports = router