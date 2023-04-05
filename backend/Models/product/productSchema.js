const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Seller',
            required: true
        },
        productName: {
            type: String,
            required: true,
            trim: true
        },
        businessUsername: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        productDescription: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0,
            max: 10000
        },
        quantity: {
            type: Number,
            required: true,
            min: 10,
            max: 10000
        },
        category: {
            type: String,
            required: true
        },
        imagesUrl: [{
            type: String,
            required: true
        }],
        thumbnailUrl: {
            type: String,
            required: true
        },
        purchaseCount: {
            type: Number,
            default: 0
        },
        tags: {
            type: [String],
            required: true,
            tags: {
                type: [{
                    type: String,
                    required: true,
                }],
                validate: {
                    validator: function (v) {
                        return v.length >= 1 && v.length <= 5;
                    },
                    message: 'Tags must have at least 1 and at most 5 values'
                },
                required: true,
            },
        },
        ratings: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                rating: {
                    type: Number,
                    min: 1,
                    max: 5
                },
                review: {
                    type: String,
                    trim: true
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        ratingsAvg: {
            type: Number,
            min: 1,
            max: 5,
            default: 0
        },
        featured: {
            type: Boolean,
            default: false
        },
        views: {
            type: Number,
            default: 0
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date
        },
        updatedBy: {
            role: {
                type: String,
                enum: ['seller', 'admin', 'superadmin', 'root'],
                default: 'seller'
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true
    }
);

productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product'
}, { timestamps: true });

productSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'seller',
        select: 'businessName businessEmail businessNumber'
    });
    next();
});

// rating average
productSchema.pre('save', function (next) {
    const ratings = this.ratings;
    let sum = 0, count = 0;
    for (let i = 0; i < ratings.length; i++) {
        sum += ratings[i].rating;
        count++;
    }
    if (count > 0) {
        this.ratingsAvg = sum / count;
    } else {
        this.ratingsAvg = 0;
    }
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
