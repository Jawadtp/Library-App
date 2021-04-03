const express = require('express')
const router = express.Router()
const path = require('path')
const Book = require('../models/book')
const Author = require('../models/author')
const fs=require('fs')
//const multer = require('multer')
//Multer for uploading images
//const multer=require('multer')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

const uploadPath = path.join('public', Book.coverImageBasePath)
/*
const upload= multer(
    {
        dest: uploadPath,
        fileFilter: (req, file, callback)=>
        {
            callback(null, imageMimeTypes.includes(file.mimetype))
        }
    })
    */
//All author routes
router.get('/', async (req, res) =>
{
    let query= Book.find()
    if(req.query.name!=null && req.query.name != '')
    {
        query=query.regex('title', new RegExp(req.query.name, 'i'))
    }
    if(req.query.publishedBefore!=null && req.query.publishedBefore != '')
    {
        query=query.lte('publishDate',req.query.publishedBefore)
    } 
    if(req.query.publishedAfter!=null && req.query.publishedAfter != '')
    {
        query=query.gte('publishDate',req.query.publishedAfter)
    }    
    try
    {
        
        const books = await query.exec()
        res.render('books/index', {books: books, searchOptions: req.query})

    }
    catch(e)
    {
        console.log(e)
    }
    
})

router.get('/new', async (req, res) =>
{
    try
    {
        let authors = await Author.find({})
        let book=new Book()
        res.render('books/new.ejs', 
        {
            authors: authors,
            book: book
        })
    }
    catch(e)
    {
        console.error(e)
    }    
})

router.post('/',  async (req, res) =>       //upload.single('cover'),
{
    //const fileName = req.file!=null?req.file.filename:null
     const book=new Book(
     {
         title: req.body.title,
         author: req.body.author,
         publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description,
        //coverImageName: fileName,        
    })
    saveCover(book, req.body.cover)
    try
    {
       const newBook = await book.save()
       //res.redirect('books/${newBook.id}') //route not implemented yet
       res.redirect('books')
    }
    catch(e)
    {
       /* if(fileName)
            removeBookCover(fileName) */
        console.error(e)
    }

 
})

function saveCover(book, coverEncoded)
{
    if(coverEncoded!=null)
    {
        const cover = JSON.parse(coverEncoded)
        if(cover!=null && imageMimeTypes.includes(cover.type))
        {
            book.coverImage = new Buffer.from(cover.data, 'base64')
            book.coverImageType = cover.type
        }
    }
}
/*
function removeBookCover(fileName)
{
    fs.unlink(path.join(uploadPath, fileName) ,err => {if(err) console.error(err)})
}
*/
module.exports = router