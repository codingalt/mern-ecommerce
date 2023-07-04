const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const Order = require("../models/orderModel");
const User = require("../models/userModel")

// create new order 
exports.newOrder = catchAsyncErrors(async (req, res, next)=>{
    const {shippingInfo, orderItems, paymentInfo, itemsPrice, textPrice, shippingPrice, totalPrice} = req.body;

    const order = await Order.create({
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemsPrice, 
        textPrice, 
        shippingPrice, 
        totalPrice,
        paidAt: Date.now(),
        // paidAt: new Date(),
        user: req.user._id
    })

    res.status(201).json({
        success: true,
        order
    })
})
// get single order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next)=>{
    const order = await Order.findById(req.params.id).populate("user", "name email");
    // .populate("user", "name email")
    // if(!order){
    //     return next(new ErrorHandler("Order not found with this id", 404))
    // }
    res.status(201).json({
        success: true,
        order
    })
})
// get logged in user orders
exports.myOrders = catchAsyncErrors(async (req, res, next)=>{
    const orders = await Order.find({user: req.user._id});

    res.status(201).json({
        success: true,
        orders
    })
})
// get all orders (admin)
exports.getAllOrders = catchAsyncErrors(async (req, res, next)=>{
    const orders = await Order.find();
    // if(orders.length <=0){
    //     return next(new ErrorHandler("No order found", 404))
    // }
    let totalAmount = 0;
    orders.forEach((order)=>{
        totalAmount += order.totalPrice;
    })
    res.status(201).json({
        success: true,
        totalAmount,
        orders
    })
})
// update order status (admin)
exports.updateOrder = catchAsyncErrors(async (req, res, next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("order not found", 404))
    }
    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this order", 400))
    }
    if(req.body.status === 'Shipped'){
        order.orderItems.forEach(async(ord)=>{
            await updateStock(ord.product, ord.quantity); 
        })
    }
    order.orderStatus = req.body.status;
    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }
    await order.save({validateBeforeSave: false})
    res.status(201).json({
        success: true,
    })
})

async function updateStock(id, quantity){
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({validateBeforeSave: false});
}

// delete order (admin)
exports.deleteOrder = catchAsyncErrors(async (req, res, next)=>{
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler("No order found with this id", 404))
    }
    await order.remove();
    res.status(201).json({
        success: true,
    })
})
// orders summary (admin)
exports.ordersSummary = catchAsyncErrors(async (req, res, next)=>{
    const last24hrsOrder = await Order.aggregate([
        // First Stage
        {
            $match : { "createdAt": { $gte: new Date(new Date() - 24 * 60 * 60 * 1000), $lt: new Date() } }
        },
        // Second Stage
        {
            $group: {
                _id: null,
                numOfOrders: { $sum: 1 },
                totalSalesAmount: { $sum: '$totalPrice' }
            }
        }
    ])

    const dailyOrders = await Order.aggregate([
        // First Stage
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt'}},
                numOfOrders: { $sum: 1 },
                totalSalesAmount: { $sum: '$totalPrice' }
            }
        }
    ])
    const last12Months = new Date();
    last12Months.setMonth(last12Months.getMonth() - 11);
    const startDate = new Date(last12Months.getFullYear(), last12Months.getMonth(), 2);
    const formattedDate = startDate.toISOString().slice(0, 7);
    const salesLast12Months = await Order.aggregate([
        // Group by month and year
        {
        
            $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            numOfOrders: { $sum: 1 },
            totalSalesAmount: { $sum: '$totalPrice' },
            },
        },
        // Filter to the last 12 months
        {
            $match: {
            _id: { $gte: formattedDate }
            }
            // $match: {
            // _id: { $gte: { $dateToString: { format: '%Y-%m', date: startDate } } }
            // }
        },
        // Sort by date in ascending order
        {
            $sort: {
            _id: 1,
            },
        },
    ]);
    
    var last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6); // Subtract 6 days to get the last 7 days
    // var dateBefore7Days = new Date(last7Days.getFullYear(), last7Days.getMonth(), last7Days.getDate());
    last7Days = last7Days.toISOString().slice(0, 10);
    const salesLast7Days = await Order.aggregate([
        // Group by day
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            numOfOrders: { $sum: 1 },
            totalSalesAmount: { $sum: "$totalPrice" },
          },
        },
        // Filter to the last 7 days
        {
          $match: {
            _id: { $gte: last7Days },
          },
        },
        // Sort by date in ascending order
        {
          $sort: {
            _id: 1,
          },
        },
      ]);

    const allOrders = await Order.aggregate([
        // First Stage
        {
            $group: {
                _id: null,
                numOfOrders: { $sum: 1 },
                totalSalesAmount: { $sum: '$totalPrice' }
            }
        }
    ])
    const allUsers = await User.aggregate([
        // First Stage
        {
            $group: {
                _id: null,
                numOfUsers: { $sum: 1 }
            }
        }
    ])
    const totalProducts = await Product.aggregate([
        // First Stage
        {
            $group: {
                _id: null,
                numOfProducts: { $sum: 1 }
            }
        }
    ])
    const productCategories = await Product.aggregate([
        {
            $group: {
                _id: '$category',
                numOfProducts: { $sum: 1 }
            }
        }
    ])

    const recentTransactions = await Order.find().sort({ createdAt: -1 }).limit(10).select('_id createdAt totalPrice').populate('user', 'name');


    res.status(201).json({
        success: true,
        // last24hrsNumOfOrders: last24hrsOrder[0].numOfOrders,
        // last24hrsTotalSalesAmount: last24hrsOrder[0].totalSalesAmount,
        last24hrsOrder,
        salesLast7Days,
        // allNumOfOrders: allOrders[0].numOfOrders,
        // allTotalSalesAmount: allOrders[0].totalSalesAmount,
        dailyOrders,
        salesLast12Months,
        allOrders,
        allUsers,
        numOfProducts: totalProducts[0].numOfProducts,
        productCategories,
        recentTransactions
    })
})
