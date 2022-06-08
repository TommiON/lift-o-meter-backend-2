const sequelize = require('sequelize')
const { Workout, User, Exercise } = require('../models')
const { RoundLoad, Progress } = require('./LoadTools')
const LoadCalculator = require('./LoadCalculator')
const FailureHandler = require('./FailureHandler')

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
            const squatLoad = await LoadCalculator(latestWorkout.exercises[0])
            const squatFailures = await FailureHandler(latestWorkout.id, 'SQUAT', squatLoad)
            await Exercise.create({
                workoutId: idForNewWorkout,
                kind: 'SQUAT',
                load: squatLoad,
                repetitions: [null, null, null, null, null],
                failures: squatFailures
            })
        
            const benchLoad = await LoadCalculator(secondLatestWorkout.exercises[1])
            const benchFailures = await FailureHandler(secondLatestWorkout.id, 'BENCH', benchLoad)
            await Exercise.create({
                workoutId: idForNewWorkout,
                kind: 'BENCH',
                load: benchLoad,
                repetitions: [null, null, null, null, null],
                failures: benchFailures
            })

            const rowLoad = await LoadCalculator(secondLatestWorkout.exercises[2])
            const rowFailures = await FailureHandler(secondLatestWorkout.id, 'ROW', rowLoad)
            await Exercise.create({
                workoutId: idForNewWorkout,
                kind: 'ROW',
                load: rowLoad,
                repetitions: [null, null, null, null, null],
                failures: rowFailures
            })  
        }

        if(latestWorkout.kind === 'A') {
            const squatLoad = await LoadCalculator(latestWorkout.exercises[0])
            const squatFailures = await FailureHandler(latestWorkout.id, 'SQUAT', squatLoad)
            await Exercise.create({
                workoutId: idForNewWorkout,
                kind: 'SQUAT',
                load: squatLoad,
                repetitions: [null, null, null, null, null],
                failures: squatFailures
            })
        
            const overheadLoad = await LoadCalculator(secondLatestWorkout.exercises[1])
            const overheadFailures = await FailureHandler(secondLatestWorkout.id, 'OVERHEAD', overheadLoad)
            await Exercise.create({
                workoutId: idForNewWorkout,
                kind: 'OVERHEAD',
                load: overheadLoad,
                repetitions: [null, null, null, null, null],
                failures: overheadFailures
            })

            const deadliftLoad = await LoadCalculator(secondLatestWorkout.exercises[2])
            const deadliftFailures = await FailureHandler(secondLatestWorkout.id, 'DEADLIFT', deadliftLoad)
            await Exercise.create({
                workoutId: idForNewWorkout,
                kind: 'DEADLIFT',
                load: deadliftLoad,
                repetitions: [null],
                failures: deadliftFailures
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

        const squatLoad = await LoadCalculator(latestWorkout.exercises[0])
        const squatFailures = await FailureHandler(latestWorkout.id, 'SQUAT', squatLoad)
        await Exercise.create({
            workoutId: idForNewWorkout,
            kind: 'SQUAT',
            load: squatLoad,
            repetitions: [null, null, null, null, null],
            failures: squatFailures
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