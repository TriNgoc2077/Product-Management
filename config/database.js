const mongoose = require('mongoose');

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connect successfully");
    } catch (error) {
        console.log("connect error");
    }

}
