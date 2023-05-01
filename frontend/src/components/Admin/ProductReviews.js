import React, { useEffect, useState } from 'react'
import { DataGrid } from "@material-ui/data-grid";
import "./ProductReviews.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProductReviews, deleteReview } from "../../actions/productAction";
import { useAlert } from "react-alert";
import { Button } from '@material-ui/core';
import MetaData from "../layout/MetaData";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import { useNavigate } from 'react-router-dom';
import { DELETE_REVIEW_RESET } from '../../constants/productConstants';
import Star from "@material-ui/icons/Star";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";

const ProductReviews = () => {

  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { error, reviews, loading } = useSelector((state) => state.productReviews_);
  const { error: deleteError, isDeleted } = useSelector((state) => state.review_);

  const [productId, setProductId] = useState("");
  const [wrongIdEntered, setWrongIdEntered] = useState(false);

  const seeProductReviewsHandler = (e) => {
    e.preventDefault();
    setWrongIdEntered(false);
    dispatch(getProductReviews(productId));
  }
  const deleteReviewHandler = (revId) => {
    dispatch(deleteReview(productId, revId)); //reviewId
    deleteConfirmBoxToggle(revId);
  }

  const [open, setOpen] = useState(false);
    const [reviewId, setReviewId] = useState();
    const deleteConfirmBoxToggle = (id) => {
        setReviewId(id);
        open ? setOpen(false) : setOpen(true);
    }

  useEffect(() => {
    // if(productId.length === 24){
    //   dispatch(getProductReviews(productId))
    // }
    if (error) {
      alert.error(error);
      setWrongIdEntered(true);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Review Deleted Successfully");
      navigate('/admin/reviews');
      dispatch({ type: DELETE_REVIEW_RESET })
    }

  }, [dispatch, alert, error, deleteError, navigate, isDeleted, productId])

  const columns = [
    { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },
    { field: "user", headerName: "User", minWidth: 200, flex: 0.6 },
    { field: "comment", headerName: "Comment", minWidth: 350, flex: 1 },
    {
      field: "rating", headerName: "Rating", type: "number", minWidth: 180, flex: 0.4, cellClassName: (params) => {
        return (params.getValue(params.id, "rating") >= 3 ? "greenColor" : "redColor");
      }
    },
    {
      field: "actions", headerName: "Actions", minWidth: 140, flex: 0.3, type: "number", sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => deleteConfirmBoxToggle(params.getValue(params.id, "id"))}> {/*this params.id doesnot mean some value from url, this params.id means a value in  cell of this table */}
              <DeleteIcon />
            </Button>
          </>
        )
      }
    },
  ]

  const rows = [];
  reviews && reviews.forEach((item) => {
    rows.push({
      id: item._id,
      user: item.name,
      rating: item.rating,
      comment: item.comment
    })
  });

  return (
    <>
      <MetaData title={`ALL REVIEWS - Admin`} />

        <SideBar />
      <div className="dashboard">

        <div className="productReviewsContainer">

          <form                                 /* it automatically uses css file of UpdateProduct.js because we have taken exactly same layout of table from that file without changing div classnames */
            className='productReviewsForm'
            onSubmit={seeProductReviewsHandler}>
            <h1 className='productReviewsFormHeading'>Product Reviews</h1>

            <div>
              <Star />
              <input
                type="text"
                placeholder='Enter Product Id'
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={(loading ? true : false) || (productId === "" ? true : false)}>See Reviews
            </Button>
          </form>
          {wrongIdEntered===true ? (<h1 className='productReviewsFormHeading'>No product with such ID</h1>) :(
            loading===false && reviews && reviews.length >= 0 ? (
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                className='productListTable'
                autoHeight
              />):(<h1 className='productReviewsFormHeading'>---</h1>)
          )}
        </div>
         {/* confirmation box before deleting */}
         <Dialog
                aria-labelledby="simple-dialog-title"
                open={open}
                onClose={deleteConfirmBoxToggle}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent className='submitDialog'>
                    <p>Are you Sure, you want to delete this Review ?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => deleteConfirmBoxToggle(reviewId)} color="secondary">No</Button>
                    <Button onClick={() => deleteReviewHandler(reviewId)} color="primary">Yes</Button>
                </DialogActions>
            </Dialog>
      </div>
    </>
  )
}

export default ProductReviews