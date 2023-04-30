const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    shippingInfo:{
        address:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        },
        pincode:{
            type:Number,
            required:true
        },
        phoneNo:{
            type:Number,
            required:true
        }
    },
    orderItems:[ //array 
        {
            name:{
                type:String,
                required:true
            },
            price:{
                type:String,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            image:{
                type:String,
                required:true
            },
            productId:{
                type:mongoose.Schema.ObjectId,
                ref:"Product", //w.r.t Product schema in database
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User", //w.r.t User schema in database
        required:true 
    },
    paymentInfo:{
        id:{
            type:String,
            default:"#StillToReceive",
            require:true
        },
        status:{
            type:String,
            default:"#StillToReceive",
            required:true
        },
        mode:{
            type:String,
            require:true
        }
    },
    paidOn:{
        type:Date,
        required:true
    },
    itemsPrice:{
        type:Number,
        default:0,
        required:true
    },
    taxPrice:{
        type:Number,
        default:0,
        required:true
    },
    shippingPrice:{ //shipping charges
        type:Number,
        default:0,
        required:true
    },
    totalPrice:{
        type:Number,
        default:0,
        required:true
    },
    orderStatus:{
        type:String,
        required:true,
        default:"Processing"
    },
    deliveredOn: Date,
    createdOn:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("Order", orderSchema);
