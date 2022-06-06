const sequelize = require('sequelize')
const { Workout, User, Exercise } = require('../models')
const { RoundLoad } = require('./LoadTools')

const ExerciseFactory = async (idForUser, latestWorkout, secondLatestWorkout) => {
    if(latestWorkout === undefined && secondLatestWorkout === undefined) {
        buildFirst(idForUser)
    } else if (secondLatestWorkout === undefined) {
        buildSecond(idForUser, latestWorkout)
    } else {
        buildNext(idForUser, latestWorkout, secondLatestWorkout)
    }
}

const buildNext = async (idForUser, latestWorkout, secondLatestWorkout) => {

}

const buildSecond = async (idForUser, latestWorkout) => {

}

const buildFirst = async (idForUser) => {

}

module.exports = ExerciseFactory