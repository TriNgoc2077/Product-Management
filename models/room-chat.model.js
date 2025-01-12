const mongoose = require('mongoose');

const roomChatSchema = new mongoose.Schema(
    {
        title: String,
        avatar: String,
        typeRoom: String,
        status: String,
        users: [
            {
                user_id: String,
                role: String,
            }
        ],
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true
    }
);

const roomChat = mongoose.model('roomChat', roomChatSchema, "rooms-chat");

module.exports = roomChat;