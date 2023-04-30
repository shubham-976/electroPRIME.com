import React, { useEffect } from 'react'
import { DataGrid } from "@material-ui/data-grid";
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getAllOrders, deleteOrder } from "../../actions/orderAction";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from '@material-ui/core';
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import { DELETE_ORDER_RESET } from '../../constants/orderConstants';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { useState } from 'react';

const OrderList = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const { error, orders, loading } = useSelector((state) => state.allOrders_);
    const { error: deleteError, isDeleted } = useSelector((state) => state.deleteUpdateOrder_)

    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id));
        deleteConfirmBoxToggle(id);
    }

    const [open, setOpen] = useState(false);
    const [orderId, setOrderId] = useState();
    const deleteConfirmBoxToggle = (id) => {
        setOrderId(id);
        open ? setOpen(false) : setOpen(true);
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            alert.success("Order Deleted Successfully");
            navigate('/admin/orders');
            dispatch({ type: DELETE_ORDER_RESET })
        }

        dispatch(getAllOrders());
    }, [dispatch, alert, error, deleteError, navigate, isDeleted])

    const columns = [
        { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },
        { field: "status", headerName: "Status", minWidth: 150, flex: 0.5, cellClassName: (params) => { return params.getValue(params.id, "status") === "Delivered" ? "greenColor" : (params.getValue(params.id, "status") === "Shipped"? "skyColor": "redColor") } },
        { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 120, flex: 0.4 },
        { field: "amount", headerName: "Amount", type: "number", minWidth: 250, flex: 0.5 },
        {
            field: "actions", headerName: "Actions", minWidth: 140, flex: 0.3, type: "number", sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
                            <EditIcon />
                        </Link>

                        <Button onClick={() => deleteConfirmBoxToggle(params.getValue(params.id, "id"))}> {/*this params.id doesnot mean some value from url, this params.id means a value in  cell of this table */}
                            <DeleteIcon />
                        </Button>

                    </>
                )
            }
        },
    ]

    const rows = [];
    orders && orders.forEach((item) => {
        rows.push({
            id: item._id,
            status: item.orderStatus,
            itemsQty: item.orderItems.length,
            amount: item.totalPrice
        })
    });

    return (
        <>
            <MetaData title={`ALL ORDERS - Admin`} />

                <SideBar />
            <div className="dashboard">

                {/* css file of ProductList.js i.e. ProductList.css(in this same folder) is directly styling the below component/page, because we needed same table layout at both place */}
                <div className="productListContainer">
                    <h1 id="productListHeading">ALL ORDERS</h1>

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
            </div>

            {/* confirmation box before deleting */}
            <Dialog
                aria-labelledby="simple-dialog-title"
                open={open}
                onClose={deleteConfirmBoxToggle}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent className='submitDialog'>
                    <p>Are you Sure, you want to delete this Order ?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => deleteConfirmBoxToggle(orderId)} color="secondary">No</Button>
                    <Button onClick={() => deleteOrderHandler(orderId)} color="primary">Yes</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default OrderList