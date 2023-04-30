//In product API's, we have written several async-await functions
/*If when those functions are called, like if we have given 'name' of product as a required field/attribute but user has not given any name and called those function,
 then our server will crash, so to handle those things we are writing below Error-Handling function which will implement function simply if no issue is there,
 but if some issue is there while implemnting those function, then below 'catch' will handle this error and server will not crash*/
 //Conclusion : we are putting 'Product API's function' into a try-catch block by using this below thing, otherwise we will have to use try-catch with all Product-API's function explicitly.

 let asyncErrorHandlingFunction = (passed_func)=>(req, res, next)=>{ //(req,res,next) are arguments of passed_function
    Promise.resolve(passed_func(req,res,next)).catch(next) //next() will call that in app.js => errorHandlingFunction()
}

module.exports = asyncErrorHandlingFunction;

