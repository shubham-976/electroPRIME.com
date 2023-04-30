import React, { useState, useEffect } from 'react';
import "./UpdatePassword.css";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, updatePassword } from '../../actions/userAction';
import { useAlert } from "react-alert";
import Loader from '../layout/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants';
import MetaData from '../layout/MetaData';
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const UpdatePassword = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const { error, isUpdated, loading } = useSelector((state) => state.profile_);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");


    const updatePasswordSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("oldPassword", oldPassword);
        myForm.set("newPassword", newPassword);
        myForm.set("confirmNewPassword", confirmNewPassword);
        dispatch(updatePassword(myForm));
    }

    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (isUpdated) {
            alert.success("Password Updated Successfully");
            navigate("/account");

            dispatch({ type: UPDATE_PASSWORD_RESET }) //So that isUpdated becomes false
        }
    }, [dispatch, error, alert, navigate, isUpdated]);

    //PasswordVisibiltyHandling
    const [visibility, setVisibility] = useState(false);
    const passwordInputType = (visibility === true ? "text" : "password"); //passowrd means bullets (alphabets are shown as bullets) and text means actual alphabets are shown

    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <MetaData title="electroPRIME | Change Password" />
                    <div className="updatePasswordContainer">
                        <div className="updatePasswordBox">
                            <h2 className='updatePasswordHeading'>Change Password</h2>
                            <form
                                className="updatePasswordForm"
                                encType="application/json"
                                onSubmit={updatePasswordSubmit}
                            >

                                <div className="">
                                    <VpnKeyIcon />
                                    <input
                                        type={passwordInputType}
                                        placeholder="Old Password"
                                        required
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                    {visibility === false && (
                                        <span><VisibilityIcon onClick={() => setVisibility(true)} /></span>
                                    )}
                                    {visibility === true && (
                                        <span><VisibilityOffIcon onClick={() => setVisibility(false)} /></span>
                                    )}
                                </div>
                                <div className="">
                                    <LockOpenIcon />
                                    <input
                                        type={passwordInputType}
                                        placeholder="New Password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    {visibility === false && (
                                        <span><VisibilityIcon onClick={() => setVisibility(true)} /></span>
                                    )}
                                    {visibility === true && (
                                        <span><VisibilityOffIcon onClick={() => setVisibility(false)} /></span>
                                    )}
                                </div>
                                <div className="">
                                    <LockIcon />
                                    <input
                                        type={passwordInputType}
                                        placeholder="Confirm New Password"
                                        required
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    />
                                    {visibility === false && (
                                        <span><VisibilityIcon onClick={() => setVisibility(true)} /></span>
                                    )}
                                    {visibility === true && (
                                        <span><VisibilityOffIcon onClick={() => setVisibility(false)} /></span>
                                    )}
                                </div>

                                <input
                                    type="submit"
                                    value="Change"
                                    className="updatePasswordBtn"
                                />
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default UpdatePassword