const postController = require('./controllers/server/postController')

module.exports = (server) => {
    const io = require("socket.io")(server);
    let nsp = io.of('/myroom');
    nsp.on("connection", function (socket) {
        services()
        function services() {
            socket.on("saveNewPost", async function (data) {
                console.log("------------------------")
                try {
                    let response = await postController.save(data);
                    socket.broadcast.emit("savedPost", response);
                } catch (e) {
                    console.log(e)
                }
            });
            
            socket.on("delete", async (userId) => {
                try {
                    let response = await postController.deletePost(userId)
                    socket.broadcast.emit("afterDelete", response)
                } catch (e) {
                    console.log(e)
                }
            })
            socket.on("commentstatus", (data) => {
                socket.broadcast.emit('updatecomment', data)
            })
            socket.on("likestatus", (data) => {
                console.log("comment socket started", data)
                socket.broadcast.emit('updatelikestatus', data)
            })
        }
        socket.on('disconnect', function () {
            console.log('user disconnected');
        });
    });

}