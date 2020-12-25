require('./db/mongoose.js')
const express = require('express')
const app = express()

const fanRouter = require('./routers/fan.js')
const managerRouter = require('./routers/manager.js')
const guestRouter = require('./routers/user.js')
const adminRouter = require('./routers/adminstrator.js')


app.use(express.json())
app.use(fanRouter)
app.use(managerRouter)
app.use(guestRouter)
app.use(adminRouter)

module.exports = app