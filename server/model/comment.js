const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

var commentSchema = new Schema({
    postId: { type: ObjectId },
    userId: { type: ObjectId, ref: "users" },
    comment: { type: String },
    username: { type: String }
})

module.exports = mongoose.model('comment', commentSchema)  