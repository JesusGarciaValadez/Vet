const functions = require('firebase-functions');
const app = require('express')()
const mongoose = require('mongoose')
const cors = require('cors')
const Pets = require('./models/Pets')

const { username, password, db } = functions.config().mongo
mongoose.connect(`mongodb+srv://${username}:${password}@vet-api-iloft.gcp.mongodb.net/${db}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })

const createServer = () => {
    app.use(cors({ origin: true }))

    app.get('/pets', async (req, res) => {
        const pets = await Pets.find({}).exec()

        res.send(pets)
    })

    app.post('/pets', async (req, res) => {
        const { body } = req

        const pet = new Pets(JSON.parse(body))
        await pet.save()

        res.send({_id: pet.id})
    })

    app.delete('/pets/:id/discharge', async (req, res) => {
        const { id } = req.params

        await Pets.deleteOne({ _id: id }).exec()

        res.sendStatus(204)
    })

    return app
}

exports.api = functions.https.onRequest(createServer());
