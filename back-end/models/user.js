
const mongooseDB  = require('../util/mongoose');

const UsersModel = mongooseDB.model('user');

const getUserInfoById = (id) => {
    return UsersModel
    .findById(id)
    .then(results => {
        console.log(results)
        return results
    })
    .catch(err => {
        return false
    })
}


const auths = () => {
    return {
        'map': 6,
        'list': 1,
        'list-remove': 5
    }
}


module.exports = {
    getUserInfoById,
    auths
}