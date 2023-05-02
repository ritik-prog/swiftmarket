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
        productDescription: {
            type: String,
            required: true,
            index: 'text',
        },
        price: {
            type: Number,
            required: true,
            min: 0,
            max: 500000,
            default: 0
        },
        discountedPrice: {
            type: Number,
            min: 0,
            max: 500000,
            default: 0
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
            max: 10000,
            default: 0
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
            index: 'text',
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
                    min: 0,
                    max: 5
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
            default: 0.0
        },
        faqs: [
            {
                question: {
                    type: String,
                    required: true,
                    trim: true,
                    min: 0,
                    max: 4
                },
                answer: {
                    type: String,
                    required: true,
                    trim: true,
                    min: 0,
                    max: 4
                },
            },
        ],
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
        popularityScore: {
            type: Number,
            default: 0
        },
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
        select: 'businessName businessEmail businessLogo businessUsername'
    });
    next();
});

productSchema.pre(['find', 'findOne', 'update', 'save', 'findOneAndUpdate', 'findByIdAndUpdate'], function (next) {
    if (this?.quantity && this?.quantity <= 0) {
        this.isAvailable = false;
    }
    next();
});

productSchema.post(['find', 'findOne', 'update', 'save', 'findOneAndUpdate', 'findByIdAndUpdate'], function (doc) {
    if (doc?.quantity <= 0 && doc?.isAvailable) {
        doc.isAvailable = false;
        doc.save(); // save the updated document
    }
});

// rating average
productSchema.post(['findOneAndUpdate'], async function (next) {
    try {
        if (this?._update?.$push?.ratings) {
            const updatedDoc = await Product.findOne({ _id: this.getQuery()._id });
            if (updatedDoc && updatedDoc.ratings?.length > 0) {
                const averageRating = await Product.aggregate([
                    { $match: { _id: mongoose.Types.ObjectId(this.getQuery()._id) } },
                    { $unwind: "$ratings" },
                    { $group: { _id: null, averageRating: { $avg: "$ratings.rating" } } },
                    { $project: { _id: 0, averageRating: { $round: ["$averageRating", 1] } } }
                ]);
                updatedDoc.ratingsAvg = averageRating[0].averageRating;
                await updatedDoc.save();
            } else {
                this.ratingsAvg = 0;
            }
        }
        // calculate popularity score
        const ratingWeight = 0.6;
        const likesWeight = 0.2;
        const viewsWeight = 0.2;
        const maxRating = 5; // maximum rating value
        const maxLikes = 100; // maximum likes value
        const maxViews = 1000; // maximum views value
        const decayConstant = 0.01; // decay constant for time decay
        const timeElapsed = Date.now() - this.createdAt; // time elapsed since product was created

        // calculate normalized scores
        const normalizedRating = this.ratingsAvg / maxRating;
        const normalizedLikes = this.likes?.length / maxLikes;
        const normalizedViews = this?.views / maxViews;

        // apply time decay
        const decayFactor = Math.exp(-decayConstant * timeElapsed / (1000 * 60 * 60 * 24)); // time in days
        const decayedLikes = normalizedLikes * decayFactor;
        const decayedViews = normalizedViews * decayFactor;

        // calculate weighted score
        const popularityScore = ratingWeight * normalizedRating +
            likesWeight * decayedLikes +
            viewsWeight * decayedViews;

        this.popularityScore = popularityScore;
        this.save();
        next();
    }
    catch (err) {
    }
});

productSchema.pre('save', function (next) {
    if (this.isNew) {
        const tokenizer = new natural.WordTokenizer();
        const stemmer = natural.PorterStemmer;
        const stopwords = natural.stopwords;

        const keywords = [
            ...tokenizer?.tokenize(this?.productName),
            ...tokenizer?.tokenize(this?.productDescription),
            ...tokenizer?.tokenize(this?.category),
            ...tokenizer?.tokenize(...this?.tags),
        ]
            .map((word) => stemmer.stem(word.toLowerCase()))
            .filter((word) => !stopwords.includes(word))
            .filter(Boolean);
        this.keywords = keywords;
    }
    next();
});


productSchema.pre(['findOneAndDelete', 'remove'], function (next) {
    const productId = this._id;

    mongoose.model('Seller').deleteMany({ productListings: productId }, next);
});

const Product = mongoose.model('Product', productSchema);


module.exports = Product;
