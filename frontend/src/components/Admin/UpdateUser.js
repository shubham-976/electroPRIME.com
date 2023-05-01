import React, {useEffect, useState} from 'react';
import "./CreateNewProduct.css";
import "./UpdateUser.css"
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import {Button} from "@material-ui/core";
import MetaData from "../layout/MetaData";
import Sidebar from './Sidebar';
import { UPDATE_USER_RESET } from '../../constants/userConstants';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { getUserDetails, updateUser, clearErrors } from '../../actions/userAction';
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PersonIcon from "@material-ui/icons/Person";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import Loader from "../layout/Loader/Loader.js"

const UpdateUser = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const alert = useAlert();
    const {id} = useParams(); 
    
    const {loading, error, user} = useSelector((state) => state.userDetails_); 
    const {loading:updateLoading, error:updateError, isUpdated} = useSelector((state) => state.profile_); /* becoz we have written updateUser(by admin) and deleteUser(by admin) related reducer in the profileReducer of file userReducer.js instead of making seperate reducer for this */

    const [role, setRole] = useState("");
    
    const userId = id;
    useEffect(() => {
        if(user && user._id!==userId){
            //means if in user state, some other user details are already stored, then we need to store current user details in that
            dispatch(getUserDetails(userId));
         }
         else{
            //means now user state contains the same current user (whose id admin is going through)
            setRole(user.role);
         }

        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        if(updateError){
            alert.error(updateError);
            dispatch(clearErrors());
        }
        if(isUpdated){
            alert.success("User Role Updated Successfully")
            navigate("/admin/users")
            dispatch({type:UPDATE_USER_RESET});
        }
    }, [dispatch, alert, error, navigate, updateError, isUpdated, user, userId]);
    
    const updateUserSubmitHandler = (e)=>{
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("role", role);

        dispatch(updateUser(userId, myForm));
    };

  return (
    <>
     <MetaData title="Update User Role - ADMIN"/>

        <Sidebar/>
     <div className="dashboard">

        <div className="newProductContainer">
            {loading ? <Loader/> : (
                <form                                 /* it automatically uses css file of UpdateProduct.js because we have taken exactly same layout of table from that file without changing div classnames */
                className='createProductForm'
                encType='multipart/form-data'
                onSubmit={updateUserSubmitHandler}>
                   <h1>Update User Role</h1>
   
                   <div>
                       <PersonIcon/>
                       <p>{user.name}</p>
                   </div>
                   <div>
                       <MailOutlineIcon/>
                       <p>{user.email}</p>
                   </div>
                   <div>
                       <VerifiedUserIcon/>
                       <select value={role} onChange={(e) => setRole(e.target.value)}>
                           <option value="">Choose Role</option>
                           <option value="admin">Admin</option>
                           <option value="user">User</option>
                       </select>
                   </div>
                   
                   <Button
                    id="createProductBtn"
                    type="submit"
                    disabled={(updateLoading ? true: false) || (role==="" ? true: false)}>Update
                    </Button>
               </form>
            )}
        </div>
     </div>

    </>
  )
}

export default UpdateUser