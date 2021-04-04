const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const indexRouter=require('./routes/index')
const authorRouter=require('./routes/author')
const bookRouter = require('./routes/book')
const methodOverride = require('method-override')
const connectDB = require('./database')
const bodyParser = require('body-parser')

//MongoDB Connection
connectDB()

app.use(express.json({limit: '10mb', extended: true}))
app.use(express.urlencoded({limit: '10mb', extended: true}))

//View Engine
app.set('view engine', 'ejs')
app.set('views', __dirname+'/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'));

//Method Override
app.use(methodOverride('_method'))
//Body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())    

//Configuring routers
app.use('/', indexRouter) //Use index.js for all routers starting with /
app.use('/authors', authorRouter)
app.use('/books', bookRouter)

app.listen(process.env.PORT || 3000)
