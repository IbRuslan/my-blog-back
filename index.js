import express from "express";
import mongoose from 'mongoose'
import {registerValidation} from './validations/auth.js'
import {validationResult} from 'express-validator'
import bcrypt from "bcrypt";
import UserModel from './models/User.js'
import jwt from "jsonwebtoken";

mongoose.connect('mongodb+srv://admin:ibruslan@cluster0.kwrz95k.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => {
        console.log('DB ok')
    })
    .catch((err) => {
        console.log(`DB ${err}`)
    })

const app = express()
app.use(express.json())

app.get('/',
    (req, res) => {
        res.send('Hello World!')
    })
app.get('/auth/me',
    (req, res) => {
        try {

        } catch {

        }
    }
)
app.post('/auth/login',
    async (req, res) => {
        try {
            const user = await UserModel.findOne({email: req.body.email})
            if (!user) {
                return res.status(404).json({
                    message: "Пользователь не найден"
                });
            }

            const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
            if (!isValidPass) {
                return res.status(404).json({
                    message: "Логин или пароль не подходят"
                })
            }

            const token = jwt.sign(
                {
                    _id: user._id,
                },
                'secterId',
                {
                    expiresIn: '30d'
                }
            );

            const {passwordHash, ...userData} = user._doc

            res.json({...userData, token})
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Не удалось авторизоваться'
            })
        }
    }
)
app.post('/auth/register', registerValidation,
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array())
            }

            const password = req.body.password
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt)

            const doc = new UserModel({
                avatarUrl: req.body.avatarUrl,
                fullName: req.body.fullName,
                email: req.body.email,
                passwordHash: hash
            })

            const user = await doc.save();

            const token = jwt.sign(
                {
                    _id: user._id,
                },
                'secterId',
                {
                    expiresIn: '30d'
                }
            );

            const {passwordHash, ...userData} = user._doc

            res.json({...userData, token})
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Не удалось зарегистрироваться'
            })
        }
    })

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('server OK')
})