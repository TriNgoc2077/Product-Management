const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const RoomChat = require("../../models/room-chat.model");
const chatSocket = require("../../sockets/client/chat.socket");

//[GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
    try {
        const roomChatId = req.params.roomChatId;
        chatSocket(req, res);
        const room = await RoomChat.findOne({ _id: roomChatId });
        if (room.typeRoom == "friend") {
            const id = (room.users[0].user_id == res.locals.user.id ? room.users[0].user_id : room.users[1].user_id);
            const inforUser = await User.findOne({ _id: id }).select("avatar fullName");
            room.userAvatar = inforUser.avatar;
            room.userFullname = inforUser.fullName;
        }
        const chats = await Chat.find({ 
            room_chat_id: roomChatId,
            deleted: false 
        });
        for (const chat of chats) {
            const inforUser = await User.findOne({
                _id: chat.user_id
            }).select("fullName avatar");
            chat.inforUser = inforUser;
        }

        res.render("client/pages/chat/index", {
            titlePage: "Chat",
            chats: chats,
            roomInfor: room
        });
    } catch(error) {
        console.log("New error: ", error);
    }
}