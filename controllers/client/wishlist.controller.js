const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");
const Wishlist = require("../../models/wishlist.model");
module.exports.index = async (req, res) => {
    try {
        const id = req.cookies.wishlistId;
        const wishlist = await Wishlist.findOne({ _id: id });
        if (wishlist) {
            wishlist.totalValue = 0;
            for(let product of wishlist.products) {
                let productInfor = await Product.findOne({ _id: product.product_id });
                productInfor = productHelper.newPriceOneProduct(productInfor);
                product.productInfor = productInfor;
                wishlist.totalValue += productInfor.newPrice;
            };
            let featuredProducts = await Product.find({
                featured: "1"
            }).limit(8);
            featuredProducts = productHelper.newPrice(featuredProducts);

            res.render("client/pages/wishlist/index.pug", {
                titlePage: "Wishlist",
                wishlist: wishlist,
                recommendedProducts: featuredProducts
            });
        }
        
    } catch(error) {
        console.log(error);
        res.redirect("back");
    }
}

//[POST] /wishlist/add/:productId
module.exports.addPost = async (req, res) => {
    try {
        const wishlistId = req.cookies.wishlistId;
        if (!wishlistId) {
            res.redirect("/user/login");
            return;
        }
        const productId = req.params.productId;
        const wishlist = await Wishlist.findOne({ _id: wishlistId });

        let existProductInWishlist = wishlist.products.find(item => item.product_id == productId);
        if (existProductInWishlist) {
            req.flash("success", "Product already exist !");
        }
        else {
            const objectWishlist = { product_id: productId };
    
            await Wishlist.updateOne(
                { _id: wishlistId}, 
                { $push: { products: objectWishlist } }
            );
        }
        
        req.flash("success", "Added product to wishlist !");
        res.redirect("back");

    } catch(error) {
        req.flash("error", "Added failed !");
        res.redirect("back");
    }
}


//[DELETE] /wishlist/remove/:productId
module.exports.remove = async (req, res) => {
    try {
        console.log("123131");
        const wishlistId = req.cookies.wishlistId;
        const productId = req.params.productId;
        await Wishlist.updateOne({ _id: wishlistId }, {
            $pull: { products: { product_id: productId }}
        });

        req.flash("success", "Remove successfully !");
        res.redirect("back");
    } catch(error) {
        req.flash("error", "Remove failed !");
        res.redirect("back");
    }
}
