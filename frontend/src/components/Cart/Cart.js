import React from 'react';
import "./Cart.css";
import CartItemCard from "./CartItemCard.js";
import { useDispatch, useSelector } from "react-redux";
import { addItemsToCart, removeItemsFromCart } from '../../actions/cartAction';
import { Link } from 'react-router-dom';
import { Typography } from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart"
import { useNavigate } from 'react-router-dom';
import MetaData from '../layout/MetaData';

const Cart = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart_);

    const increaseQuantity = (id, quantity, stock) => {
        const newQty = quantity + 1;
        if (quantity >= stock)
            return;

        dispatch(addItemsToCart(id, newQty));
    }
    const decreaseQuantity = (id, quantity) => {
        const newQty = quantity - 1;
        if (quantity <= 1)
            return;

        dispatch(addItemsToCart(id, newQty));
    }
    const deleteCartItems = (id) => {
        dispatch(removeItemsFromCart(id));
    }

    const placeOrderHandler = () => {
        navigate("/login?redirect=shipping");
    }

    return (
        <>
            <MetaData title="electroPRIME | Your Cart" />
            {cartItems.length === 0 ? (
                <div className="cartPage">
                    <h2>Your Cart</h2>
                    <div className="cartHeader">
                        <p>Product</p>
                        <p>Quantity</p>
                        <p>SubTotal</p>
                    </div>
                    <div className='emptyCart'>
                        <RemoveShoppingCartIcon />
                        <Typography>No product in your Cart</Typography>
                        <Link to="/products">View Products</Link>
                    </div>
                </div>
            ) :
                (<>
                    <div className="cartPage">
                        <h2>Your Cart</h2>

                        <div className="cartHeader">
                            <p>Product</p>
                            <p>Quantity</p>
                            <p>SubTotal</p>
                        </div>

                        {cartItems && cartItems.map((item) => (
                            <div className='cartContainer' key={item.productId}>
                                <CartItemCard item={item} deleteCartItems={deleteCartItems} />

                                <div className="cartInput">
                                    <button onClick={() => decreaseQuantity(item.productId, item.quantity)}>-</button> {/* instead of directly calling decreaseQuantity(), we have used ()=>decreaseQuantity(), its necessary becoz decQuantity() is taking arguments with it and if we call directly then this decQuantity() will be called INFINITE TIMES without even clicking*/}
                                    <input readOnly value={item.quantity} type="number" />
                                    <button onClick={() => increaseQuantity(item.productId, item.quantity, item.stock)}>+</button> {/*same reason as above */}
                                </div>

                                <p className='cartSubtotal'>{`₹${item.price * item.quantity}`}</p>
                            </div>
                        ))}

                        <div className='cartGrandtotal'>
                            <div className='cartGrandtotalBox'>
                                <p>Grand Total</p>
                                <p>:</p>
                                <p>{`₹${cartItems.reduce((accumulator, currItem) => accumulator + currItem.quantity * currItem.price, 0)}`}</p> {/*array.reduce()  is function to do some operation on each "ele" of array and final answer will be returned, refernece : mdn docs*/}
                            </div>
                            <div className='placeOrderBtn'>
                                <button onClick={placeOrderHandler}>Place Order</button>
                            </div>
                        </div>
                    </div>
                </>)}
        </>
    )
}

export default Cart