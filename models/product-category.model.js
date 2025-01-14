const mongoose = require('mongoose');
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema(
    {
        
        title: String,
        parent_id: {
            type: String,
            default: ""
        },
        description: String,
        thumbnail: String,
        status: String,
        position: Number,
        slug: {
            type: String,
            slug: "title",
            unique: true
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedBy: [
            {
                account_id: String,
                deleteAt: Date
            },
        ],
        createdBy: {
            account_id: String,
            createAt: {
                type: Date,
                default: Date.now
            }
        },
        updatedBy: [
            {
                account_id: Array,
                updateAt: Date,
            }
        ]
    },
    {
        timestamps: true
    }
);

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema, "category");

module.exports = ProductCategory;