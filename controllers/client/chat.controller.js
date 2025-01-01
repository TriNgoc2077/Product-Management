const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
//[GET] /chat/
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    // SocketIO 
    _io.once('connection', (socket) => {

        socket.on("CLIENT_SEND_MESSAGE", async (content) => {
            const chat = new Chat({
                user_id: userId,
                content: content
            });
            await chat.save();
            
            _io.emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: content 
            });
        });
    });

    const chats = await Chat.find({ deleted: false });
    for (const chat of chats) {
        const inforUser = await User.findOne({
            _id: chat.user_id
        }).select("fullName");
        chat.inforUser = inforUser;
    }

    res.render("client/pages/chat/index", {
        titlePage: "Chat",
        chats: chats
    });
}