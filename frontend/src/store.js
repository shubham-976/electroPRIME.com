import {createStore, combineReducers, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {composeWithDevTools} from "redux-devtools-extension";
import { deleteUpdateProductReducer, getAllProductsReducer, getRecommendedProductsReducer, getSingleProductDetailsReducer, newProductReducer, newReviewReducer, productReviewsReducer, reviewReducer } from "./reducers/productReducer";
import { allUsersReducer, forgotPasswordReducer, profileReducer, userDetailsReducer, userReducer } from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducer";
import { allOrdersReducer, deleteUpdateOrderReducer, myOrdersReducer, newOrderReducer, orderDetailsReducer } from "./reducers/orderReducer";

const reducer = combineReducers({
    products_:getAllProductsReducer, //for all products, it will contain state of this reducer
    productDetails_:getSingleProductDetailsReducer, //single product details, it will contain state of this reducer
    user_:userReducer,
    profile_:profileReducer,
    forgotPassword_:forgotPasswordReducer,
    cart_:cartReducer,
    newOrder_: newOrderReducer,
    myOrders_: myOrdersReducer,
    orderDetails_:orderDetailsReducer,
    newReview_:newReviewReducer,
    newProduct_:newProductReducer,
    deleteUpdateProduct_:deleteUpdateProductReducer,
    allOrders_:allOrdersReducer,
    deleteUpdateOrder_:deleteUpdateOrderReducer,
    allUsers_:allUsersReducer,
    userDetails_:userDetailsReducer,
    productReviews_:productReviewsReducer,
    review_:reviewReducer,
    recommendations_:getRecommendedProductsReducer
});

let initialState = {
    //its necessary otherwise, on reload, cart_ state will become empty, and nothing will be in cart
    cart_:{
        cartItems:(localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : []),
        shippingInfo:(localStorage.getItem("shippingInfo") ? JSON.parse(localStorage.getItem("shippingInfo")): {})
    }
};

const middleware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;