const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");
// [GET] /
module.exports.index = async (req, res) => {
	const featuredProducts = await Product.find({
		deleted: false,
		featured: "1",
		status: "active",
	}).limit(4);
	const newFeaturedProducts = productHelper.newPrice(featuredProducts);

	const products = await Product.find({
		deleted: false,
		status: "active",
	})
		.sort({ position: "desc" })
		.limit(8);
	const newProducts = productHelper.newPrice(products);

	res.render("client/pages/home/index.pug", {
		titlePage: "Home",
		featuredProducts: newFeaturedProducts,
		newProducts: newProducts,
	});
};
