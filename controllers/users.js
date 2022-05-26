const router = require('express').Router()
const { User } = require('../models')
const tokenHandler = require('../utils/tokenHandler')

router.post('/', async (request, response) => {
    try {
        const newUser = await User.create(request.body)
        response.json(newUser)
    } catch (error) {
        response.status(400).json({error})
    }
})

router.get('/', async (request, response) => {
    try {
        const allUsers = await User.findAll()
        response.json(allUsers)
    } catch (error) {
        response.status(400).json({error})
    }
})

router.get('/:username', tokenHandler, async (request, response) => {
    try {
        const user = await User.findOne({ where: {username: request.body.username} })
        response.json(user)
    } catch (error) {
        response.status(400).json({error})
    }
})

module.exports = router