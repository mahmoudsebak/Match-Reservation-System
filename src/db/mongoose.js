const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {useUnifiedTopology : false,
    useNewUrlParser : true,
    useFindAndModify : false,
    useCreateIndex : true
})