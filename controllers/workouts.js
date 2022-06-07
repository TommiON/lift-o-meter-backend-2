const router = require('express').Router()
const tokenHandler = require('../utils/tokenHandler')
const workoutFactory = require('../domain/WorkoutFactory')
const RepetitionsHandler = require('../domain/RepetitionsHandler')
const { Workout, Exercise } = require('../models')

// tätä metodia ei tarvita lainkaan
// uusien luominen: ekaa kutsutaan kun luodaan käyttäjä, seuraavia kun edellinen workout valmistuu
router.post('/', tokenHandler, async (request, response) => {
    const newWorkout = await workoutFactory(request.decodedToken.id)
    response.status(200).json(newWorkout)
})

router.get('/', tokenHandler, async (request, response) => {
    try {
        const workouts = await Workout.findAll({
            attributes: ['id', 'serialNumber', 'kind', 'started', 'finished', 'userId'],
            include: {
                model: Exercise,
                attributes: ['id', 'kind', 'load', 'repetitions', 'failures']
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
        response.status(400).json({ 'Workout controller, GET all, virhe: ': error })
    }
})

router.put('/:id/start', tokenHandler, async (request, response) => {
    try {
        const workout = await Workout.findByPk(request.params.id)
        if(workout.userId === request.decodedToken.id) {
            await Workout.update(
                { started: true, date: new Date() },
                { where: { id: request.params.id } }
            )
            
            const startedWorkout = await Workout.findOne({
                attributes: ['id', 'serialNumber', 'kind', 'started', 'finished', 'userId'],
                include: {
                    model: Exercise,
                    attributes: ['id', 'kind', 'load', 'repetitions', 'failures']
                },
                where: { id: request.params.id }
            })
            response.status(200).json(startedWorkout)

        } else {
            response.status(401).send('Workout controller, PUT start, virhe: ei oikeuksia')
        }
    } catch (error) {
        response.status(400).json({ 'Workout controller, PUT start, virhe: ': error })
    }
})

router.put('/:id/finish', tokenHandler, async (request, response) => {
    try {
        const workout = await Workout.findByPk(request.params.id)
        if(workout.userId === request.decodedToken.id && workout.started) {
            await RepetitionsHandler(request.params.id, request.body)

            await Workout.update(
                { finished: true },
                { where: { id: request.params.id } }
            )

            const finishedWorkout = await Workout.findOne({
                attributes: ['id', 'serialNumber', 'kind', 'started', 'finished', 'userId'],
                include: {
                    model: Exercise,
                    attributes: ['id', 'kind', 'load', 'repetitions', 'failures']
                },
                where: { id: request.params.id }
            })
            
            response.status(200).json(finishedWorkout)
            
        } else {
            response.status(401).send('Workout controller, PUT finish, virhe: ei oikeuksia tai harjoitus ei vielä alkanut')
        }
    } catch (error) {
        response.status(400).json({ 'Workout controller, PUT finish, virhe: ': error })
    }

})

module.exports = router