const RoomChat = require("../../models/room-chat.model");
module.exports.authAccess = async (req, res, next) => {
    const userId = res.locals.user.id;
    const roomChatId = req.params.roomChatId;
    try {
        const isAccess = await RoomChat.findOne(
            { 
                _id: roomChatId,
                deleted: false,
                "users.user_id": userId
            }
        );
        if (!isAccess) {
            res.redirect("/not-found");
            return;
        }
        next();
    } catch {
        res.redirect("/not-found");
    }
    
};
