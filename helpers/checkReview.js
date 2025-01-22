module.exports.checkReview = (order, product) => {
    for (let item of order.products) {
        if (item.product_id == product.id) {
            return true;
        }
    }
    return false;
}