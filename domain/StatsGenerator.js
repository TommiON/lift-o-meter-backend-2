const { Workout, Exercise } = require('../models')

const StatsGenerator = async (userId) => {
    const history = await retrieveWorkoutHistory(userId)

    let squats = []
    let benches = []
    let rows = []
    let overheads = []
    let deadlifts = []

    history.forEach(workout => {
        const serialNumber = workout.serialNumber
        workout.exercises.forEach(exercise => {
            switch(exercise.kind) {
                case 'SQUAT':
                    squats.push({
                        serialNumber: serialNumber,
                        load: exercise.load
                    })
                    break
                case 'BENCH':
                    benches.push({
                        serialNumber: serialNumber,
                        load: exercise.load
                    })
                    break
                case 'ROW':
                    rows.push({
                        serialNumber: serialNumber,
                        load: exercise.load
                    })
                    break
                case 'OVERHEAD':
                    overheads.push({
                        serialNumber: serialNumber,
                        load: exercise.load
                    })
                    break
                case 'DEADLIFT':
                    deadlifts.push({
                        serialNumber: serialNumber,
                        load: exercise.load
                    })
                    break
            }        
        })
    })

    return {
        'squats': squats,
        'benches': benches,
        'rows': rows,
        'overheads': overheads,
        'deadlifts': deadlifts
    }
}

const retrieveWorkoutHistory = async(idForUser) => {
    try{
        return await Workout.findAll({
            attributes: ['serialNumber', 'finished'],
            include: {
                model: Exercise,
                attributes: ['kind', 'load']
            },
            where: {
                userId: idForUser,
                finished: true
            },
            order: [
                ['serialNumber', 'ASC']
            ]
        })

    } catch(error) {
        throw error
    }
}

module.exports = StatsGenerator