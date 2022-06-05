const sequelize = require('sequelize')
const { Workout, User, Exercise } = require('../models')
const { RoundLoad } = require('./LoadTools')

const WorkoutFactory = async (idForUser) => {
    try {
        const countOfPrevious = await Workout.count({ where: { userId: idForUser }})
        if(countOfPrevious === 0) {
            return buildInitial(idForUser)
        } else {
            return buildNext(idForUser)
        }    
    } catch (error) {
        return error
    }
}

const buildInitial = async (idForUser) => {
    try {
        // tarvitaanko tätä käyttäjän hakua mihinkään, tulee jo parametrina
        const user = await User.findByPk(idForUser)
        
        const firstWorkout = await Workout.create({
            userId: user.id,
            kind: 'A',
            serialNumber: 1,
        })
        
        await Exercise.create({
            workoutId: firstWorkout.id,
            kind: 'SQUAT',
            load: RoundLoad(user.bestSquat / 2),
            repetitions: [null, null, null, null, null]
        })

        await Exercise.create({
            workoutId: firstWorkout.id,
            kind: 'BENCH',
            load: RoundLoad(user.bestBenchpress / 2),
            repetitions: [null, null, null, null, null]
        })

        await Exercise.create({
            workoutId: firstWorkout.id,
            kind: 'ROW',
            load: RoundLoad(user.bestRow / 2),
            repetitions: [null, null, null, null, null]
        })
        
        return firstWorkout

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
            where: { serialNumber: latestSerial }
        })

        // eriytä ylläoleva omaan apuluokkaan

        const newWorkout = await Workout.create({
            userId: idForUser,
            kind: latestWorkout.kind === 'A' ? 'B' : 'A',
            serialNumber: latestWorkout.serialNumber + 1
        })

        // ja seuraavat kans eriytetään ExerciseFactoryyn

        await Exercise.create({
            workoutId: newWorkout.id,
            kind: 'SQUAT',
            load: 666,
            repetitions: [null, null, null, null, null]
        })

        return newWorkout

    } catch (error) {
        return error
    }

    
}

module.exports = WorkoutFactory