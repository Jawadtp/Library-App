const express = require('express')
const Book = require('../models/book')
const router = express.Router()

router.get('/', async (req, res) =>
{
    try
    {
        let books = await Book.find({}).sort({createdAt: 'desc'}).limit(10)
        res.render('index',{books})
    }
    catch(e)
    {
        console.error(e)
    }
    
})


module.exports = router