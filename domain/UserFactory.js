const bcrypt = require('bcrypt')
const { User } = require('../models')

const UserFactory = async (userdata) => {
    try {
        const saltrounds = 10
        const hashedPassword = await bcrypt.hash(userdata.password, saltrounds)
        const newUser = await User.create({ 
            ...userdata, password: hashedPassword
        })
        return newUser
    } catch (error) {
        throw error
    }
}

module.exports = UserFactory
