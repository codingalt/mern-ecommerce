const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");

// create product -- admin
exports.createProduct = catchAsyncErrors(async (req, res, next)=>{
    // "build": "cd ../ && npm install && cd frontend && npm install && vite build",
    // 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
    // https://console.cloudinary.com/console/c-2f6c744ac4244728afca07aa7217e6/media_library/folders/home
    // https://www.freepik.com/photo-editor/new-artboard?photo=https%3A%2F%2Fdownloadscdn7.freepik.com%2F53876%2F103%2F102012.jpg%3Ffilename%3Dblack-t-shirts-with-copy-space%26token%3Dexp%3D1685561529%7Ehmac%3D94b56a3bb119e84773fec932e0553093&from_view=detail&id=15474803
    let images = [];
    if(typeof req.body.images === 'string'){
        images.push(req.body.images);
    }else{
        images = req.body.images;
    }
    const imagesLink = [];
    for(let i = 0; i<images.length; i++){
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products2",
        })
        imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }
    if(req.body.colors){
        let colors = [];
        if(typeof req.body.colors === 'string'){
            colors.push(req.body.colors);
        }else{
            colors = req.body.colors;
        }
        const colorsLink = [];
        for(let i = 0; i<colors.length; i++){
            const result = await cloudinary.v2.uploader.upload(colors[i], {
                folder: "colors2",
            })
            colorsLink.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }
        req.body.colors = colorsLink;
    }
    if(req.body.sizes){
        const sizes = JSON.parse(req.body.sizes)
        req.body.sizes = sizes
    }
    req.body.images = imagesLink;
    
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    // console.log(req.body)
    res.status(201).json({
        success: true,
        product
    })
})

// get all products
exports.getAllCategories = catchAsyncErrors(async (req, res, next)=>{
    const categories = await Product.distinct('category')
    res.status(200).json({
        success: true,
        categories
    });
})
// get all products
exports.getAllProducts = catchAsyncErrors(async (req, res, next)=>{
    const resultPerPage = 8;
    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().sortProducts();
    let products = await apiFeature.query;
    const filteredProductsCount = products.length;
    apiFeature.pagination(resultPerPage);
    products = await apiFeature.query.clone();

    res.status(200).json({
        success: true,
        products,
        productCount,
        resultPerPage,
        filteredProductsCount
    });
})
exports.getAdminProducts = catchAsyncErrors(async (req, res, next)=>{
    const products = await Product.find();
    if(!products){
        return next(new ErrorHandler("Product not found", 404))
    }
    res.status(200).json({
        success: true,
        products
    });
})

// update product
exports.updateProduct = catchAsyncErrors(async (req, res, next)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }
    if(req.body.sizes){
        const sizes = JSON.parse(req.body.sizes)
        const sizesArray = []
        for(let i = 0; i<sizes.length; i++){
            sizesArray.push({
                size: sizes[i],
            })
        }
        if(product.sizes){
            delete product.sizes;
            await product.save()
        }
        req.body.sizes = sizesArray
    }
    if(req.body.images !== undefined){
        for(let i = 0; i<product.images.length; i++){
            await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }
        let images = [];
        if(typeof req.body.images === 'string'){
            images.push(req.body.images);
        }else{
            images = req.body.images;
        }
        const imagesLink = [];
        for(let i = 0; i<images.length; i++){
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products2",
            })
            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }
        req.body.images = imagesLink;
    }else{
        req.body.images = product.images
    }

    if(req.body.colors !== undefined){
        for(let i = 0; i<product.colors.length; i++){
            await cloudinary.v2.uploader.destroy(product.colors[i].public_id)
        }
        let colors = [];
        if(typeof req.body.colors === 'string'){
            colors.push(req.body.colors);
        }else{
            colors = req.body.colors;
        }
        const colorsLink = [];
        for(let i = 0; i<colors.length; i++){
            const result = await cloudinary.v2.uploader.upload(colors[i], {
                folder: "colors2",
            })
            colorsLink.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }
        req.body.colors = colorsLink;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        product
    })
})

// delete product
exports.deleteProduct = catchAsyncErrors(async (req, res, next)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }
    
    for(let i = 0; i<product.images.length; i++){
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }
    if(product.colors){
        for(let i = 0; i<product.colors.length; i++){
            await cloudinary.v2.uploader.destroy(product.colors[i].public_id)
        }
    }
    await product.remove();

    res.status(200).json({
        success: true,
        message: "product deleted successfully"
    })
})
// get product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }
    let relatedProducts = await Product.find({
        category: product.category,
        _id: {$ne: product._id}
    })

    res.status(200).json({
        success: true,
        product,
        relatedProducts
    })
})
// create new review or update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next)=>{
    const {rating , comment , productId} = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString());
    if(isReviewed){
        product.reviews.forEach((rev)=>{
            if(rev.user.toString() === req.user._id.toString()){
                rev.rating = Number(rating)
                rev.comment = comment
            }
        })
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg=0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    })
    product.ratings = avg/product.reviews.length;
    await product.save({validateBeforeSave: false});
    res.status(200).json({
        success: true
    })
})
// get all reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next)=>{
    const product = await Product.findById(req.query.id)
    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})
// delete review
exports.deleteReview = catchAsyncErrors(async (req, res, next)=>{
    const product = await Product.findById(req.query.productId)
    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }
    const reviews = product.reviews.filter((rev)=> rev._id.toString() !== req.query.id.toString());
    let avg=0;
    reviews.forEach((rev) => {
        avg += rev.rating;
    })
    let ratings = 0;
    if(reviews.length === 0){
        ratings = 0;
    }else{
        ratings = avg/reviews.length;
    }
    const numOfReviews = reviews.length;
    const result = await Product.findByIdAndUpdate(req.query.productId, {reviews, ratings, numOfReviews}, {new: true, runValidators: true, useFindAndModify: false})
    res.status(200).json({
        success: true,
    })
})