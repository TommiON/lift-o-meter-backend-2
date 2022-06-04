const User = require('./user')
const Workout = require('./workout')
const Exercise = require('./exercise')

User.hasMany(Workout)
Workout.belongsTo(User)

Workout.hasMany(Exercise)
Exercise.belongsTo(Workout)

User.sync({ alter: true })
Workout.sync({ alter: true })
Exercise.sync({ alter: true })

module.exports = {
    User, Workout, Exercise
}