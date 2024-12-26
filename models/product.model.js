const mongoose = require('mongoose');
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
    {
        
        title: String,
        product_category_id: {
            type: String,
            default: ""
        },
        description: String,
        price: Number,
        discountPercentage: Number,
        stock: Number,
        thumbnail: String,
        status: String,
        position: Number,
        slug: {
            type: String,
            slug: "title",
            unique: true
        },
        // deletedAt: Date,
        deleted: {
            type: Boolean,
            default: false
        },
        createdBy: {
            account_id: String,
            createAt: {
                type: Date,
                default: Date.now
            }
        },
        deletedBy: {
            account_id: String,
            deleteAt: Date
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', productSchema, "product");

module.exports = Product;