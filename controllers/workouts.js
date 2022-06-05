const router = require('express').Router()
const tokenHandler = require('../utils/tokenHandler')
const workoutFactory = require('../domain/WorkoutFactory')

router.post('/', tokenHandler, async (request, response) => {
    const newWorkout = await workoutFactory(request.decodedToken.id)
    console.log('controller, paluuarvo: ', newWorkout)
    response.status(200).json(newWorkout)
})

module.exports = router