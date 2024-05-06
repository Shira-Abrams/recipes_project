const { default: mongoose } = require("mongoose");
//connecting db
mongoose.connect(process.env.DB_URL)
.then(()=>console.log('mongo db conected'))
.catch(err=>console.log(err.message));
