const { RoundLoad, Progress, DeadliftProgress, Deload } = require('./LoadTools')

const LoadCalculator = (previousExercise) => {
    try {
        if(previousExercise.failures > 2) {
            return Deload(previousExercise.load)
        } else if(previousExercise.failures > 0) {
            return previousExercise.load
        } else {
            console.log('** LOAD CALCULATOR, previousExercise.load: ', previousExercise.load)
            if(previousExercise.kind === 'DEADLIFT') {
                return DeadliftProgress(previousExercise.load)
            } else {
                return Progress(previousExercise.load)
            }
        }
    } catch (error) {
        console.log('VIRHE, LOAD CALCULATOR: ', error)
        throw error
    }
   
}

module.exports = LoadCalculator