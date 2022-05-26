const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User } = require('../models')
const tokenHandler = require('../utils/tokenHandler')

router.post('/', async (request, response) => {
    try {
        const saltrounds = 10
        const hashedPassword = await bcrypt.hash(request.body.password, saltrounds)
        const newUser = await User.create({ ...request.body, password: hashedPassword })
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