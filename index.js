import express from "express";
import mongoose from 'mongoose'
import multer from 'multer'
import {loginValidation, registerValidation} from './validations/auth.js'
import checkAuth from "./utils/checkAuth.js";
import {authMe, login, register} from "./controllers/UserController.js";
import {PostController} from "./controllers/PostController.js";
import {postCreateValidation} from "./validations/post.js";

mongoose.connect('mongodb+srv://admin:ibruslan@cluster0.kwrz95k.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => {
        console.log('DB ok')
    })
    .catch((err) => {
        console.log(`DB ${err}`)
    })

const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({storage})

app.use(express.json())
app.use('/upload', express.static('uploads'))

app.get('/auth/me', checkAuth, authMe)
app.post('/auth/login', loginValidation, login)
app.post('/auth/register', registerValidation, register)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)
app.patch('/posts/:id', checkAuth, postCreateValidation, PostController.updatePost)
app.delete('/posts/:id', checkAuth, PostController.remove)


app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('server OK')
})