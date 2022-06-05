const { Workout } = require('../models')

const WorkoutFactory = async (idForUser) => {
    try {
        const countOfPrevious = await Workout.count({ where: { userId: idForUser }})
        if(countOfPrevious === 0) {
            return buildInitial()
        } else {
            return buildNext()
        }
        
    } catch (error) {
        return error
    }
}

const buildInitial = () => {
    return(
        { "tilanne:": "rakennetaan eka" }
    )
}

const buildNext = () => {
    return(
        { "tilanne": "rakennetaan seuraava" }
    )
}

module.exports = WorkoutFactory