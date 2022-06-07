const { Exercise } = require('../models')

const RepetitionsHandler = async (workoutId, reps) => {
    try {
        for (const [key, value] of Object.entries(reps)) {
            const exerciseName = key
            const repetitions = value
            console.log('*** luuping ', exerciseName, ', on noussut ', repetitions)

            const exercise = await Exercise.findOne({
                attributes: ['failures'],
                where: { workoutId: workoutId, kind: exerciseName }
            })
            let failures = exercise.failures
            const failedReps = repetitions.filter(r => r < 5)
            if(failedReps.length > 0) {
                failures = failures + 1
            }
            
            await Exercise.update(
                { repetitions: repetitions, failures: failures },
                { where: { workoutId: workoutId, kind: exerciseName }}
            )
        }
    } catch (error) {
        throw error
    }
    
}

module.exports = RepetitionsHandler