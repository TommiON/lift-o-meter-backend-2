const { sequelize } = require('../utils/db')
const { Model, DataTypes } = require('sequelize')

class Workout extends Model {}

Workout.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    kind: {
        type: DataTypes.STRING,
        allowNull: false
    },
    serialNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    started: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    finished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'workout' 
})

module.exports = Workout