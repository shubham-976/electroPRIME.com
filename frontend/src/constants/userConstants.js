// For user login (means signin)
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";

// For user register (means signup)
export const REGISTER_USER_REQUEST = "REGISTER_USER_REQUEST";
export const REGISTER_USER_SUCCESS = "REGISTER_USER_SUCCESS";
export const REGISTER_USER_FAIL = "REGISTER_USER_FAIL";

// For loading user(OURSELF) (means user already registered/logged in, on reloading , state shall contain that user instead of becoming empty on reloading)
export const LOAD_USER_REQUEST = "LOAD_USER_REQUEST";
export const LOAD_USER_SUCCESS = "LOAD_USER_SUCCESS";
export const LOAD_USER_FAIL = "LOAD_USER_FAIL";

//For user logout
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAIL = "LOGOUT_FAIL";

//For user profile update
export const UPDATE_PROFILE_REQUEST = "UPDATE_PROFILE_REQUEST";
export const UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";
export const UPDATE_PROFILE_RESET = "UPDATE_PROFILE_RESET";
export const UPDATE_PROFILE_FAIL = "UPDATE_PROFILE_FAIL";

//For user password update
export const UPDATE_PASSWORD_REQUEST = "UPDATE_PASSWORD_REQUEST";
export const UPDATE_PASSWORD_SUCCESS = "UPDATE_PASSWORD_SUCCESS";
export const UPDATE_PASSWORD_FAIL = "UPDATE_PASSWORD_FAIL";
export const UPDATE_PASSWORD_RESET = "UPDATE_PASSWORD_RESET";

//For user forgot password
export const FORGOT_PASSWORD_REQUEST = "FORGOT_PASSWORD_REQUEST";
export const FORGOT_PASSWORD_SUCCESS = "FORGOT_PASSWORD_SUCCESS";
export const FORGOT_PASSWORD_FAIL = "FORGOT_PASSWORD_FAIL";

//For user reset(after forgot) password
export const RESET_PASSWORD_REQUEST = "RESET_PASSWORD_REQUEST";
export const RESET_PASSWORD_SUCCESS = "RESET_PASSWORD_SUCCESS";
export const RESET_PASSWORD_FAIL = "RESET_PASSWORD_FAIL";

//to get list of all users (ADMIN only)
export const ADMIN_ALL_USER_REQUEST = "ADMIN_ALL_USER_REQUEST";
export const ADMIN_ALL_USER_SUCCESS = "ADMIN_ALL_USER_SUCCESS";
export const ADMIN_ALL_USER_FAIL = "ADMIN_ALL_USER_FAIL";

//to get particular user details (ADMIN only)
export const USER_DETAILS_REQUEST = "USER_DETAILS_REQUEST";
export const USER_DETAILS_SUCCESS = "USER_DETAILS_SUCCESS";
export const USER_DETAILS_FAIL = "USER_DETAILS_FAIL";

//update user(role) (ADMIN only)
export const UPDATE_USER_REQUEST = "UPDATE_USER_REQUEST";
export const UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESS";
export const UPDATE_USER_FAIL = "UPDATE_USER_FAIL";
export const UPDATE_USER_RESET = "UPDATE_USER_RESET";

//delete user (ADMIN only)
export const DELETE_USER_REQUEST = "DELETE_USER_REQUEST";
export const DELETE_USER_SUCCESS = "DELETE_USER_SUCCESS";
export const DELETE_USER_FAIL = "DELETE_USER_FAIL";
export const DELETE_USER_RESET = "DELETE_USER_RESET";


export const CLEAR_ERRORS = "CLEAR_ERRORS";