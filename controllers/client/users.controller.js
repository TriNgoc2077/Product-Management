const User = require("../../models/user.model");

const userSocket = require("../../sockets/client/users.socket");
//[GET] user/not-friend
module.exports.notFriend = async (req, res) => {

    userSocket(res);
    const userId = res.locals.user.id;
    const myUser = await User.findOne({ _id: userId });
    const requestFriend = myUser.requestFriend;
    const acceptFriend = myUser.acceptFriend;
    console.log(requestFriend);
    const users = await User.find({
        _id: { $nin: requestFriend, $ne: userId, $nin: acceptFriend },
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
    const requestFriend = myUser.requestFriend;
    const users = await User.find(
        {
            _id: { $in: requestFriend },
            status: "active",
            deleted: false
        }
    ).select("id fullName avatar");
    res.render("client/pages/users/request", {
        titlePage: "List request sent",
        users: users
    });
}

//[GET] user/accept
module.exports.accept = async (req, res) => {
    userSocket(res);
    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId
    });
    const acceptFriend = myUser.acceptFriend;
    const users = await User.find(
        {
            _id: { $in: acceptFriend },
            status: "active",
            deleted: false
        }
    ).select("id fullName avatar");
    res.render("client/pages/users/accept", {
        titlePage: "List request received",
        users: users
    });
}