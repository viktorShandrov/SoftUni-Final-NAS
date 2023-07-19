const router = require("express").Router()
const usersRouter = require("./controllers/usersController")
const filesRouter = require("./controllers/filesController")

router.use("/users",usersRouter)
router.use("/files",filesRouter)


module.exports = router