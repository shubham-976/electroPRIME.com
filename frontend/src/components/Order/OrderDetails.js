import React,{useEffect} from 'react'
import "./OrderDetails.css"
import {useSelector, useDispatch} from "react-redux";
import MetaData from "../layout/MetaData";
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';
import { getOrderDetails, clearErrors} from '../../actions/orderAction';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
    const {order, error, loading} = useSelector((state)=>state.orderDetails_);
    const dispatch = useDispatch();
    const alert = useAlert();
    const {id} = useParams();

    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getOrderDetails(id));
    }, [dispatch, alert, error, id]);

  return (
    <>
    {loading ? <Loader/> : (
        <>
        <MetaData title="Order Details"/>
        <div className='orderDetailsPage'>
            <div className='orderDetailsContainer'>
                <Typography component="h2">Order # {order && order._id}</Typography>
                <Typography >Shipping Info</Typography>
                <div className="orderDetailsContainerBox">
                    <div>
                        <p>Name:</p>
                        <span>{order.user && order.user.name}</span>
                    </div>
                    <div>
                        <p>Phone:</p>
                        <span>{order.shippingInfo && order.shippingInfo.phoneNo}</span>
                    </div>
                    <div>
                        <p>Address:</p>
                        <span>{order.shippingInfo && `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pincode}, ${order.shippingInfo.country},`}</span>
                    </div>
                    <div>
                        <p>Date of Order :</p>
                        <span>{order.paidOn && order.paidOn.substring(0,10)}</span>
                    </div>
                </div>
                <Typography>Payment</Typography>
                <div className="orderDetailsContainerBox">
                    <div>
                        <p className={order.paymentInfo && order.paymentInfo.status==="succeeded"?"greenColor":"redColor"}>
                            {order.paymentInfo && order.paymentInfo.status==="succeeded"? "PAID " : "PENDING "}
                            {order.paymentInfo && order.paymentInfo.mode==="OnlinePaymentViaCard"? "(Online Via Card)" : "(Cash On Delivery)"}
                        </p>
                    </div>

                    <div>
                        <p>Items Price:</p>
                        <span>₹{order.itemsPrice && order.itemsPrice}</span>
                    </div>
                    <div>
                        <p>Shipping Charges:</p>
                        <span>₹{order.shippingPrice && order.shippingPrice}</span>
                    </div>
                    <div>
                        <p>Tax (GST):</p>
                        <span>₹{order.taxPrice && order.taxPrice}</span>
                    </div>
                    <div>
                        <p><b>Grand Total:</b></p>
                        <span>₹{order.totalPrice && order.totalPrice}</span>
                    </div>
                </div>
                <Typography>Order Status</Typography>
                <div className="orderDetailsContainerBox">
                    <div>
                        <p className={order.orderStatus && order.orderStatus==="Delivered" ? "greenColor" : (order.orderStatus==="Shipped" ? "skyColor" : "redColor")}>
                        {order.orderStatus && order.orderStatus}
                        </p>
                    </div>

                    {order.orderStatus && order.orderStatus==="Delivered" ? (
                    <div>
                        <p><b>Delivered On : </b></p>
                        <span>{order.deliveredOn.substring(0, 10)}</span>
                    </div>): (
                        <div></div>
                    )}
                </div>
            </div>
            <div className="orderDetailsCartItems">
                <Typography>Order Items:</Typography>
                <div className="orderDetailsCartItemsContainer">
                    {order.orderItems && order.orderItems.map((item)=>(
                        <div key={item.productId}>
                            <img src={item.image} alt="Product" />
                            <Link to={`/product/${item.productId}`}>{item.name}</Link>
                            <span>{item.quantity} X ₹{item.price} = {" "}<b>₹{item.price * item.quantity}</b></span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    )}
    </>
  )
}

export default OrderDetails