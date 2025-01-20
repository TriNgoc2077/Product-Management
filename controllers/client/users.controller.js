const User = require("../../models/user.model");

const userSocket = require("../../sockets/client/users.socket");
//[GET] user/not-friend
module.exports.notFriend = async (req, res) => {

    userSocket(res);
    const userId = res.locals.user.id;
    const myUser = await User.findOne({ _id: userId });

    const listFriend = myUser.listFriend.map(item => item.user_id);
    const exceptId = [ ...myUser.requestFriend, ...myUser.acceptFriend, ...listFriend];
    const users = await User.find({
        _id: { $nin: exceptId, $ne: userId },
        status: "active",
        deleted: false
    }).select("avatar fullName");

    res.render("client/pages/users/not-friend", {
        titlePage: "List user",
        users: users
    });
}

//[GET] user/request
module.exports.request = async (req, res) => {
    userSocket(res);
    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId
    });
    const listFriend = myUser.listFriend.map(item => item.user_id);
    const exceptId = [ ...myUser.requestFriend, ...myUser.acceptFriend, ...listFriend];
    const requests = await User.find(
        {
            _id: { $in: myUser.requestFriend },
            status: "active",
            deleted: false
        }
    ).select("id fullName avatar");

    const users = await User.find({
        _id: { $nin: exceptId, $ne: userId },
        status: "active",
        deleted: false
    }).select("avatar fullName");

    res.render("client/pages/users/request", {
        titlePage: "List request sent",
        requests: requests,
        users: users,
    });
}

//[GET] user/accept
module.exports.accept = async (req, res) => {
    userSocket(res);
    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId
    });
    const listFriend = myUser.listFriend.map(item => item.user_id);
    const exceptId = [ ...myUser.requestFriend, ...myUser.acceptFriend, ...listFriend];
    
    const accepts = await User.find(
        {
            _id: { $in: myUser.acceptFriend },
            status: "active",
            deleted: false
        }
    ).select("id fullName avatar");

    const users = await User.find({
        _id: { $nin: exceptId, $ne: userId },
        status: "active",
        deleted: false
    }).select("avatar fullName");

    res.render("client/pages/users/accept", {
        titlePage: "List request received",
        accepts: accepts,
        users: users
    });
}

//[GET] user/friends
module.exports.friends = async (req, res) => {
    userSocket(res);
    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId
    });
    const listFriend = myUser.listFriend.map(item => item.user_id);
    const exceptId = [ ...myUser.requestFriend, ...myUser.acceptFriend, ...listFriend];
    const friends = await User.find(
    {
        _id: { $in: listFriend },
        status: "active",
        deleted: false
    }
    ).select("id fullName avatar online");

    const users = await User.find({
        _id: { $nin: exceptId, $ne: userId },
        status: "active",
        deleted: false
    }).select("avatar fullName");

    friends.forEach(user => {
        const inforUser = myUser.listFriend.find(friend => friend.user_id == user.id);
        user.roomChatId = inforUser.room_chat_id;
    });

    res.render("client/pages/users/friends", {
        titlePage: "List request received",
        friends: friends,
        users: users
    });
}