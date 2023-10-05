import express from "express";
import mongoose from 'mongoose'
import {registerValidation} from './validations/auth.js'
import checkAuth from "./utils/checkAuth.js";
import {authMe, login, register} from "./controllers/UserController.js";

mongoose.connect('mongodb+srv://admin:ibruslan@cluster0.kwrz95k.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => {
        console.log('DB ok')
    })
    .catch((err) => {
        console.log(`DB ${err}`)
    })

const app = express()
app.use(express.json())


app.get('/auth/me', checkAuth, authMe)
app.post('/auth/login',login)
app.post('/auth/register', registerValidation, register)




app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('server OK')
})