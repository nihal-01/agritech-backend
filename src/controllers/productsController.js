const { sendErrorResponse, checkValidObjectId } = require('../helpers');
const { Product, Category } = require('../models');

module.exports = {
    addProduct: async (req, res) => {
        try {
            const newProduct = new Product(req.body);
            await newProduct
                .save()
                .then((response) => {
                    res.status(201).json(response);
                })
                .catch((err) => {
                    sendErrorResponse(res, 400, err);
                });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;

            if (!checkValidObjectId(id)) {
                return sendErrorResponse(res, 400, 'Invalid object id');
            }

            const product = await Product.findOneAndRemove({ _id: id });

            if (!product) {
                return sendErrorResponse(res, 404, 'No products found');
            }

            res.status(200).json({ message: 'product successfully deleted' });
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    // - /products?skip=3&sort=price:desc&category=fruits&maxprice=1000
    // getAllProducts: async (req, res) => {
    //     try {
    //         const sort = {};
    //         const filters = {};

    //         // &sort=price:desc
    //         // &sort=name:desc
    //         if (req.query.sort) {
    //             const parts = req.query.sort.split(':');
    //             sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    //         }

    //         // &category=categoryname
    //         if (req.query.category) {
    //             const category = await Category.findOne({
    //                 name: req.query.category,
    //             });

    //             if (!category) {
    //                 return sendErrorResponse(res, 404, 'No Products found');
    //             }

    //             filters.category = category._id;
    //         }

    //         // &maxprice=price
    //         if (req.query.maxprice) {
    //             if (!Boolean(parseInt(req.query.maxprice))) {
    //                 return sendErrorResponse(res, 404, 'No Products found');
    //             }

    //             filters.price = { $lt: parseInt(req.query.maxprice) };
    //         }

    //         const perPage = 2;
    //         const skip = req.query.skip || 0;

    //         const products = await Product.find({})
    //             .sort(sort)
    //             .skip(perPage * skip)
    //             .limit(perPage)
    //             .select('_id name thumbnail price');

    //         if (products.length < 1) {
    //             return sendErrorResponse(res, 404, 'No Products found');
    //         }

    //         const count = await Product.find(filters).sort(sort).count();

    //         res.status(200).json({
    //             products,
    //             totalProducts: count,
    //             limit: perPage,
    //             skip: perPage * skip,
    //         });
    //     } catch (err) {
    //         sendErrorResponse(res, 500, err);
    //     }
    // },

    getAllProducts: async (req, res) => {
        try {
            const products = await Product.aggregate([
                {
                    $lookup: {
                        from: 'productsReview', // replace your actual review collection name here
                        localField: '_id',
                        foreignField: 'productId',
                        as: 'review',
                    },
                },
                {
                    $project: {
                        name: 1,
                        avgRating: {
                            $let: {
                                vars: {
                                    total: { $size: '$review' },
                                    ratings: { $sum: '$review.stars' },
                                },
                                in: {
                                    $cond: [
                                        { $eq: ['$$total', 0] },
                                        0,
                                        { $divide: ['$$ratings', '$$total'] },
                                    ],
                                },
                            },
                        },
                    },
                },
            ]).exec();

            res.status(200).send(products);
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },

    getSingleProduct: async (req, res) => {
        try {
            const { id } = req.params;

            if (!checkValidObjectId(id)) {
                return sendErrorResponse(res, 400, 'Invalid object id');
            }

            const product = await Product.findById(id).populate('category');

            if (!product) {
                return sendErrorResponse(res, 404, 'No products found');
            }

            res.status(200).json(product);
        } catch (err) {
            sendErrorResponse(res, 500, err);
        }
    },
};
