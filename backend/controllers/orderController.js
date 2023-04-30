const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const asyncErrorHandlingFunction = require("../middleware/catchasyncerrors");
const crypto = require("crypto");
const sendEmailToUser = require("../utils/sendEmail.js");

//Create new Order
exports.newOrder = asyncErrorHandlingFunction(async (req, res, next)=>{
    const {shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice} = req.body;

    const order = await Order.create({shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, paidOn:Date.now(), user:req.user.id})

    const orderSectionURL = `${req.protocol}://${req.get("host")}/orders`;
    const message = `Dear ${req.user.name}, \n\nThankyou for Placing Order at electroPRIME.com (an exclusive Electronics store) : \n\nYour ORDER  is currently being processed and will be shipped soon. To keep track of the status of your order, please keep visiting your Orders-Section on our website.\nVisit : ${orderSectionURL}\n\n\n--Thankyou for using electroPRIME.com\n--Admin of electroPRIME`;

    try{
        await sendEmailToUser({
            email:req.user.email, //isi user ko hme mail bhejni hai, 
            subject:`${req.user.name}! : Your Order Placed Successfully`,
            message
        });
        res.status(201).json({
            success:true,
            message:"Order Placed and Email Sent to user successfully.",
            order,
        });
    }
    catch(error){

        return next(new ErrorHandler(error.message, 500));
    }
});

//To see my Single Order using that's orderId, as a registered/loogedin user
exports.mySingleOrder = asyncErrorHandlingFunction(async (req,res,next)=>{
    const order = await Order.findById(req.params.orderId).populate("user", "name email"); //OrderId ka use krke "Order" collection me se particular order ka row/doc mil jayega, hr order row/doc me ek "user" field hai jiski type-"mongoose.Schema.Objectid" hai and ref-"User" table hai, to is userid ka use krke "User" table me us user ka  name and email (who placed this order) is order-ke-user-field me show kiya jayega

    if(!order){
        return next(new ErrorHandler("Order not found with this id.", 404));
    }

    res.status(200).json({
        success:true,
        message:`Details of your single Order with orderId:${req.params.orderId}`,
        order
    })
})

//to see My All Orders, means as a loggedin/registered user, to see my own all orders
exports.myAllOrders = asyncErrorHandlingFunction(async (req, res, next)=>{
    const orders = await Order.find({user:req.user.id});

    res.status(200).json({
        success:true,
        message:"Your Orders.",
        orders
    })
})

//get All Orders -- (ADMIN only)
exports.getAllOrders = asyncErrorHandlingFunction(async (req, res, next)=>{
    const orders = await Order.find(); //get all orders row/doc

    //calculating total amount from all orders
    let totalAmount = 0;
    orders.forEach((ord)=>{ //ord means each order row/doc in above obtained orders[] array.
        totalAmount += ord.totalPrice;
    })

    res.status(200).json({
        success:true,
        message:"All Orders.",
        totalAmount,
        orders
    })
})

//to Update status of a particular Order using that's orderId -- (ADMIN only)
exports.updateOrderStatus = asyncErrorHandlingFunction(async (req, res, next)=>{
    const order = await Order.findById(req.params.orderId); //get that order row/doc

    if(!order){
        return next(new ErrorHandler("Order not found with this id.", 404));
    }

    if(order.orderStatus == "Delivered"){
        return next(new ErrorHandler("This product has already been delivered.", 400));
    }

    //updating the stock, when product shipped
    if(req.body.status === "Shipped"){ //this if is required to avoid stockdecrement again on changing status to delivered
        order.orderItems.forEach(async (itm)=>{ //orderItems[] ,is a field in orderScehma , which is an array[] containing all items of this order.
            await updateStock(itm.productId, itm.quantity); 
        })
    }
    //order status updated
    order.orderStatus = req.body.status;

    //means product is delivered
    //in payment using card via stripe auto generates paymentId and we store that one, but on cash on delivery we need to generate some random paymentId
    //lets make a payment id of 27 chars
    if(req.body.status == "Delivered"){
        let randomToken = crypto.randomBytes(23).toString("hex");
        let payId = "cod_" + randomToken; //cod means cash on delivery
        order.deliveredOn = Date.now();
        order.paymentInfo.status = "succeeded";
        order.paymentInfo.id = payId;
    }

    await order.save({validateBeforeSave: false});

    res.status(200).json({
        success:true,
        message:`Order id:${req.params.orderId} status changed successfully.`
    })
})

async function updateStock(productId, quantity){
    const product = await Product.findById(productId);

    product.stock -= quantity;

    await product.save({validateBeforeSave:false});
}

// delete a particular order using that's orderId -- (ADMIN ONLY)
exports.deleteOrder = asyncErrorHandlingFunction(async (req, res, next)=>{
    const order = await Order.findById(req.params.orderId);

    if(!order){
        return next(new ErrorHandler("Order not found with this id.", 404));
    }
    await order.remove();

    res.status(200).json({
        success:true,
        message:"Order deleted successfully."
    })
})