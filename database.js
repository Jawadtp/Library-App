const mongoose = require('mongoose')


const connectDB = () => 
{   
    if(process.env.NODE_ENV != 'production')
    require('dotenv').config({path: '.env'})
    mongoose.connect(process.env.DATABASE_URL, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    const db=mongoose.connection
    db.on('error', (error) => {console.error(error)})
    db.once('open', () => console.log("Connected to Mongoose"))

}

module.exports = connectDB