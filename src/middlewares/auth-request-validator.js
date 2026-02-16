const validateUserAuth = (req, res, next) => {
    if(!req.body.email || !req.body.password){
        return res.status(400).json({
            message: "Something went wrong",
            success: false,
            data: {},
            err: "Email and password are required"
        })
    }
    next();
}

const validateIsAdminRequest = (req, res, next) => {
    if(!req.body.id){
        return res.status(400).json({
            message: "Something went wrong",
            success: false,
            data: {},
            err: "User ID is required"
        })
    }
    next();
}

module.exports = {
    validateUserAuth
}