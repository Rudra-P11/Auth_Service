const UserRepository = require('../repository/user-repository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {JWT_KEY} = require('../config/ServerConfig');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async create(data) {
        try {
            const user = await this.userRepository.create(data);
            return user;
        } catch (error) {
            console.log("Something went wrong in the service layer");
            throw error;
        }
    }

    createToken(user) {
        try{
            const result = jwt.sign(
                user, JWT_KEY, {expiresIn: '1d'}
            );
            return result;
        } catch (error) {
            console.log("Something went wrong in creating a token");
            throw error;
        }
    }

    verifyToken(token) {
        try {
            const response = jwt.verify(token , JWT_KEY);
            return response;
        } catch (error) {
            console.log("Something went wrong in validation the token", error);
            throw error;
        }
    }

    checkPassword(userInputPassword, encryptedPassword) {
        try{
            return bcrypt.compareSync(userInputPassword, encryptedPassword);
        } catch (error) {
            console.log("{Password could not be verified}", error);
            throw error;
        }
    }
}

module.exports = UserService;