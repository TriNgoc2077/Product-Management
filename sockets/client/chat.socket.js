const Chat = require("../../models/chat.model");

module.exports = async (req, res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    const roomChatId = req.params.roomChatId;
    // SocketIO 
    _io.once('connection', (socket) => {
        socket.join(roomChatId);
        socket.on("CLIENT_SEND_MESSAGE", async (content) => {
            const chat = new Chat({
                user_id: userId,
                room_chat_id: roomChatId,
                content: content
            });
            await chat.save();
            
            _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: content 
            });
        });

        socket.on("CLIENT_SEND_TYPING", (type) => {
            socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
                userId: userId,
                fullName: fullName,
                type: type 
            });
        });
    });

}