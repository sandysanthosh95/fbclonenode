const commentSchema = require('../../model/comment')
const responseCtrl = require('../../responseCtrl')

exports.save = async (req, res) => {
    let body = req.body
    console.log("saving comment", typeof body.username)
    try {
        let commentSchm = new commentSchema()
        commentSchm.postId = body.postId
        commentSchm.userId = body.userId
        commentSchm.comment = body.comment
        commentSchm.username = body.username
        let comment = await commentSchm.save()
        responseCtrl.SendSuccess(res, comment)
        return
    } catch (e) {
        console.log(e)
        return
    }
}
