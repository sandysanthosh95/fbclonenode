let userController = require('./controllers/server/userController')
let postController = require('./controllers/server/postController')
let commentController = require('./controllers/server/commentController')

module.exports = (app) => {
    //users
    app.post('/users/save', userController.save)
    app.post('/users/login', userController.login)

    //post
    app.get('/posts/getpost/:id', postController.get)
    app.get('/posts/getpostbyid/:id', postController.getpostbyid)
    app.post("/posts/likepost", postController.likedbyuser)
    app.post("/posts/unlikepost", postController.unlikebyuser)
    //comment
    app.post('/comment/save', commentController.save)
}
