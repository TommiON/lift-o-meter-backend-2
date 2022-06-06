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
        // tää veke kun ExerciseFactory käyttöön
        const user = await User.findByPk(idForUser)

        const firstWorkout = await Workout.create({
            userId: idForUser,
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

const buildSecond = async (idForUser) => {
    try {
        // tää veke kun ExerciseFactory käyttöön
        const user = await User.findByPk(idForUser)

        const secondWorkout = await Workout.create({
            userId: idForUser,
            kind: 'B',
            serialNumber: 2,
        })
        
        await Exercise.create({
            workoutId: secondWorkout.id,
            kind: 'SQUAT',
            // tässä pieni detalji - entä jos heti ensimmäinen kyykky epäonnistuu?
            load: Progress(user.bestSquat / 2),
            repetitions: [null, null, null, null, null]
        })

        await Exercise.create({
            workoutId: secondWorkout.id,
            kind: 'OVERHEAD',
            load: RoundLoad(user.bestOverheadpress / 2),
            repetitions: [null, null, null, null, null]
        })

        await Exercise.create({
            workoutId: secondWorkout.id,
            kind: 'DEADLIFT',
            load: RoundLoad(user.bestDeadlift / 2),
            repetitions: [null]
        })
        
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
            where: { serialNumber: latestSerial, userId: idForUser }
        })

        const secondLatestWorkout = await Workout.findOne({
            where: { serialNumber: latestSerial - 1, userId: idForUser }
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
            load: 66.6,
            repetitions: [null, null, null, null, null]
        })

        return newWorkout

    } catch (error) {
        return error
    }

    
}

module.exports = WorkoutFactory