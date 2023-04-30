import React, { useState, useEffect } from 'react'
import "./ResetPassword.css";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, resetPassword } from '../../actions/userAction';
import { useAlert } from "react-alert";
import Loader from '../layout/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import MetaData from '../layout/MetaData';
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import { useParams } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const ResetPassword = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const { token } = useParams();

    const { error, success, loading } = useSelector((state) => state.forgotPassword_);

    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");


    const resetPasswordSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("newPassword", newPassword);
        myForm.set("confirmNewPassword", confirmNewPassword);
        dispatch(resetPassword(token, myForm));

    }

    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (success) {
            alert.success("Password Reset Successful.");
            navigate("/login");
        }
    }, [dispatch, error, alert, navigate, success]);

    //PasswordVisibiltyHandling
    const [visibility, setVisibility] = useState(false);
    const passwordInputType = (visibility === true ? "text" : "password"); //passowrd means bullets (alphabets are shown as bullets) and text means actual alphabets are shown

    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <MetaData title="electroPRIME | Change Password" />
                    <div className="resetPasswordContainer">
                        <div className="resetPasswordBox">
                            <h2 className='resetPasswordHeading'>Reset Password</h2>
                            <form
                                className="resetPasswordForm"
                                encType="application/json"
                                onSubmit={resetPasswordSubmit}
                            >
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
                                    value="Confirm"
                                    className="resetPasswordBtn"
                                />
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default ResetPassword