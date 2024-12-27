module.exports.newPrice = (products) => {
    const newProducts = products.map(item => {
        item.priceNew = parseInt(item.price * (1 - item.discountPercentage * 0.01)); 
        return item;
    }); 
    return newProducts;
}