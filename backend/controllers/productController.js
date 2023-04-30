const Product = require("../models/productModel");//importing product_model
const Order = require("../models/orderModel");
const ErrorHandler = require("../utils/errorhandler");
const asyncErrorHandlingFunction = require("../middleware/catchasyncerrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
/* All API's related to Product */
//create a new Product -- Admin ONLY
exports.createProduct = asyncErrorHandlingFunction(async (req, res, next) => {

    let images = []; //in this we will store all images uploaded by admin from his local system to create this product

    if (typeof req.body.images === "string") {
        //means just 1 image uploaded, there is only 1 url
        images.push(req.body.images);
    }
    else {
        //means more than 1 images are uploaded, there are more than 1 images
        images = req.body.images;
    }

    if (images !== undefined) {
        //uploading images of this product on cloudinary, and storing corresponding image url in images[image_object] array of product_model
        const imagesLinks = []; //this will store internet url of all images after uploading them on cloudinary
        for (let i = 0; i < images.length; i++) {
            //uploading on cloudinary
            const result = await cloudinary.v2.uploader.upload(images[i], { folder: "products" });

            imagesLinks.push(
                {
                    public_id: result.public_id,
                    url: result.secure_url //cloudinary wala link
                }
            )
        }
        req.body.images = imagesLinks;
    }


    //this product is created by which user, store that also
    req.body.user = req.user.id;

    const prod = await Product.create(req.body);

    res.status(201).json({
        success: true,
        message: "Product created Successfully.",
        prod
    })
})
//get all products (for users: it contains FILTERS also)
exports.getAllProducts = asyncErrorHandlingFunction(async (req, res) => {
    // let queryObj = {};
    // let name = req.query.name;
    // let price = req.query.price;
    // if(name)
    //     queryObj.name = name;
    // if(price)
    //     queryObj.price = price;
    // const prods = await Product.find(queryObj);
    // let name_ = {name:{$regex:req.query.name, $options:"i"}}
    // const prods = await Product.find(name_);
    // Product.find().find() also works same as Product.find(),  thats why query.find() is working in apifeatutres search()
    // Product.find().find({name:"shubham"}) also works same as Product.find({name:"shubham"}),  thats why query.find() is working in apifeatutres search()
    // console.log(req.query.name);

    /*Method chaining in js : obj1 = func1(); obj2 = obj1.func2() can be combinely written as obj2 = func1().func2() */
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

    let apiFeature = new ApiFeatures(Product.find(), req.query).search().filter();

    let prods = await apiFeature.query;
    let filteredProductsCount = prods.length;
    apiFeature = apiFeature.pagination(resultPerPage);

    prods = await apiFeature.query.clone(); //to exexute same query again .clone() needed

    res.status(200).json({
        success: true,
        productsCount,
        filteredProductsCount,
        prods,
        resultPerPage
    })
})
//get all products (for ADMIN: it DOESNOT contain any filter, it just returns product list)
exports.getAllProductsAdmin = asyncErrorHandlingFunction(async (req, res) => {
    const products = await Product.find();
    const productsCount = await Product.countDocuments();

    res.status(200).json({
        success: true,
        productsCount,
        products
    })
})
//update a product -- Admin ONLY
exports.updateProduct = asyncErrorHandlingFunction(async (req, res, next) => {
    let prod = await Product.findById(req.params.id);
    if (!prod) { //if product not found
        return next(new ErrorHandler("Product not found with such id.", 404)); //means using, next(ErrorHandler class object), in app.js line app.use(errorHandlingFunction) will be called and that will call and execute errorHandlingFunction().
    }

    //product images related stuff
    let images = [];
    if (typeof req.body.images === "string") {
        //means just 1 image uploaded, there is only 1 image
        images.push(req.body.images);
    }
    else {
        //means more than 1 images are uploaded, there are more than 1 images
        images = req.body.images;
    }

    if (images !== undefined) {
        //means images[] sould not be empty, like if user has not uploaded any image then we dont need to do this cloudinary related step

        //1 : Deleting old images of this product from cloudinary
        for (let i = 0; i < prod.images.length; i++) {
            await cloudinary.v2.uploader.destroy(prod.images[i].public_id);
        }

        //2 : uploading new images of this product on cloudinary, and storing corresponding image url in images[image_object] array of product_model
        const imagesLinks = []; //this will store internet url of all images after uploading them on cloudinary
        for (let i = 0; i < images.length; i++) {
            //uploading on cloudinary
            const result = await cloudinary.v2.uploader.upload(images[i], { folder: "products" });

            imagesLinks.push(
                {
                    public_id: result.public_id,
                    url: result.secure_url //cloudinary wala link
                }
            )
        }
        req.body.images = imagesLinks;
    }
    //control reaches here, means product found.
    prod = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        message: "Product details updated successfully.",
        prod
    })
})
//delete a Product -- Admin ONLY
exports.deleteProduct = asyncErrorHandlingFunction(async (req, res, next) => {
    const prod = await Product.findById(req.params.id);

    if (!prod) { //if product not found
        return next(new ErrorHandler("Product not found with such id.", 404)); //means using, next(ErrorHandler class object), in app.js line app.use(errorHandlingFunction) will be called and that will call and execute errorHandlingFunction().
    }

    //delete images from cloudinary also
    for (let i = 0; i < prod.images.length; i++) {
        await cloudinary.v2.uploader.destroy(prod.images[i].public_id);
    }

    //control reaches here means product found with such id.
    await prod.remove();
    res.status(200).json({
        success: true,
        message: "Product deleted successfully."
    })

})
//get single Product details
exports.getProductDetails = asyncErrorHandlingFunction(async (req, res, next) => {
    const prod = await Product.findById(req.params.id);

    if (!prod) { //if product not found
        return next(new ErrorHandler("Product not found with such id.", 404)); //means using, next(ErrorHandler class object), in app.js line app.use(errorHandlingFunction) will be called and that will call and execute errorHandlingFunction().
    }
    //control reaches here means product found with such id.
    res.status(200).json({
        success: true,
        message: "Details of Product found with such id.",
        prod
    })
})

