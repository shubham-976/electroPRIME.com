import React, { useEffect } from 'react'
import { DataGrid } from "@material-ui/data-grid";
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getAllProductsAdmin } from "../../actions/productAction";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from '@material-ui/core';
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import { deleteProduct } from '../../actions/productAction';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';
import { useNavigate } from 'react-router-dom';
import LaunchIcon from "@material-ui/icons/Launch";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { useState } from 'react';

const ProductList = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();

    const { error, products,loading } = useSelector((state) => state.products_);

    const { error: deleteError, isDeleted } = useSelector((state) => state.deleteUpdateProduct_)
    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id));
        deleteConfirmBoxToggle(id);
    }
    const [open, setOpen] = useState(false);
    const [prodId, setProdId] = useState();
    const deleteConfirmBoxToggle = (id) => {
        setProdId(id);
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
            alert.success("Product Deleted Successfully");
            navigate('/admin/dashboard');
            dispatch({ type: DELETE_PRODUCT_RESET })
        }

        dispatch(getAllProductsAdmin());
    }, [dispatch, alert, error, deleteError, navigate, isDeleted])

    const columns = [
        { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },
        { field: "name", headerName: "Name", minWidth: 350, flex: 0.5 },
        { field: "stock", headerName: "Stock", minWidth: 150, flex: 0.3 },
        { field: "price", headerName: "Price(₹)", minWidth: 250, flex: 0.5 },
        {field: "actions", headerName: "Actions", minWidth: 140, flex: 0.3, type: "number", sortable: false,
            renderCell: (params) => {
                return (
                    <div>
                        <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
                            <EditIcon />
                        </Link>

                        <Button onClick={() => deleteConfirmBoxToggle(params.getValue(params.id, "id"))}> {/*this params.id doesnot mean some value from url, this params.id means a value in  cell of this table */}
                            <DeleteIcon />
                        </Button>

                        <Link to={`/product/${params.getValue(params.id, "id")}`}>
                            <LaunchIcon />
                        </Link>
                    </div>
                )
            }
        },
    ]

    const rows = [];
    products && products.forEach((item) => {
        rows.push({
            id: item._id,
            name: item.name,
            stock: item.stock,
            price: item.price
        })
    });

    return (
        <>
            <MetaData title={`ALL PRODUCTS - Admin`} />

            <SideBar />
            <div className="dashboard">

                <div className="productListContainer">
                    <h1 id="productListHeading">ALL PRODUCTS</h1>
                    {loading===false && (
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            disableSelectionOnClick
                            rowsPerPageOptions={[10]}
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
                    <p>Are you Sure, you want to delete this product ?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => deleteConfirmBoxToggle(prodId)} color="secondary">No</Button>
                    <Button onClick={() => deleteProductHandler(prodId)} color="primary">Yes</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ProductList