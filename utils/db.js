const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(DATABASE_URL, {
    dialectOptions: {
        ssl: {
            reruire: true,
            rejectUnauthorized: false
        }
    },
});

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        console.log('Muodostettu yhteys tietokantaan')
    } catch (error) {
        console.log('VIRHE: ei yhteyttä tietokantaan')
        return process.exit(1)
    }

    return null
}

module.exports = { connectToDatabase, sequelize }