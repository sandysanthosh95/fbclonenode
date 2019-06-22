const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

var post = new Schema({
    userId: { type: ObjectId, ref: "users" },
    postDate: { type: Date, default: new Date() },
    post: { type: String },
    likedBy: {
        type: [{
            likeduserId: { type: ObjectId, ref: "users"},
            name: {type: String}
        }],
        default: []
    }
})

module.exports = mongoose.model('posts', post)