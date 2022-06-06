const router = require('express').Router()
const tokenHandler = require('../utils/tokenHandler')
const workoutFactory = require('../domain/WorkoutFactory')
const { Workout, Exercise } = require('../models')

router.post('/', tokenHandler, async (request, response) => {
    const newWorkout = await workoutFactory(request.decodedToken.id)
    response.status(200).json(newWorkout)
})

router.get('/', tokenHandler, async (request, response) => {
    try {
        const workouts = await Workout.findAll({
            attributes: ['serialNumber', 'kind', 'started', 'finished', 'userId'],
            include: {
                model: Exercise,
                attributes: ['kind', 'load', 'repetitions', 'failures']
            },
            where: {
                userId: request.decodedToken.id
            },
            order: [
                ['serialNumber', 'DESC']
            ]
        })
        response.status(200).json(workouts)
    } catch (error) {
        response.status(400).json({'virhe': error})
    }

})

module.exports = router