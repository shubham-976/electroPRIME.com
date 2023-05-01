import React, { useState, useEffect } from 'react';
import "./UpdateProfile.css";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import FaceIcon from "@material-ui/icons/Face";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, loadUser, updateProfile } from '../../actions/userAction';
import { useAlert } from "react-alert";
import Loader from '../layout/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants';
import MetaData from '../layout/MetaData';

const UpdateProfile = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.user_);
    const { error, isUpdated, loading } = useSelector((state) => state.profile_);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("/profile.png");

    const updateProfileSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("avatar", avatar);
        dispatch(updateProfile(myForm));
    }

    const updateProfileDataChange = (e) => {

        //image size validation, it should be less than<=40KB.
        const imgFileSize = e.target.files[0].size;
        if(imgFileSize > 46080){ //40680 = 45*1024 Bytes = 45KiloBytes = 45KB
            e.target.value = null;
            setAvatarPreview(user.avatar.url);
            setAvatar("");
            alert.error("Image Size exceeded 40KB. Either choose image of size <= 40KB or leave it as it is")
            return;
        }  

        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    }

    useEffect(() => {

        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url);
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (isUpdated) {
            alert.success("Profile Updated Successfully");
            dispatch(loadUser());
            navigate("/account");

            dispatch({ type: UPDATE_PROFILE_RESET }) //So that isUpdated becomes false
        }
    }, [dispatch, error, alert, navigate, user, isUpdated]);

    return (
       <>
       {loading? <Loader/> : (
         <>
         <MetaData title="electroPRIME | Update Profile"/>
             <div className="updateProfileContainer">
                 <div className="updateProfileBox">
                     <h2 className='updateProfileHeading'>Update Profile</h2>
                     <form
                         className="updateProfileForm"
                         encType="multipart/form-data" //for profile img
                         onSubmit={updateProfileSubmit}
                     >
                         <div className="updateProfileName">
                             <FaceIcon />
                             <input
                                 type="text"
                                 placeholder='Name'
                                 required
                                 name="name"
                                 value={name}
                                 onChange={(e)=>setName(e.target.value)}
                             />
                         </div>
                         <div className="updateProfileEmail">
                             <MailOutlineIcon />
                             <input
                                 type="email"
                                 placeholder='Email'
                                 required
                                 name="email"
                                 value={email}
                                 onChange={(e)=>setEmail(e.target.value)}
                             />
                         </div>
                         <div id="updateProfileImage">
                             <img src={avatarPreview} alt="Avatar Preview"></img>
                             <input
                                 type="file"
                                 name="avatar"
                                 accept="image/*"
                                 onChange={updateProfileDataChange}
                             />
                         </div>
                         <p>Image Size must be less than 40KB</p>
                         <input
                             type="submit"
                             value="Update"
                             className="updateProfileBtn"
                         />
                     </form>
                 </div>
             </div>
         </>
       )}
       </>
    )
}

export default UpdateProfile