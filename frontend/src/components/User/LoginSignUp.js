import React, { useRef, useState, useEffect } from 'react';
import "./LoginSignUp.css";
import { Link } from 'react-router-dom';
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login, register } from '../../actions/userAction';
import { useAlert } from "react-alert";
import Loader from '../layout/Loader/Loader';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import MetaData from '../layout/MetaData';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const LoginSignUp = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const location = useLocation();
    const navigate = useNavigate();

    const { error, loading, isAuthenticated } = useSelector((state) => state.user_);

    const loginTab = useRef(null); //in react we can;t access DOM objects directly, like document.querSelector(".loginForm") will not work, so we need to use useRef() hook and ref for this
    const registerTab = useRef(null);
    const switcherTab = useRef(null);

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [user, setUser] = useState({ name: "", email: "", password: "" });

    const { name, email, password } = user;

    const [avatar, setAvatar] = useState();
    const [avatarPreview, setAvatarPreview] = useState("/profile.png")

    const loginSubmit = (e) => {
        e.preventDefault();
        dispatch(login(loginEmail, loginPassword));
    }

    const registerSubmit = (e) => {
        e.preventDefault();

        if (avatar === undefined || avatar == null) {
            alert.error("Please Upload Profile Picture also.")
            return;
        }

        const myForm = new FormData();

        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("password", password);
        myForm.set("avatar", avatar);
        dispatch(register(myForm));
    }

    const registerDataChange = (e) => {
        if (e.target.name === "avatar") {

            //image size validation, it should be less than<=40KB.
            const imgFileSize = e.target.files[0].size;
            if(imgFileSize > 46080){ //40680 = 45*1024 Bytes = 45KiloBytes = 45KB
                e.target.value = null;
                setAvatarPreview("/profile.png");
                setAvatar();
                alert.error("Image Size exceeded 40KB. Please choose image of size <= 40KB")
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
        else {
            //other things can be simply set
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    }
    const redirectedLink = location.search ? "/" + location.search.split("=")[1] : "/account"; //in url, anything after ?(including ?) is location.string
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (isAuthenticated) {
            navigate(redirectedLink);
        }
    }, [dispatch, error, alert, isAuthenticated, navigate, redirectedLink]);

    const switchTabs = (e, currTab) => {
        if (currTab === "login") {
            //render this
            switcherTab.current.classList.add("shiftToNeutral");
            switcherTab.current.classList.remove("shiftToRight");

            registerTab.current.classList.remove("shiftToNeutralForm");
            loginTab.current.classList.remove("shiftToLeft");
        }
        if (currTab === "register") {
            switcherTab.current.classList.add("shiftToRight");
            switcherTab.current.classList.remove("shiftToNeutral");

            registerTab.current.classList.add("shiftToNeutralForm");
            loginTab.current.classList.add("shiftToLeft");
        }
    }

    //PasswordVisibiltyHandling
    const [visibility, setVisibility] = useState(false);
    const passwordInputType = (visibility === true ? "text" : "password"); //passowrd means bullets (alphabets are shown as bullets) and text means actual alphabets are shown

    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <MetaData title="electroPRIME | Login-Register" />
                    <div className="LoginSignUpContainer">
                        <div className="LoginSignUpBox">
                            <div>
                                <div className="login_signUp_toggle">
                                    <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                                    <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                                </div>
                                <button ref={switcherTab}></button>
                            </div>
                            {/* Login Form */}
                            <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                                <div className="loginEmail">
                                    <MailOutlineIcon />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                    />
                                </div>
                                <div className="loginPassword">
                                    <LockOpenIcon />
                                    <input
                                        type={passwordInputType}
                                        placeholder="Password"
                                        required
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                    />
                                    {visibility === false && (
                                        <span><VisibilityIcon onClick={() => setVisibility(true)} /></span>
                                    )}
                                    {visibility === true && (
                                        <span><VisibilityOffIcon onClick={() => setVisibility(false)} /></span>
                                    )}
                                </div>
                                <Link to="/password/forgot">Forgot Password ?</Link>
                                <input type="submit" value="Login" className='loginBtn' />
                                <div>
                                    <p onClick={(e) => switchTabs(e, "register")}>(Don't have an account ? Register Here)</p>
                                </div>
                            </form>
                            {/* SignUp/Register Form */}
                            <form
                                className="signUpForm"
                                ref={registerTab}
                                encType="multipart/form-data" //for profile img
                                onSubmit={registerSubmit}
                            >
                                <div className="signUpName">
                                    <FaceIcon />
                                    <input
                                        type="text"
                                        placeholder='Name'
                                        required
                                        name="name"
                                        value={name}
                                        onChange={registerDataChange}
                                    />
                                </div>
                                <div className="signUpEmail">
                                    <MailOutlineIcon />
                                    <input
                                        type="email"
                                        placeholder='Email'
                                        required
                                        name="email"
                                        value={email}
                                        onChange={registerDataChange}
                                    />
                                </div>
                                <div className="signUpPassword">
                                    <LockOpenIcon />
                                    <input
                                        type={passwordInputType}
                                        placeholder='Password'
                                        required
                                        name="password"
                                        value={password}
                                        onChange={registerDataChange}
                                    />
                                     {visibility === false && (
                                        <span><VisibilityIcon onClick={() => setVisibility(true)} /></span>
                                    )}
                                    {visibility === true && (
                                        <span><VisibilityOffIcon onClick={() => setVisibility(false)} /></span>
                                    )}
                                </div>
                                <div id="registerImage">
                                    <img src={avatarPreview} alt="Avatar Preview"></img>
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={registerDataChange}
                                    />
                                </div>
                                <p>Image size must be less than 40KB</p>
                                <input
                                    type="submit"
                                    value="Register"
                                    className="signUpBtn"
                                />
                                <div>
                                    <p onClick={(e) => switchTabs(e, "login")}>(Already a registered user ? Login Here)</p>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default LoginSignUp