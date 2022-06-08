const { Exercise } = require('../models')

const FailureHandler = async ( idForComparisonWorkout, exerciseName, newLoad ) => {
    const oldExercise = await Exercise.findOne({
        where: { workoutId: idForComparisonWorkout, kind: exerciseName }
    })

    if(newLoad < oldExercise.load) {
        return 0
    } else {
        return oldExercise.failures
    }

}

module.exports = FailureHandler