module.exports.newPrice = (products) => {
    const newProducts = products.map(item => {
        item.priceNew = parseInt(item.price * (1 - item.discountPercentage * 0.01)); 
        return item;
    }); 
    return newProducts;
}

module.exports.newPriceOneProduct = (product) => {
    product.newPrice = parseInt(product.price * (1 - product.discountPercentage * 0.01)); 
    return product;
}