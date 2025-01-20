const User = require("../../models/user.model");

const userSocket = require("../../sockets/client/users.socket");
//[GET] user/not-friend
module.exports.notFriend = async (req, res) => {
    try {
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
    } catch(error) {
        console.log("New error: ", error);
    }
}

//[GET] user/request
module.exports.request = async (req, res) => {
    try {
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
    } catch(error) {
        console.log("New error: ", error);
    }
}

//[GET] user/accept
module.exports.accept = async (req, res) => {
    try {
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
    } catch(error) {
        console.log("New error: ", error);
    }
}

//[GET] user/friends
module.exports.friends = async (req, res) => {
    try {
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
    } catch(error) {
        console.log("New error: ", error);
    }
}

//[GET] /user/detail/:userId
module.exports.detailUser = async (req, res) => {
	try {
		const id = req.params.userId;
		const inforUser = await User.findOne({ _id: id }).select("-password -userToken");
        for (let friend of inforUser.listFriend) {
            const infor = await User.findOne({ _id: friend.user_id }).select("fullName avatar");
            friend.avatar = infor.avatar;
            friend.fullName = infor.fullName;
        }
		res.render("client/pages/users/detail.pug", {
			titlePage: "Information User",
			inforUser: inforUser
		});
	} catch(error) {
		console.log("New Error: ", error);
	}
}