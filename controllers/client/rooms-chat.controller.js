const User = require("../../models/user.model");
const RoomChat =require("../../models/room-chat.model");
//[GET] /rooms-chat/
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;
    const listRoom = await RoomChat.find({
        deleted: false,
        "users.user_id": userId
    });

    for (let room of listRoom) {
        if (room.typeRoom == "friend") {
            const friend_id = (room.users[0].user_id != userId ? room.users[0].user_id : room.users[1].user_id);
            const friend = await User.findOne({ _id: friend_id }).select("fullName avatar");
            room.name = friend.fullName;
            room.avatar = friend.avatar;
        }
    }
    
    res.render("client/pages/rooms-chat/index", {
        titlePage: "List Room Chat",
        listRoom: listRoom
    });
};

//[GET] /rooms-chat/create
module.exports.create = async (req, res) => {
    const listFriend = res.locals.user.listFriend;

    for (const friend of listFriend) {
        const inforUser = await User.findOne({
            _id: friend.user_id
        }).select("fullName avatar");
        friend.infor = inforUser;
    }

    res.render("client/pages/rooms-chat/create", {
        titlePage: "Create Room Chat",
        listFriend: listFriend
    });
};

//[POST] /rooms-chat/createPost
module.exports.createPost = async (req, res) => {
    const title = req.body.title;
    const userId = req.body.userId;


    const dataRoom = {
        title: title,
        typeRoom: "group",
        users: []
    }
    userId.forEach(user => {
        dataRoom.users.push({
            user_id: user,
            role: "member"
        });
    });

    dataRoom.users.push({
        user_id: res.locals.user.id,
        role: "superAdmin"
    });
    const room = new RoomChat(dataRoom);
    await room.save();
    res.redirect(`/chat/${room.id}`);
};