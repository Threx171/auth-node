/* eslint-disable indent */
import DBLocal from 'db-local'
import bcrypt from 'bcrypt'

import crypto from 'node:crypto'

import { SALT_ROUNDS } from './config.js'

const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
})
export class UserRepository {
    static async create({ username, password }) {
        console.log({ username, password })
        Validation.username(username)
        Validation.password(password)

        // 2. Asegurar que el username no exista
        const user = User.findOne({ username })
        if (user) throw new Error('username already exists')

        const id = crypto.randomUUID()
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS) // hashSync bloquea el thread principal

        User.create({
            _id: id,
            username,
            password: hashedPassword
        }).save()

        return id
    }
    static login({ username, password }) {
        // 1. Validar username y password
        Validation.username(username)
        Validation.password(password)

        // 2. Buscar usuario por username
        const user = User.findOne({ username })
        if (!user) throw new Error('username does not exist')

        const isValid = bcrypt.compareSync(password, user.password)
        if (!isValid) throw new Error('password is incorrect')

        const { password: _, ...publicUser } = user

        return publicUser
    }
}

class Validation {
    static username(username) {
        // 1. Validar username
        if (typeof username !== 'string') throw new Error('username must be a string')
        if (username.length < 3) throw new Error('username must be at least 3 characters long')
    }

    static password(password) {
        if (typeof password !== 'string') throw new Error('password must be a string')
        if (password.length < 6) throw new Error('password must be at least 3 characters long')
    }
}