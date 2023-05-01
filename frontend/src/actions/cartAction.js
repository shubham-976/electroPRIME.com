import { ADD_TO_CART, REMOVE_CART_ITEM, SAVE_SHIPPING_INFO,EMPTY_THE_CART } from "../constants/cartConstants";
import axios from "axios";

//add to cart, a product
export const addItemsToCart = (id, quantity)=> async(dispatch, getState)=>{
        const {data} = await axios.get(`/api/v1/product/${id}`);

        dispatch({
            type:ADD_TO_CART,
            payload:{
                productId:data.prod._id, //extra
                name:data.prod.name,
                price:data.prod.price,
                image:data.prod.images[0].url,
                stock:data.prod.stock,
                quantity, //extra
            }
        });

        //reload krne pr, state empty ho jayegi, cart me se items khali ho jayenge
        //aisa na ho isliye , loacal storage me save krna hoga
        localStorage.setItem("cartItems", JSON.stringify(getState().cart_.cartItems));
}

//remove from cart, a product
export const removeItemsFromCart = (id)=>async(dispatch, getState)=>{
    dispatch({
        type:REMOVE_CART_ITEM,
        payload:id, //id of product which is in cart and we want to remove it from cart
    })

    localStorage.setItem("cartItems", JSON.stringify(getState().cart_.cartItems));
}
//make the cart empty, when order is placed
export const emptyTheCart = () => async(dispatch, getState)=>{
    dispatch({
        type:EMPTY_THE_CART
    })

    localStorage.setItem("cartItems", JSON.stringify(getState().cart_.cartItems));
}

//SAVE_SHIPPING_INFO
export const saveShippingInfo = (data)=>async(dispatch)=>{
    dispatch({
        type:SAVE_SHIPPING_INFO,
        payload: data,
    })
    localStorage.setItem("shippingInfo", JSON.stringify(data));
}