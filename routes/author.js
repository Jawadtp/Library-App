const express = require('express')
const router = express.Router()
const Author = require('../models/author')
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

module.exports = router