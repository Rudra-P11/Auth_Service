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
            if(error.name=='SequelizeValidationError') {
                throw error;
            }
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
            console.log("Password could not be verified", error);
            throw error;
        }
    }

    async isAuthenticated(token) {
        try {
            const response = this.verifyToken(token);
            if(!response) {
                throw {error: "Invalid token"}
            }
            const user = await this.userRepository.getById(response.id);
            if(!user) {
                throw {error: "No user found for this token"};
            }
            return user.id;
        } catch (error) {
            console.log("Something went wrong validating the token", error);
            throw error;
        }
    }

    async signIn(email, plainPassword) {
        try{
            // Step 1: fetch the user using email from database
            const user = await this.userRepository.getByEmail(email);
            // Step 2: compare incoming plain password with encrypted password in database
            const passwordMatch = this.checkPassword(plainPassword, user.password);
            if(!passwordMatch){
                console.log("Password doesn't match");
                throw {error: "Incorrect password"};
            }
            // Step 3: if passwords match, create a token and send it to the user
            const newJWT = this.createToken({email: user.email, id: user.id});
            return newJWT;

        } catch (error) {
            console.log("Something went wrong in signing in", error);
            throw error;
        }
    }

    isAdmin(userId) {
        try {
            this.userRepository.isAdmin(user);
        } catch (error) {
            console.log("Something went wrong validating user role", error);
            throw error;
        }
    }
}

module.exports = UserService;