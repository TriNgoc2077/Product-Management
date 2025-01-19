const Order = require("../../models/order.model");
const systemConfig = require("../../config/system");
const productHelper = require("../../helpers/product");
const filterStatusHelpers = require("../../helpers/filterStatus");
// [GET] /admin/orders
module.exports.index = async (req, res) => {
    const orders = await Order.find({}).sort({ createAt: 1 });
    const filterStatus = filterStatusHelpers(req.query);
    res.render("admin/pages/orders/index.pug", {
        titlePage: "Orders",
        orders: orders,
        filterStatus: filterStatus
    });
}

// [GET] /admin/orders/detail/:id
module.exports.detail = async (req, res) => {
    const orderId = req.params.id;
    const order = await Order.findOne({ _id: orderId });
    order.products = productHelper.newPrice(order.products);
    order.totalProducts = order.products.reduce((acc, item) => acc + item.price, 0);
    order.totalProductsDiscount = order.products.reduce((acc, item) => acc + item.priceNew, 0);
    order.totalAmount = order.totalProductsDiscount + (order.shipping ? order.shipping : 0);
    res.render("admin/pages/orders/detail.pug", {
        titlePage: "Order Detail",
        order: order
    });
}

// [GET] /admin/orders/proceed/:id
module.exports.proceed = async (req, res) => {
    try {
        const orderId = req.params.id;
        const status = req.body.status;
        console.log(status);
        await Order.updateOne({ _id: orderId }, {
            status: status
        });
        res.status(200).send({ message: "Went to next step !" });
    } catch(error) {
        res.status(500).send({ message: "Proceed error !" })
    }
}