import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({adminOnly, ele}) => {
    const {loading, isAuthenticated, user} =  useSelector((state)=>state.user_);

    // return (isAuthenticated===true? ele : <Navigate to="/login"/>) //ele means the page for e.g. <Profile/>  passed to it as a props through app.js
    return(
      <>
        {loading===false && (
            isAuthenticated===false ? <Navigate to="/login"/>: (adminOnly===true &&  user.role!=="admin" ? <Navigate to="/login"/> : ele)
        )}
      </>
    )
   
}

export default ProtectedRoute