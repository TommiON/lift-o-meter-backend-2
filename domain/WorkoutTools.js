const { Workout } = require('../models')

const findLatestWorkoutForUser = async (idForUser) => {
    /*
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

        return latestWorkout

    } catch (error) {
        return error
    }
    */

    return 666
}

module.exports = {
    findLatestWorkoutForUser
}