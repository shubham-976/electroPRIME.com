import React, { useState, useEffect } from 'react'
import "./ForgotPassword.css";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, forgotPassword } from '../../actions/userAction';
import { useAlert } from "react-alert";
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { Button } from '@material-ui/core';


const ForgotPassword = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const {error, message, loading} = useSelector((state)=>state.forgotPassword_);

  const [email, setEmail] = useState("");

  const forgotPasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("email", email);
    dispatch(forgotPassword(myForm));
    popupBoxToggle();
}

const [open, setOpen] = useState(false);
const popupBoxToggle = () => {
    open ? setOpen(false) : setOpen(true);
}

useEffect(() => {

  if (error) {
      alert.error(error);
      dispatch(clearErrors());
  }
  if (message) {
      alert.success(message);
  }
}, [dispatch, error, alert, message]);

  return (
    <>
    {loading? <Loader/> : (
      <>
      <MetaData title="Forgot Password"/>
          <div className="forgotPasswordContainer">
              <div className="forgotPasswordBox">
                  <h2 className='forgotPasswordHeading'>Forgot Password</h2>
                  <form
                      className="forgotPasswordForm"
                      onSubmit={forgotPasswordSubmit}
                  >
                      <div className="forgotPasswordEmail">
                          <MailOutlineIcon />
                          <input
                              type="email"
                              placeholder='Enter your Email'
                              required
                              name="email"
                              value={email}
                              onChange={(e)=>setEmail(e.target.value)}
                          />
                      </div>
                      <input
                          type="submit"
                          value="Proceed"
                          className="forgotPasswordBtn"
                      />
                  </form>
              </div>
          </div>
          {/* Popup box appears to inform user to check mail and follow url in mail to reset password. */}
          <Dialog
                aria-labelledby="simple-dialog-title"
                open={open}
                onClose={popupBoxToggle}>
                <DialogTitle>Check Your Email</DialogTitle>
                <DialogContent className='submitDialog'>
                    <p id="popupMessage">Password Recovery 'email' sent to {email}. Please use the URL provided in that 'email' to RESET your password.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={popupBoxToggle} color="primary">OK</Button>
                </DialogActions>
            </Dialog>
      </>
    )}
    </>
  )
}

export default ForgotPassword