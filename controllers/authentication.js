const jwt = require('jsonwebtoken')
const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User } = require('../models')
const tokenHandler = require('../utils/tokenHandler')
const { SECRET } = require('../utils/config')

router.post('/login', async (request, response) => {
    const user = await User.findOne({
        where: {username: request.body.username}
    })

    if(!user) {
        return response.status(400).json({ error: 'käyttäjää ei löydy' })
    }

    // tämä muutetaan kun salasanat kryptatuksi
    const passwordCorrect = await bcrypt.compare(request.body.password, user.password)
    
    if(!passwordCorrect) {
        return response.status(400).json({ error: 'väärä salasana' })
    }

    const userForToken = {
        username: user.username,
        id: user.id
    }

    const token = jwt.sign(userForToken, SECRET)

    response.status(200).send({ token, username: user.username })
})

router.get('/logout', tokenHandler, async(request, response) => {
    // implementoidaan myöhemmin
})

module.exports = router