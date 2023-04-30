// 'Error' is by default a predefied class present in node.js, but this class can have just one parameter that is "some_message"
// but we want to send 2 things "some_message",statuscode : for this task we are defining a new custom class i.e. 'ErrorHandler' which we will use when some error is encountered.
//This custom class which we are defining is using some built in properties of predefined class i.e. Error

class ErrorHandler extends Error{
    constructor(message_, statuscode_){
        super(message_);                     //message, statusCode are like attributes of ErrorHandler class object. message is already an attribute of 'Error' class object.
        this.statusCode = statuscode_;
    }
}

module.exports = ErrorHandler;