//Create Review (if that particular user has not given review for this product)
//update Review (if that particular user has already given review for this product and want to update his review)
exports.createUpdateProductReview = asyncErrorHandlingFunction(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    //obviously user has loggedin/regesterd in, thats why req.user contains row/doc of that particular user.
    const review = { user: req.user.id, name: req.user.name, rating: Number(rating), comment: comment };

    const product = await Product.findById(productId);

    const isProductAlreadyReviewedByThisUser = product.reviews.find((ele) => ele.user.toString() == req.user.id.toString()); //ele is each "review" objet being stored in reviews[] array of a product in productSchema

    if (isProductAlreadyReviewedByThisUser) { //means for this product updatethis user's review
        product.reviews.forEach((ele) => {
            if (ele.user.toString() == req.user.id.toString()) {
                ele.rating = rating;
                ele.comment = comment;
            }
        })
    }
    else { //means for this product, this user has not given review earlier, create it
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let sum = 0;
    product.reviews.forEach((ele) => {
        sum += ele.rating;
    });
    product.avgRating = sum / (product.reviews.length);

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: `User id:${req.user.id} review has been saved successfully, for the product id:${productId}`
    })
})

//To see all reviews of a particular product
exports.getProductReviews = asyncErrorHandlingFunction(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product Not found.", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
});

//To Delete a particular review of a particular product
/*obviously product has an id and in review[] array each review submitted is also an object, thus each review also has an id in reviews[] array */
exports.deleteReview = asyncErrorHandlingFunction(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product Not found.", 404));
    }

    //in review[] arr of this product, using filter, we will only keep all review objects except the review object(with revId) that we want to delete
    const newReviewArr = product.reviews.filter((ele) => ele.id.toString() != req.query.revId.toString()); //ele means review object inf reviews[] arr of this project

    let sum = 0;
    newReviewArr.forEach((ele) => {
        sum += ele.rating;
    });
    let avgRating = 0;
    if (newReviewArr.length === 0) {
        avgRating = 0;
    }
    else {
        avgRating = sum / (newReviewArr.length);
    }
    const numOfReviews = newReviewArr.length;

    await Product.findByIdAndUpdate(req.query.productId, { reviews: newReviewArr, avgRating: avgRating, numOfReviews: numOfReviews }, { new: true, runValidators: true, useFindAndModify: false });

    res.status(200).json({
        success: true,
        message: `Review with id:${req.query.revId} deleted successfully for product id:${req.query.productId}.`
    });
})

//recommended products for a particular user
//From all orders of this particularUser, get categories of all the products which he ordered belongs to, and then show all products of those categories in recommendations
exports.getRecommendedProducts = asyncErrorHandlingFunction(async (req, res, next) => {
    //assuming that this is called for logged in user
    const orders = await Order.find({ user: req.user.id });

    if (!orders) {
        return next(new ErrorHandler("orders Not found.", 404));
    }

    let recommendedProducts = [];
    for (let i = 0; i < orders.length; i++) {
        for (let j = 0; j < orders[i].orderItems.length; j++) {

            const product = await Product.findById(orders[i].orderItems[j].productId);
            
            if(!product){
                continue;
            }

            let category_ = product.category;

            const products = await Product.find({ category: category_ });

            for (let k = 0; k < products.length; k++) {
                if (recommendedProducts.includes(products[k]) == true) {
                    continue;
                }
                else
                    recommendedProducts.push(products[k]);
            }
        }
    }


    res.status(200).json({
        success: true,
        message: "Recommended Products",
        recommendedProductsCount: recommendedProducts.length,
        recommendedProducts
    })
})
