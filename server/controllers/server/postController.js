const posts = require('../../model/posts')
const responseCtrl = require('../../responseCtrl')
const { ObjectId } = require('mongodb');

let sucResponse = {
    statusCode: 200,
    data: null,
}
let failureResponse = {
    statusCode: 400,
    error: null
}

//Api call
exports.save = async (postData) => {
    console.log("saving post", postData)
    let post = new posts()
    post.userId = postData._id
    post.postDate = postData.date
    post.post = postData.post
    try {
        let posted = await post.save()
        sucResponse.data = posted
        return sucResponse
    } catch (err) {
        failureResponse.error = "try again later"
        return failureResponse
    }
}

exports.get = async (req, res) => {
    console.log("get usrId", req.params.id)
    let id = req.params.id
    try {
        var post = await posts.aggregate([
            {
                $match:
                {
                    userId: { $ne: ObjectId(id) }
                }
            },
            {
                $lookup:
                {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userId"
                }
            },
            {
                $lookup:
                {
                    from: "comments",
                    localField: "_id",
                    foreignField: "postId",
                    as: "comments"
                }
            }
        ]).sort({ _id: -1 })
        console.log(post)
        responseCtrl.SendSuccess(res, post)
        return
    } catch (err) {
        responseCtrl.SendInternalError(res, post)
        return
    }
}

exports.getpostbyid = async (req, res) => {
    console.log("get post by id", typeof req.params.id)
    try {
        var post = await posts.aggregate([
            {
                $match:
                {
                    userId: ObjectId(req.params.id)
                }
            },
            {
                $lookup:
                {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userId"
                }
            },
            {
                $lookup:
                {
                    from: "comments",
                    localField: "_id",
                    foreignField: "postId",
                    as: "comments"
                }
            }
        ])
        responseCtrl.SendSuccess(res, post)
        return
    } catch (err) {
        responseCtrl.SendInternalError(res, post)
        return
    }
}

exports.likedbyuser = async (req, res) => {
    console.log("liked by user")
    let body = req.body
    try {
        let post = await posts.updateOne({ _id: body.postId }, { $push: { likedBy: { likeduserId: body.userId, name: body.name } } })
        responseCtrl.SendSuccess(res, post)
        return
    } catch (e) {
        console.log(e)
        return
    }
}

exports.unlikebyuser = async (req, res) => {
    let body = req.body
    console.log("unlike user", body)
    try {
        let post = await posts.updateOne({ _id: body.postId }, { $pull: { likedBy: { likeduserId: body.userId } } })
        responseCtrl.SendSuccess(res, post)
        return
    } catch (e) {
        console.log(e)
        return
    }
}

//Socket call
exports.getposts = async (userId) => {
    try {
        console.log("getPostsById")
        let post = await posts.find({ userId: { $ne: userId } }).sort({ _id: -1 }).populate({ path: 'userId' }).lean()
        console.log(post)
        sucResponse.data = post
        return sucResponse
    } catch (err) {
        failureResponse.error = "try again later"
        return failureResponse
    }
}

exports.deletePost = async (id) => {
    try {
        let post = await posts.deleteOne({ _id: id })
        sucResponse.data = post
        return sucResponse
    } catch (e) {
        failureResponse.error = "try again later"
        return failureResponse
    }
}