module.exports.generateRandomString = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrsstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++){
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
// genera

module.exports.generateRandomNumber = (length) => {
    const characters = "123456789";
    let result = "";
    for (let i = 0; i < length; i++){
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
