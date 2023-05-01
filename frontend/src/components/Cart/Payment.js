import React, { useEffect } from 'react'
import MetaData from '../layout/MetaData'
import PlaceOrderSteps from './PlaceOrderSteps'
import { Typography } from '@material-ui/core'
import CreditCardIcon from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import {CardNumberElement, CardCvcElement, CardExpiryElement, useStripe, useElements} from "@stripe/react-stripe-js"
import {useSelector, useDispatch} from "react-redux";
import { useAlert } from 'react-alert';
import axios from 'axios';
import { useRef } from 'react';
import './Payment.css';
import { useNavigate } from 'react-router-dom';
import {clearErrors, createOrder} from "../../actions/orderAction"
import { emptyTheCart } from '../../actions/cartAction';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const Payment = () => {

    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

    const dispatch = useDispatch();
    const alert = useAlert();
    const stripe = useStripe();
    const elements = useElements();
    const payBtn = useRef(null); //payment through card button
    const codBtn = useRef(null); //cash on delivery button
    const navigate = useNavigate();

    const {shippingInfo, cartItems} = useSelector((state)=>state.cart_);
    const {user} =  useSelector((state)=>state.user_);
    const {error} = useSelector((state)=>state.newOrder_);

    const paymentData = {
        amount:Math.round(orderInfo.grandTotal * 100) //becoz stripe takes amount in paise thus X100
    }

    const order = {
        shippingInfo : shippingInfo,
        orderItems: cartItems,
        itemsPrice:orderInfo.subTotal,
        taxPrice:orderInfo.tax,
        shippingPrice:orderInfo.deliveryCharges,
        totalPrice:orderInfo.grandTotal
    }

    const cardSubmitHandler = async(e)=>{
        e.preventDefault();

        payBtn.current.disabled = true;

        try{
            const config = {headers:{"Content-Type" : "application/json"}}
            const {data} = await axios.post("/api/v1/payment/process", paymentData, config);

            const client_secret = data.client_secret;

            if(!stripe || !elements) return; //becoz we are going to use stripe and elements in next line

            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method:{
                    card:elements.getElement(CardNumberElement),
                    billing_details:{
                        name:user.name,
                        email:user.email,
                        address:{
                            line1 : shippingInfo.address,
                            city:shippingInfo.city,
                            state:shippingInfo.state,
                            postal_code:shippingInfo.pinCode,
                            country:shippingInfo.country,
                        }
                    }
                }
            });

            if(result.error){
                payBtn.current.disabled = false;

                alert.error(result.error.message);
            }
            else{
                if(result.paymentIntent.status === "succeeded"){
                    order.paymentInfo = {
                        id:result.paymentIntent.id,
                        status:result.paymentIntent.status,
                        mode:"OnlinePaymentViaCard"
                    };
                    dispatch(createOrder(order)); //creating order when payment completed/succeeded
                    dispatch(emptyTheCart());
                    navigate("/success");
                }
                else{
                    alert.error("There's some issue while processing payment.");
                }
            }

        }
        catch(error){
            payBtn.current.disabled = false;
            alert.error(error.response.data.message);
        }
    };

    const cashOnDeliverySubmitHandler = ()=>{
        codBtn.current.disabled = true;

        order.paymentInfo = {
            id:"#StillToReceive",
            status:"pending",
            mode:"CashOnDelivery"
        };
        dispatch(createOrder(order)); //creating order when payment completed/succeeded
        dispatch(emptyTheCart());
        navigate("/success");
    }

    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
    },[dispatch, error, alert]);

  return (
    <>
    <MetaData title="electroPRIME | Payment"/>
    <PlaceOrderSteps activeStep={2}/>
    <div className="paymentContainer">
        <form className="paymentForm" onSubmit={(e)=>cardSubmitHandler(e)}>
            <Typography>Card Info</Typography>
            <div>
                <CreditCardIcon/>
                <CardNumberElement className="paymentInput"/> {/* its an inbuilt input tag of stripe/react-stripe-js package which validates the card number is valid in terms of chars and no of chars given */}
            </div>
            <div>
                <EventIcon/>
                <CardExpiryElement className="paymentInput"/>  {/* its an inbuilt input tag of stripe/react-stripe-js package which validates the card expiry date as a valid possible date */}
            </div>
            <div>
                <VpnKeyIcon/>
                <CardCvcElement className="paymentInput"/>  {/* its an inbuilt input tag of stripe/react-stripe-js package which validates a possible cvv number or not */}
            </div>
            <input type="submit" value={`Pay  ₹${orderInfo && orderInfo.grandTotal} by Card`} ref={payBtn} className='paymentFormBtn'></input>
        </form>

        <div>OR</div>

        <div>
            <button onClick={cashOnDeliverySubmitHandler} ref={codBtn}>
                <LocalShippingIcon/>
                <p>Cash On Delivery</p>
            </button>
        </div>
    </div>
    </>
  )
}

export default Payment