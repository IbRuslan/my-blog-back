import express from "express";
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

mongoose.connect('mongodb+srv://admin:ibruslan@cluster0.kwrz95k.mongodb.net/?retryWrites=true&w=majority')
    .then(()=> {console.log('DB ok')})
    .catch((err) => {console.log(`DB ${err}`)})

const app = express()
app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.post('/auth/login', (req, res) => {
    const token = jwt.sign({
        email: req.body.email
    }, 'secret123')

    res.json({
        success: true,
        token
    })
})

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('server OK')
})