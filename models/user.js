const { sequelize } = require('../utils/db')
const { Model, DataTypes } = require('sequelize')

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    bestSquat: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    bestBenchpress: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    bestRow: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    bestOverheadpress: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    bestDeadlift: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    modelName: 'user' 
})

module.exports = User