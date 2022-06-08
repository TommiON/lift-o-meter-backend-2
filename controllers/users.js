const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User } = require('../models')
const tokenHandler = require('../utils/tokenHandler')
const UserFactory = require('../domain/UserFactory')
const WorkoutFactory = require('../domain/WorkoutFactory')

router.post('/', async (request, response) => {
    try {
        const newUser = await UserFactory(request.body)
        await WorkoutFactory(newUser.id)
        response.status(200).json(newUser)
    } catch (error) {
        response.status(400).json({ 'User controller, POST, virhe: ': error })
    }
})

router.get('/', async (request, response) => {
    try {
        const allUsers = await User.findAll()
        response.json(allUsers)
    } catch (error) {
        response.status(400).json({ 'User controller, GET all, virhe: ': error })    }
})

router.get('/:username', tokenHandler, async (request, response) => {
    try {
        const user = await User.findOne({ where: {username: request.body.username} })
        response.json(user)
    } catch (error) {
        response.status(400).json({ 'User controller, GET one, virhe: ': error })    
    }
})

module.exports = router