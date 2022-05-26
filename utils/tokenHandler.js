const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')

const tokenHandler = (request, response, next) => {
    const authorizationHeader = request.get('authorization')

    if (authorizationHeader && authorizationHeader.toLowerCase().startsWith('bearer ')) {
        try {
            const token = authorizationHeader.substring(7)
            request.decodedToken = jwt.verify(token, SECRET)
        } catch (error) {
            console.log(error)
            return response.status(401).json({ error: 'token ei kelpaa'})
        }
    } else {
        return response.status(401).json({ error: 'tokenia ei löydy'})
    }

    next()
}

module.exports = tokenHandler