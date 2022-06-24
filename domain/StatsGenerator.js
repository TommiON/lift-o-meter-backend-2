const { Workout, Exercise } = require('../models')

const StatsGenerator = async (userId) => {
    const history = await retrieveWorkoutsWithExercises(userId)
    console.log('HISTORY: ', history)

    let squats = []
    let benches = []

    console.log('====')
    history.forEach(h => {
        console.log(h.serialNumber)
        h.exercises.forEach(e => {
            console.log(e.kind, ': ', e.load)
        })
    })



    return history

}

const retrieveWorkoutsWithExercises = async(idForUser) => {
    try{
        return await Workout.findAll({
            attributes: ['serialNumber'],
            include: {
                model: Exercise,
                attributes: ['kind', 'load']
            },
            where: {
                userId: idForUser
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