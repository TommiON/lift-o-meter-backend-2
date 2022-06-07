const sequelize = require('sequelize')
const { Workout, User, Exercise } = require('../models')
const { RoundLoad, Progress } = require('./LoadTools')
const LoadCalculator = require('./LoadCalculator')

// implementoitava failureiden nollaus jos deload - se lienee ExerciseFactoryn homma?

const ExerciseFactory = async (idForUser, idForNewWorkout, latestWorkout, secondLatestWorkout) => {
    if(latestWorkout === undefined && secondLatestWorkout === undefined) {
        buildFirst(idForUser, idForNewWorkout)
    } else if (secondLatestWorkout === undefined) {
        buildSecond(idForUser, idForNewWorkout, latestWorkout)
    } else {
        buildNext(idForUser, idForNewWorkout, latestWorkout, secondLatestWorkout)
    }
}

const buildNext = async (idForUser, idForNewWorkout, latestWorkout, secondLatestWorkout) => {
    try {
        if(latestWorkout.kind === 'B') {
            console.log('*** Last was B, now building A again...')
            await Exercise.create({
                workoutId: idForNewWorkout,
                kind: 'SQUAT',
                load: LoadCalculator(latestWorkout.exercises[0]),
                repetitions: [null, null, null, null, null]
            })
        
            await Exercise.create({
                workoutId: idForNewWorkout,
                kind: 'BENCH',
                load: LoadCalculator(secondLatestWorkout.exercises[1]),
                repetitions: [null, null, null, null, null]
            })
        
            await Exercise.create({
                workoutId: idForNewWorkout,
                kind: 'ROW',
                load: LoadCalculator(secondLatestWorkout.exercises[2]),
                repetitions: [null, null, null, null, null]
            })  
        }

        if(latestWorkout.kind === 'A') {
            console.log('*** Last was A, now building B again...')
            await Exercise.create({
                workoutId: idForNewWorkout,
                kind: 'SQUAT',
                load: LoadCalculator(latestWorkout.exercises[0]),
                repetitions: [null, null, null, null, null]
            })
        
            await Exercise.create({
                workoutId: idForNewWorkout,
                kind: 'OVERHEAD',
                load: LoadCalculator(secondLatestWorkout.exercises[1]),
                repetitions: [null, null, null, null, null]
            })
        
            await Exercise.create({
                workoutId: idForNewWorkout,
                kind: 'DEADLIFT',
                load: LoadCalculator(secondLatestWorkout.exercises[2]),
                repetitions: [null]
            })  
        }

    } catch (error) {
        console.log('VIRHE, EXERCISE FACTORY: ', error)
        throw error
    }
}

const buildSecond = async (idForUser, idForNewWorkout, latestWorkout) => {
    try {
        const user = await User.findByPk(idForUser)

        await Exercise.create({
            workoutId: idForNewWorkout,
            kind: 'SQUAT',
            load: LoadCalculator(latestWorkout.exercises[0]),
            repetitions: [null, null, null, null, null]
        })
    
        await Exercise.create({
            workoutId: idForNewWorkout,
            kind: 'OVERHEAD',
            load: RoundLoad(user.bestOverheadpress / 2),
            repetitions: [null, null, null, null, null]
        })
    
        await Exercise.create({
            workoutId: idForNewWorkout,
            kind: 'DEADLIFT',
            load: RoundLoad(user.bestDeadlift / 2),
            repetitions: [null]
        })
    } catch (error) {
        console.log('VIRHE, EXERCISE FACTORY, BUILD SECOND: ', error)
        throw error
    }
}

const buildFirst = async (idForUser, idForNewWorkout) => {
    try {
        const user = await User.findByPk(idForUser)

        //const firstWorkout = await Workout.findOne( { where: { userId: idForUser }})
 
        await Exercise.create({
            workoutId: idForNewWorkout,
            kind: 'SQUAT',
            load: RoundLoad(user.bestSquat / 2),
            repetitions: [null, null, null, null, null]
        })
    
        await Exercise.create({
            workoutId: idForNewWorkout,
            kind: 'BENCH',
            load: RoundLoad(user.bestBenchpress / 2),
            repetitions: [null, null, null, null, null]
        })
    
        await Exercise.create({
            workoutId: idForNewWorkout,
            kind: 'ROW',
            load: RoundLoad(user.bestRow / 2),
            repetitions: [null, null, null, null, null]
        })
    } catch (error) {
        console.log('VIRHE, EXERCISE FACTORY, BUILD FIRST: ', error)
        throw(error)
    }
    
}

module.exports = ExerciseFactory