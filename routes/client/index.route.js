const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const searchRoutes = require("./search.route");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");
const roomsChatRoute = require("./rooms-chat.route");
const userMiddleware = require("../../middlewares/client/user.middleware");
const settingMiddleware = require("../../middlewares/client/setting.middleware");
const chatRoute = require("./chat.route.js");
const authMiddleware = require("../../middlewares/client/auth.middleware");
const usersRoutes = require("./users.route.js");
module.exports = (app) => {
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId);
    app.use(userMiddleware.inforUser);
    app.use(settingMiddleware.generalSetting);

    app.use(
        "/", 
        homeRoutes
    );
    app.use(
        "/products",
        productRoutes
    );
    app.use(
        "/search",
        searchRoutes
    );
    app.use("/cart", cartRoutes);
    app.use("/checkout", checkoutRoutes);
    
    app.use("/user", userRoutes);
    app.use("/chat", authMiddleware.requireAuth, chatRoute);
    app.use("/users", authMiddleware.requireAuth, usersRoutes);
    app.use("/rooms-chat", authMiddleware.requireAuth, roomsChatRoute);
}