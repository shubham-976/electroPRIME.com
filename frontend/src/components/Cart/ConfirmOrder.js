import React from 'react';
import PlaceOrderSteps from './PlaceOrderSteps';
import { useSelector } from 'react-redux';
import MetaData from '../layout/MetaData';
import "./ConfirmOrder.css"
import {Link} from "react-router-dom";
import {Typography} from "@material-ui/core";
import { useNavigate } from 'react-router-dom';

const ConfirmOrder = () => {
    const {shippingInfo, cartItems} = useSelector((state)=>state.cart_);
    const {user} = useSelector((state)=>state.user_);
    const navigate = useNavigate();

    const subTotal = cartItems.reduce((accu, item)=> accu+(item.quantity*item.price), 0)

    const deliveryCharges = subTotal >= 1000 ? 0 : 150; 

    const tax = subTotal * 0.08; //let 8% tax on subtotal 

    const grandTotal = subTotal + tax + deliveryCharges;

    const proceedToPayment = ()=>{
        const data = {subTotal, deliveryCharges, tax, grandTotal};
        sessionStorage.setItem("orderInfo", JSON.stringify(data)); //in sessionstorage means data will be vanished ehen that browser tab/window is closed, but if we had used localstorage then this data would haven't been vanished on closing the browser tab/window
        navigate("/process/payment")
    }

  return (
    <>
        <MetaData title="electroPRIME | Confirm Order"/>
        <PlaceOrderSteps activeStep={1}/>

        <div className="confirmOrderPage">
            {/* 1st div */}
            <div>
                <div className="confirmshippingArea">
                    <Typography>Shipping Info</Typography>
                    <div className="confirmshippingAreaBox">
                        <div>
                            <p>Name:</p>
                            <span>{user.name}</span>
                        </div>
                        <div>
                            <p>Phone:</p>
                            <span>{shippingInfo.phoneNo}</span>
                        </div>
                        <div>
                            <p>Address:</p>
                            <span>{`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pincode}, ${shippingInfo.country},`}</span>
                        </div>
                    </div>
                </div>
                <div className="confirmCartItems">
                    <Typography>Your Cart Items : </Typography>
                    <div className="confirmCartItemsContainer">
                        {cartItems && 
                         cartItems.map((item)=>(
                            <div key={item.productId}>
                                    <img src={item.image} alt="Product" />
                                    <Link to={`/product/${item.productId}`}>{item.name}</Link>
                                    <span>{item.quantity} X ₹{item.price} = {" "}<b>₹{item.price * item.quantity}</b></span>
                            </div>
                         ))
                        }
                    </div>
                </div>
            </div>

            {/* 2nd div */}
            <div>
                <div className="orderSummary">
                    <Typography>Order Summary</Typography>
                    <div>
                        <div>
                            <p>Subtotal : </p>
                            <span>₹{subTotal}</span>
                        </div>
                        <div>
                            <p>Delivery Charges : </p>
                            <span>₹{deliveryCharges}</span>
                        </div>
                        <div>
                            <p>GST : </p>
                            <span>₹{tax}</span>
                        </div>
                        <div className="orderSummaryTotal">
                            <p>Grand Total : </p>
                            <span>₹{grandTotal}</span>
                        </div>
                        <button onClick={proceedToPayment}>Proceed to Payment</button>
                    </div>
                </div>
            </div>

        </div>
    </>
  )
}

export default ConfirmOrder