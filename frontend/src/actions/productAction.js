import {ALL_PRODUCT_FAIL, ALL_PRODUCT_REQUEST, ALL_PRODUCT_SUCCESS, PRODUCT_DETAILS_FAIL, PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, CLEAR_ERRORS, NEW_REVIEW_SUCCESS, NEW_REVIEW_FAIL, NEW_REVIEW_REQUEST, ADMIN_ALL_PRODUCT_REQUEST, ADMIN_ALL_PRODUCT_SUCCESS, ADMIN_ALL_PRODUCT_FAIL,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_SUCCESS,
    NEW_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    ADMIN_ALL_REVIEW_REQUEST,
    ADMIN_ALL_REVIEW_SUCCESS,
    ADMIN_ALL_REVIEW_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAIL,
    RECOMMENDED_PRODUCTS_REQUEST,
    RECOMMENDED_PRODUCTS_SUCCESS,
    RECOMMENDED_PRODUCTS_FAIL
} from "../constants/productConstants";
import axios from "axios";

//to get all products (for users: in backend API it also contains filters)
export const getAllProducts = (keyword="", currentPage=1, price=[0,250000], category, avgRating=0)=> async(dispatch)=>{
    try{
        dispatch({type:ALL_PRODUCT_REQUEST});

        let link = `/api/v1/products/?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&avgRating[gte]=${avgRating}`;

        if(category){
            link = `/api/v1/products/?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&avgRating[gte]=${avgRating}`
        }

        const {data} = await axios.get(link);

        dispatch({type:ALL_PRODUCT_SUCCESS, payload: data});
    }
    catch(error){
        dispatch({
            type:ALL_PRODUCT_FAIL,
            payload: error.response.data.message
        });
    }
};

//to get all products(for ADMIN: in backend API it doesnot contain any filter, just return products list)
export const getAllProductsAdmin = () => async(dispatch)=>{
    try{
        dispatch({type:ADMIN_ALL_PRODUCT_REQUEST});

        const {data} = await axios.get("/api/v1/admin/products");

        dispatch({type: ADMIN_ALL_PRODUCT_SUCCESS, payload:data.products});
    }
    catch(error){
        dispatch({type:ADMIN_ALL_PRODUCT_FAIL, payload:error.response.data.message});
    }
}

//to get single product details
export const getSingleProductDetails = (id)=> async(dispatch)=>{
    try{
        dispatch({type:PRODUCT_DETAILS_REQUEST});
        const {data} = await axios.get(`/api/v1/product/${id}`);
        
        dispatch({type:PRODUCT_DETAILS_SUCCESS, payload: data});
    }
    catch(error){
        dispatch({
            type:PRODUCT_DETAILS_FAIL,
            payload: error.response.data.message
        });
    }
};

//new Review
export const newReview = (reviewData)=> async(dispatch)=>{
    try{
        dispatch({type:NEW_REVIEW_REQUEST});

        const config = {headers:{"Content-Type":"application/json"}};
        const {data} = await axios.put(`/api/v1/review`, reviewData, config);
        
        dispatch({type:NEW_REVIEW_SUCCESS, payload: data.success});
    }
    catch(error){
        dispatch({
            type:NEW_REVIEW_FAIL,
            payload: error.response.data.message
        });
    }
};

//creating new Product (admin)
export const createProduct = (productData)=> async(dispatch)=>{
    try{
        dispatch({type:NEW_PRODUCT_REQUEST});

        const config = {headers:{"Content-Type":"application/json"}};
        const {data} = await axios.post(`/api/v1/admin/product/new`, productData, config);
        
        dispatch({type:NEW_PRODUCT_SUCCESS, payload: data});
    }
    catch(error){
        dispatch({
            type:NEW_PRODUCT_FAIL,
            payload: error.response.data.message
        });
    }
};

//updating a Product (admin)
export const updateProduct = (id, productData)=> async(dispatch)=>{
    try{
        dispatch({type:UPDATE_PRODUCT_REQUEST});

        const config = {headers:{"Content-Type":"application/json"}};
        const {data} = await axios.put(`/api/v1/admin/product/${id}`, productData, config);
        
        dispatch({type:UPDATE_PRODUCT_SUCCESS, payload: data.success});
    }
    catch(error){
        dispatch({
            type:UPDATE_PRODUCT_FAIL,
            payload: error.response.data.message
        });
    }
};

//deleting a product (admin)
export const deleteProduct = (id) => async(dispatch) => {
    try{
        dispatch({type:DELETE_PRODUCT_REQUEST});

        const {data} = await axios.delete(`/api/v1/admin/product/${id}`)
        dispatch({type:DELETE_PRODUCT_SUCCESS, payload:data.success})
    }
    catch(error){
        dispatch({type:DELETE_PRODUCT_FAIL, payload:error.response.data.message})
    }
}

//get all reviews of a particular product (using product id) -- (ADMIN only)
export const getProductReviews = (id)=> async(dispatch)=>{
    try{
        dispatch({type:ADMIN_ALL_REVIEW_REQUEST});

        const {data} = await axios.get(`/api/v1/reviews?productId=${id}`);
        
        dispatch({type:ADMIN_ALL_REVIEW_SUCCESS, payload: data.reviews});
    }
    catch(error){
        dispatch({
            type:ADMIN_ALL_REVIEW_FAIL,
            payload: error.response.data.message
        });
    }
};
//delete a particular review (using reviewId) of a particular product (using productId) -- (ADMIN only)
/*in productModel : obviously product has an id and in review[] array each review submitted is also an object, thus each review also has an id in reviews[] array */
export const deleteReview = (productId, reviewId)=> async(dispatch)=>{
    try{
        dispatch({type:DELETE_REVIEW_REQUEST});

        const {data} = await axios.delete(`/api/v1/reviews?productId=${productId}&revId=${reviewId}`);
        
        dispatch({type:DELETE_REVIEW_SUCCESS, payload: data.success});
    }
    catch(error){
        dispatch({
            type:DELETE_REVIEW_FAIL,
            payload: error.response.data.message
        });
    }
};

//to get recommendedProducts for a LOGGED-IN-user, on basis of his past orders categories ONLY
export const getRecommendedProductsIds = () => async(dispatch)=>{
    try{
        dispatch({type:RECOMMENDED_PRODUCTS_REQUEST});

        const {data} = await axios.get(`/api/v1/products/recommended`);
        
        dispatch({type:RECOMMENDED_PRODUCTS_SUCCESS, payload: data});
    }
    catch(error){
        dispatch({
            type:RECOMMENDED_PRODUCTS_FAIL,
            payload: error.response.data.message
        });
    }
}

//clearing errors
export const clearErrors = ()=> async(dispatch)=>{
    dispatch({type: CLEAR_ERRORS});
};
