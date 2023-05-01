import {ADD_TO_CART, REMOVE_CART_ITEM, SAVE_SHIPPING_INFO, EMPTY_THE_CART} from "../constants/cartConstants.js";

export const cartReducer = (state={cartItems:[], shippingInfo:{}}, action)=>{
    switch(action.type){
        case ADD_TO_CART:
            const item_to_add = action.payload;
            const isItemExist = state.cartItems.find((i)=>i.productId===item_to_add.productId); //productId means id of product , which is passed from action

            if(isItemExist){
                return{
                    ...state,
                    cartItems:state.cartItems.map((i)=>(i.productId===isItemExist.productId ? item_to_add : i))
                }
            }
            else{
                return{
                    ...state,
                    cartItems:[...state.cartItems, item_to_add]
                }
            }

        case REMOVE_CART_ITEM:
            return{
                ...state,
                cartItems:state.cartItems.filter((i)=>i.productId !== action.payload)
            }

        case EMPTY_THE_CART:
            return{
                ...state,
                cartItems:[]
            }

        case SAVE_SHIPPING_INFO:
            return{
                ...state,
                shippingInfo:action.payload,
            }

        default:
            return state;
    }

}