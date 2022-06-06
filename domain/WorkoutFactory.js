const sequelize = require('sequelize')
const { Workout, User, Exercise } = require('../models')
const { RoundLoad, Progress } = require('./LoadTools')
const ExerciseFactory = require('./ExerciseFactory')

const WorkoutFactory = async (idForUser) => {
    try {
        const countOfPrevious = await Workout.count({ where: { userId: idForUser }})
        if(countOfPrevious === 0) {
            return buildFirst(idForUser)
        } else if(countOfPrevious === 1) {
            return buildSecond(idForUser)
        } else {
            return buildNext(idForUser)
        }    
    } catch (error) {
        return error
    }
}

const buildFirst = async (idForUser) => {
    try {
        const firstWorkout = await Workout.create({
            userId: idForUser,
            kind: 'A',
            serialNumber: 1,
        })

        ExerciseFactory(idForUser, firstWorkout.id)
        
        // saako jo tässä kohtaa palauttamaan exerciset myös?
        return firstWorkout

    } catch (error) {
        return error
    }
}

const buildSecond = async (idForUser) => {
    try {
        const secondWorkout = await Workout.create({
            userId: idForUser,
            kind: 'B',
            serialNumber: 2,
        })

        const firstWorkout = await Workout.findOne({
            include: {
                model: Exercise,
                attributes: ['kind', 'load', 'repetitions', 'failures']
            },
            where: { userId: idForUser, serialNumber: 1 }
        })

        console.log('*** BUILDING SECOND, FINDING FIRST: ', firstWorkout)

        ExerciseFactory(idForUser, secondWorkout.id, firstWorkout)
         
        return secondWorkout

    } catch (error) {
        return error
    }
}

const buildNext = async (idForUser) => {
    try {
        const databaseMaxSerial = await Workout.findOne({
            attributes: [sequelize.fn('MAX', sequelize.col('serial_number')) ],
            raw: true,
            where: { userId: idForUser }
        })
        
        const latestSerial = databaseMaxSerial.max

        const latestWorkout = await Workout.findOne({
            include: {
                model: Exercise,
                attributes: ['kind', 'load', 'repetitions', 'failures']
            },
            where: { serialNumber: latestSerial, userId: idForUser }
        })

        const secondLatestWorkout = await Workout.findOne({
            include: {
                model: Exercise,
                attributes: ['kind', 'load', 'repetitions', 'failures']
            },
            where: { serialNumber: latestSerial - 1, userId: idForUser }
        })

        const newWorkout = await Workout.create({
            userId: idForUser,
            kind: latestWorkout.kind === 'A' ? 'B' : 'A',
            serialNumber: latestWorkout.serialNumber + 1
        })

        ExerciseFactory(idForUser, newWorkout.id, latestWorkout, secondLatestWorkout)

        return newWorkout

    } catch (error) {
        return error
    }

    
}

module.exports = WorkoutFactory