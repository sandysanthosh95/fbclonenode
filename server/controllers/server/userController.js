const users = require('../../model/users')
const responseCtrl = require('../../responseCtrl')
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

exports.save = (req, res) => {
    const userData = req.body
    let user = new users()
    user.name = userData.name
    user.mobileNumber = userData.mobileNumber
    user.password = cryptr.encrypt(userData.password);
    users.findOne({ mobileNumber: user.mobileNumber }).lean().exec((err, user) => {
        if (err) {
            responseCtrl.SendInternalError(res, "Unexpected error accessing data")
            return
        } else {
            console.log("user")
            if (user) {
                console.log("user1")
                responseCtrl.SendBadRequest(res, "User already exists with this mobile number, Please Login")
                return
            } else {
                saveUser()
            }
        }
    })
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
}

exports.login = (req, res) => {
    const loginData = req.body
    users.findOne({ mobileNumber: loginData.mobileNumber }).lean().exec((err, user) => {
        if (err) {
            console.log(err)
            responseCtrl.SendInternalError(res, "Unexpected error accessing data")
            return
        } else {
            if (user) {
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
        }
    })
}



