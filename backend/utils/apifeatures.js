//class name must start from uppercase
/* in url : /bc/xyz/def?key1=something1&key2=something2&so_on
                        everything after ? is "req.query"
                        and req.query.key1 will give something1 if its in url otherwise gives undefined
                            req.query.key2 will give something2 if its in url otherwise gives undefined, so on
                        */
class ApiFeatures{
    constructor(query, queryStr){ //query is some mongodb query like Product.find(), query.str is req.query passed to it.
        this.query = query;
        this.queryStr = queryStr;
    }
    search(){
        let queryObj = {}; //initially empty, e.g.1 {name:"shubham"} e.g.2 {keyword:"xyz"} is an query_object which we have to search. in url it will be like /a/b/c?name=shubham or /a/b/c?keyword=xyz
        let keywordinurl = this.queryStr.keyword;
        if(keywordinurl){ //means its not undefined, means its provided/present in url
            queryObj = {name:{$regex:keywordinurl, $options:"i"}}; // means we have to search object as {name:".....keyword....."} thats also case insensitive
        }
        this.query = this.query.find(queryObj); //becoz product.find().find(some_obj) works same as product.find(some_obj)
        return this;
    }
    filter(){
        let queryStrCopy = {...this.queryStr};//to avoid copy by reference
        //removing some fields for category
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((ele)=> delete queryStrCopy[ele]);

        // console.log(this.queryStr.page)
        //filter for Price and Rating
        /*if in url it is ?price[gt]=1200  , then queryStrCopy will contain {"price":{gt : '1200'}} but before to work in mongodb we need to add 1 $ jsust before gt i.e. {"price":{$gt:'1200'}}*/
        // console.log("before : ",queryStrCopy)
        let mongostr = JSON.stringify(queryStrCopy)
        mongostr = mongostr.replace(/\b(gt|gte|lt|lte)\b/g, (ele)=>`$${ele}`)
        queryStrCopy = JSON.parse(mongostr)
        // console.log("after : ",queryStrCopy)

        this.query = this.query.find(queryStrCopy);
        return this;
    }
    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;

        const toskip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(toskip);
        return this;
    }
}

module.exports = ApiFeatures;