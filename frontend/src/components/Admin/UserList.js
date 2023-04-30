import React,{useEffect} from 'react'
import {DataGrid} from "@material-ui/data-grid";
import "./UserList.css";
import {useSelector, useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import {useAlert} from "react-alert";
import { Button } from '@material-ui/core';
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import { useNavigate } from 'react-router-dom';
import {getAllUsers, clearErrors, deleteUser} from "../../actions/userAction"
import { DELETE_USER_RESET } from '../../constants/userConstants';
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { useState } from 'react';

const UserList = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const {error, users, loading} = useSelector((state) => state.allUsers_);  
    const {error: deleteError, isDeleted, message} = useSelector((state) => state.profile_) //becoz in userReducer.js we handled userUpdate(by Admin), userDelete(byAdmin) in profileReducer itself instead of making new reducer for update and delete.

    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id));
        deleteConfirmBoxToggle(id);
    }

    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState();
    const deleteConfirmBoxToggle = (id) => {
        setUserId(id);
        open ? setOpen(false) : setOpen(true);
    }

    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }

        if(deleteError){
            alert.error(deleteError);
            dispatch(clearErrors());
        }

        if(isDeleted){
            alert.success(message);
            navigate('/admin/users');
            dispatch({type:DELETE_USER_RESET})
        }

        dispatch(getAllUsers());
    }, [dispatch, alert, error, deleteError, navigate, isDeleted, message])

    const columns = [
        {field:"id", headerName:"User ID", minWidth:180, flex:0.8},
        {field:"email", headerName:"Email", minWidth:200, flex:1},
        {field:"name", headerName:"Name", minWidth:150, flex:0.5},
        {field:"role", headerName:"Role", minWidth:150, flex:0.3, cellClassName:(params)=>{
          return ( params.getValue(params.id, "role")==="admin" ? "boldGreenColor" : "boldBlueColor");
        }},
        {field:"actions", headerName:"Actions", minWidth:140, flex:0.3, type:"number", sortable:false, 
            renderCell:(params)=>{
                return(
                    <div>
                    <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
                        <EditIcon/>
                    </Link>

                    <Button onClick={() => deleteConfirmBoxToggle(params.getValue(params.id, "id"))}> {/*this params.id doesnot mean some value from url, this params.id means a value in  cell of this table */}
                        <DeleteIcon/>
                    </Button>
                    </div>
                )
            }},
    ] 

    const rows = [];
    users && users.forEach((item)=>{
        rows.push({
            id:item._id,
            name:item.name,
            email:item.email,
            role:item.role
        })
    });

  return (
    <>
        <MetaData title={`ALL USERS - Admin`}/>

            <SideBar/>
        <div className="dashboard">

            <div className="userListContainer"> {/* it automatically uses css file of ProductList.js because we have taken exactly same layout of table from that file without changing div classnames so , ProductList.css of this folder is also styling this file itself. */}
                <h1 className="userListHeading">ALL USERS</h1>
                {loading===false && (
                     <DataGrid
                     rows={rows}
                     columns={columns}
                     pageSize={10}
                     rowsPerPageOptions={[10]}
                     disableSelectionOnClick
                     className='productListTable'
                     autoHeight
                    />
                )}
               
            </div>

             {/* confirmation box before deleting */}
             <Dialog
                aria-labelledby="simple-dialog-title"
                open={open}
                onClose={deleteConfirmBoxToggle}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent className='submitDialog'>
                    <p>Are you Sure, you want to delete this User ?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => deleteConfirmBoxToggle(userId)} color="secondary">No</Button>
                    <Button onClick={() => deleteUserHandler(userId)} color="primary">Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    </>
  )
}

export default UserList