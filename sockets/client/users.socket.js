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

            //length accept friend of account 
            const inforUser = await User.findOne({ _id: userId });
            const lengthAcceptFriend = inforUser.acceptFriend.length;
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriend: lengthAcceptFriend
            });

            //display request to friend request 
            const inforRequester = await User.findOne({ _id: myUserId }).select("_id avatar fullName");
            socket.broadcast.emit("SERVER_RETURN_INFOR_ACCEPT_FRIEND", {
                userId: userId,
                inforRequester: inforRequester
            });
        });

        //cancel add friend
        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;
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

            //length accept friend of account 
            const inforUser = await User.findOne({ _id: userId });
            const lengthAcceptFriend = inforUser.acceptFriend.length;
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriend: lengthAcceptFriend
            });

            //this account cancel add friend request
            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL", {
                idReceiver: userId,
                idRequester: myUserId
            });
        });

        //refuse friend
        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;
            //myUserId: id of account
            //userId: id of another accounts
            const existUserAinB = await User.findOne({ _id: myUserId, acceptFriend: userId });
            if (existUserAinB) {
                await User.updateOne(
                    {
                        _id: myUserId
                    }, 
                    { 
                        $pull: { acceptFriend: userId }
                    }
                );
            }


            const existUserBinA = await User.findOne({ _id: userId, requestFriend: myUserId });
            if (existUserBinA) {
                await User.updateOne(
                    {
                        _id: userId
                    }, 
                    { 
                        $pull: { requestFriend: myUserId }
                    }
                );
            }
        });

        //accept friend
        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;
            // similar refuse friend
            const existUserAinB = await User.findOne({ _id: myUserId, acceptFriend: userId });
            if (existUserAinB) {
                await User.updateOne(
                    {
                        _id: myUserId
                    }, 
                    { 
                        //add id to friend list
                        $push: { 
                            listFriend: { 
                                userId, 
                                room_chat_id: "" 
                            }, 
                        },
                        $pull: { acceptFriend: userId }
                    }
                );
            }


            const existUserBinA = await User.findOne({ _id: userId, requestFriend: myUserId });
            if (existUserBinA) {
                await User.updateOne(
                    {
                        _id: userId
                    }, 
                    { 
                        $push: { 
                            listFriend: {
                                myUserId,
                                room_chat_id: ""
                            },
                        },
                        $pull: { requestFriend: myUserId }
                    }
                );
            }            
        });
    });
}