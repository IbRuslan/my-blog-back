import {body} from 'express-validator'

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен состоять из минимум 5 символов').isLength({min: 5}),
]

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен состоять из минимум 5 символов').isLength({min: 5}),
    body('fullName', 'Имя должно состоять из минимум 4 символов').isLength({min: 4}),
    body('avatarUrl', 'Неверная сыллка на аватарку').optional().isURL()
]