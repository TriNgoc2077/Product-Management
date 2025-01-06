const User = require("../../models/user.model");
module.exports = async (res) => {
    _io.once('connection', (socket) => {
        //add friend
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            console.log(userId);
            const myUserId = res.locals.user.id;
            console.log(myUserId);

            const existUserAinB = await User.findOne({ _id: userId, acceptFriend: myUserId });
            if (!existUserAinB) {
                await User.updateOne(
                    {
                        _id: userId
                    }, 
                    { 
                        $push: { acceptFriend: myUserId }
                    }
                );
            }


            const existUserBinA = await User.findOne({ _id: myUserId, requestFriend: userId });
            if (!existUserBinA) {
                await User.updateOne(
                    {
                        _id: myUserId
                    }, 
                    { 
                        $push: { requestFriend: userId }
                    }
                );
            }
        });

        //cancel add friend
        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;
            console.log(myUserId);
            //myUserId: id of account
            //userId: id of another accounts
            const existUserAinB = await User.findOne({ _id: userId, acceptFriend: myUserId });
            if (existUserAinB) {
                await User.updateOne(
                    {
                        _id: userId
                    }, 
                    { 
                        $pull: { acceptFriend: myUserId }
                    }
                );
            }


            const existUserBinA = await User.findOne({ _id: myUserId, requestFriend: userId });
            if (existUserBinA) {
                await User.updateOne(
                    {
                        _id: myUserId
                    }, 
                    { 
                        $pull: { requestFriend: userId }
                    }
                );
            }
        });
    });
}