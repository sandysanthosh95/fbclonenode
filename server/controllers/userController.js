const users = require('../model/users')
const responseCtrl = require('../responseCtrl')
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

exports.save = async (req, res) => {
    try {
        const userData = req.body
        let user = new users()
        user.name = userData.name
        user.mobileNumber = userData.mobileNumber
        user.password = cryptr.encrypt(userData.password);
        let savedUser = users.findOne({ mobileNumber: user.mobileNumber }).lean()
        if (savedUser) {
            throw {
                known: true, msg: "User already exists with this mobile number, Please Login"
            }
        } else {
            saveUser()
        }

        function saveUser() {
            user.save((err, data) => {
                if (err) {
                    console.log(err)
                    responseCtrl.SendBadRequest(res, err.message)
                } else {
                    console.log(data)
                    responseCtrl.SendSuccess(res, data)
                }
            })
            return
        }
    } catch (e) {
        let msg = e.known ? e.message : "Unexpected error accessing data"
        return responseCtrl.SendInternalError(res, msg)
    }
}

exports.login = (req, res) => {
    try {
        const loginData = req.body
        let foundUser = users.findOne({ mobileNumber: loginData.mobileNumber }).lean()
        if (foundUser) {
            console.log(user)
            const decryptedPassword = cryptr.decrypt(user.password)
            if (decryptedPassword == loginData.password) {
                responseCtrl.SendSuccess(res, user)
            } else {
                responseCtrl.SendNotFound(res, "Invalid Credentials")
            }
        } else {
            responseCtrl.SendNotFound(res, "User not found, please signup before login")
        }
    } catch (e) {
        responseCtrl.SendInternalError(res, "Unexpected error accessing data")
        return
    }

    // .exec((err, user) => {
    //     if (err) {
    //         console.log(err)
    //         responseCtrl.SendInternalError(res, "Unexpected error accessing data")
    //         return
    //     } else {
    //         if (user) {
    //             console.log(user)
    //             const decryptedPassword = cryptr.decrypt(user.password)
    //             if (decryptedPassword == loginData.password) {
    //                 responseCtrl.SendSuccess(res, user)
    //             } else {
    //                 responseCtrl.SendNotFound(res, "Invalid Credentials")
    //             }
    //         } else {
    //             responseCtrl.SendNotFound(res, "User not found, please signup before login")
    //         }
    //     }
    // })
}



