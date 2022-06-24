const router = require('express').Router()
const tokenHandler = require('../utils/tokenHandler')
const StatsGenerator = require('../domain/StatsGenerator')

router.get('/', tokenHandler, async(request, response) => {
    const history = await StatsGenerator(request.decodedToken.id)
    response.send(history)
    //response.json({'statseja käyttäjälle': request.decodedToken.id})
})

module.exports = router