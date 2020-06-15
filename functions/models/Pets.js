const mongoose = require('mongoose')

const Pets = mongoose.model('Pets', {
    name: String,
    type: String,
    description: String,
})

module.exports = Pets
