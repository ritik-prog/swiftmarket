const mongoose = require('mongoose');
const natural = require('natural');

const productSchema = new mongoose.Schema(
    {
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Seller',
            required: true,
            index: 'text'
        },
        productName: {
            type: String,
            required: true,
            trim: true,
            index: 'text',
        },
        businessName: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            index: 'text',
        },
        productDescription: {
            type: String,
            required: true,
            index: 'text',
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
            required: true,
            index: 'text',
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
            type: [{
                type: String,
                required: true
            }],
            validate: {
                validator: function (v) {
                    return v.length >= 1 && v.length <= 5;
                },
                message: 'Tags must have at least 1 and at most 5 values'
            },
            required: true,
            // index: 'text',
        },
        ratings: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                rating: {
                    type: Number,
                    default: 0,
                },
                review: {
                    type: String,
                    trim: true
                },
                date: {
                    type: Date,
                    default: Date.now
                },
            }
        ],
        ratingsAvg: {
            type: Number,
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
        keywords: { type: [String], default: [], index: 'text' },
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

productSchema.pre('save', function (next) {
    if (this.quantity === 0) {
        this.isAvailable = false;
    }
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

productSchema.pre('save', function (next) {
    const tokenizer = new natural.WordTokenizer();
    const stemmer = natural.PorterStemmer;
    const stopwords = natural.stopwords;

    const keywords = [
        ...tokenizer.tokenize(this.productName),
        ...tokenizer.tokenize(this.businessName),
        ...tokenizer.tokenize(this.productDescription),
        ...tokenizer.tokenize(this.category),
        ...tokenizer.tokenize(...this.tags),
    ]
        .map((word) => stemmer.stem(word.toLowerCase()))
        .filter((word) => !stopwords.includes(word))
        .filter(Boolean);

    this.keywords = keywords;

    next();
});


productSchema.pre(['findOneAndDelete', 'remove'], function (next) {
    const productId = this._id;

    mongoose.model('Seller').deleteMany({ productListings: productId }, next);
});

const Product = mongoose.model('Product', productSchema);


module.exports = Product;
