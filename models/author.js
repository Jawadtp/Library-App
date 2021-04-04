const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema(
{
    name: 
    {
        type: String,
        required: true
    },
})

authorSchema.pre('remove', function(next)
{
    Book.find({author: this.id}, (err, books) => 
    {
        if(err)
        {
            next(err)
        }
        else if(books.length>0) //Books exist for an author that is requested to be deleted.
        {
            next(new Error('This author has undeleted books'))
        }
        else
        {
            next()
        }
    })
})
module.exports = mongoose.model('Author', authorSchema)