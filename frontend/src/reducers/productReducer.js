import {ALL_PRODUCT_FAIL, ALL_PRODUCT_REQUEST, ALL_PRODUCT_SUCCESS, PRODUCT_DETAILS_FAIL, PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, CLEAR_ERRORS, NEW_REVIEW_REQUEST, NEW_REVIEW_SUCCESS, NEW_REVIEW_RESET, NEW_REVIEW_FAIL, ADMIN_ALL_PRODUCT_REQUEST, ADMIN_ALL_PRODUCT_SUCCESS, ADMIN_ALL_PRODUCT_FAIL,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_SUCCESS,
    NEW_PRODUCT_FAIL,
    NEW_PRODUCT_RESET,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_RESET,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_RESET,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    ADMIN_ALL_REVIEW_REQUEST,
    ADMIN_ALL_REVIEW_SUCCESS,
    ADMIN_ALL_REVIEW_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_RESET,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAIL,
    RECOMMENDED_PRODUCTS_REQUEST,
    RECOMMENDED_PRODUCTS_SUCCESS,
    RECOMMENDED_PRODUCTS_FAIL
} from "../constants/productConstants";

export const getAllProductsReducer = (state={products:[]}, action)=>{
    switch (action.type){
        case ALL_PRODUCT_REQUEST:
        case ADMIN_ALL_PRODUCT_REQUEST:
            return {
                loading:true,
                products:[]
            }
        case ALL_PRODUCT_SUCCESS:
            return {
                loading:false,
                productsCount:action.payload.productsCount,
                products:action.payload.prods,
                resultPerPage:action.payload.resultPerPage,
                filteredProductsCount:action.payload.filteredProductsCount
            }
        case ADMIN_ALL_PRODUCT_SUCCESS:
            return{
                loading:false,
                products:action.payload
            }
        case ALL_PRODUCT_FAIL:
        case ADMIN_ALL_PRODUCT_FAIL:
            return {
                loading:false,
                error:action.payload
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error:null
            }
        default:
            return state;
    }
};

export const getSingleProductDetailsReducer = (state={product:{}}, action)=>{
    switch (action.type){
        case PRODUCT_DETAILS_REQUEST:
            return {
                loading:true,
                ...state
            }
        case PRODUCT_DETAILS_SUCCESS:
            return {
                loading:false,
                product:action.payload.prod
            }
        case PRODUCT_DETAILS_FAIL:
            return {
                loading:false,
                error:action.payload
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error:null
            }
        default:
            return state;
    }
};

export const newReviewReducer = (state={}, action)=>{
    switch (action.type){
        case NEW_REVIEW_REQUEST:
            return {
                ...state,
                loading:true
            }
        case NEW_REVIEW_SUCCESS:
            return {
                loading:false,
                success:action.payload
            }
        case NEW_REVIEW_FAIL:
            return {
                ...state,
                loading:false,
                error:action.payload
            }
        case NEW_REVIEW_RESET:
            return {
                ...state,
                success:false
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error:null
            }
        default:
            return state;
    }
};


export const newProductReducer = (state={product:{}}, action)=>{
    switch (action.type){
        case NEW_PRODUCT_REQUEST:
            return {
                ...state,
                loading:true
            }
        case NEW_PRODUCT_SUCCESS:
            return {
                loading:false,
                success:action.payload.success,
                product:action.payload.prod
            }
        case NEW_PRODUCT_FAIL:
            return {
                ...state,
                loading:false,
                error:action.payload
            }
        case NEW_PRODUCT_RESET:
            return {
                ...state,
                success:false
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error:null
            }
        default:
            return state;
    }
};

export const deleteUpdateProductReducer = (state={}, action) => {
    switch (action.type){
        case DELETE_PRODUCT_REQUEST:
        case UPDATE_PRODUCT_REQUEST:
            return{
                ...state,
                loading:true
            };
        case DELETE_PRODUCT_SUCCESS:
            return{
                ...state,
                loading:false,
                isDeleted:action.payload
            };
        case UPDATE_PRODUCT_SUCCESS:
            return{
                ...state,
                loading:false,
                isUpdated:action.payload
            };
        case DELETE_PRODUCT_FAIL:
        case UPDATE_PRODUCT_FAIL:
            return{
                ...state,
                loading:false,
                error:action.payload
            };
        case DELETE_PRODUCT_RESET:
            return{
                ...state,
                isDeleted:false
            }
        case UPDATE_PRODUCT_RESET:
            return{
                ...state,
                isUpdated:false
            }
        case CLEAR_ERRORS:
            return{
                ...state,
                error:null
            }
        default:
            return state
    }
}

//for getting all reviews of a particular produxt
export const productReviewsReducer = (state={reviews:[]}, action)=>{
    switch (action.type){
        case ADMIN_ALL_REVIEW_REQUEST:
            return {
                ...state,
                loading:true
            }
        case ADMIN_ALL_REVIEW_SUCCESS:
            return {
                loading:false,
                reviews:action.payload
            }
        case ADMIN_ALL_REVIEW_FAIL:
            return {
                ...state,
                loading:false,
                error:action.payload
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error:null
            }
        default:
            return state;
    }
};

//to update or delete a particualr review of a particular product
export const reviewReducer = (state={}, action)=>{
    switch (action.type){
        case DELETE_REVIEW_REQUEST:
            return {
                ...state,
                loading:true
            }
        case DELETE_REVIEW_SUCCESS:
            return {
                loading:false,
                isDeleted:action.payload
            }
        case DELETE_REVIEW_FAIL:
            return {
                ...state,
                loading:false,
                error:action.payload
            }
        case DELETE_REVIEW_RESET:
            return {
                ...state,
                isDeleted:false
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error:null
            }
        default:
            return state;
    }
};

//to get recommendedProducts for a LOGGED-IN-user, on basis of his past orders categories ONLY
export const getRecommendedProductsReducer = (state={recommendedProducts:[]}, action)=>{
    switch (action.type){
        case RECOMMENDED_PRODUCTS_REQUEST:
            return {
                loading:true,
                recommendedProducts:[]
            }
        case RECOMMENDED_PRODUCTS_SUCCESS:
            return {
                loading:false,
                recommendedProductsCount:action.payload.recommendedProductsCount,
                recommendedProducts:action.payload.recommendedProducts
            }
        case RECOMMENDED_PRODUCTS_FAIL:
            return {
                loading:false,
                error:action.payload
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error:null
            }
        default:
            return state;
    }
};
