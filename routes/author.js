const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')
//All author routes
router.get('/', async (req, res) =>
{
    let searchOptions = {}
    if(req.query.name != null && req.query.name !== '') //Since this is a GET request, use query instead of body.
    {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }

    try
    {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', {authors, searchOptions: req.query})
    }
    catch(e)
    {
        res.redirect('/')
    }
    
})

router.get('/new', (req, res) =>
{
    res.render('authors/new', {author: new Author()})
})

router.post('/', async (req, res) =>
{
    const author=new Author(
        {
            name: req.body.name
        })
    try
    {

        const newAuthor = await author.save()
        console.log('success')
        res.redirect('authors')
    }
    catch(e)
    {
        let locals={errorMessage: e}
        res.render('authors/new', 
        {
            locals,
        })
    }

 
})

router.get('/:id', async (req, res) =>
{
    try
    {
        const author = await Author.findById(req.params.id)
        const booksByAuthor = await Book.find({author: req.params.id}).limit(2) //It's possible that an author has quite a few books published by them. However, we only list 5 of them on the show page.
        res.render('authors/show', {author, booksByAuthor})
    }
    catch(e)
    {
        console.error(e)
    }
})

router.get('/:id/edit', async (req, res)=> //Note: :id var is accessed using req.params.id
{
    try
    {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', {author})
    }
    catch(e)
    {
        console.error(e)
    }
})

router.put('/:id', async (req, res)=>
{
    try
    {
        let author=await Author.findById(req.params.id)
        author.name=req.body.name
        await author.save()
        res.redirect('/authors')
    }
    catch(e)
    {
        console.error(e)
    }
})

router.delete('/:id', async (req, res) => 
{
    try
    {
        let author = await Author.findById(req.params.id)
        await author.remove({_id: req.params.id})
        res.redirect('/authors')
    }
    catch(e)
    {
        console.error(e)
    }
})
module.exports = router