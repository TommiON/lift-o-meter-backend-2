const router = require('express').Router()

router.get('/', (request, response) => {
    response.status(200).send('Up and running')
})

module.exports = router