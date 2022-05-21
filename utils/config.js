require('dotenv').config()

console.log('Envin PORT: ', process.env.PORT)
console.log('Envin URL', process.env.DATABASE_URL)

module.exports = {
    DATABASE_URL: process.env.DATABASE_URL,
    PORT: process.env.PORT || 3001
}