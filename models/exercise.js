const { sequelize } = require('../utils/db')
const { Model, DataTypes } = require('sequelize')

class Exercise extends Model {}

Exercise.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    kind: {
        type: DataTypes.STRING,
        allowNull: false
    },
    load: {
        type: DataTypes.DECIMAL,
        allowNull: false,   
    },
    repetitions: {
        type: DataTypes.ARRAY(DataTypes.INTEGER)
    },
    failed: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'exercise' 
})

module.exports = Exercise