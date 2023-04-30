import React, {useEffect, useState} from 'react';
import "./CreateNewProduct.css";
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, updateProduct, getSingleProductDetails } from '../../actions/productAction';
import { useAlert } from 'react-alert';
import {Button} from "@material-ui/core";
import MetaData from "../layout/MetaData";
import Sidebar from './Sidebar';
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants';
import { useNavigate } from 'react-router-dom';
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import { useParams } from 'react-router-dom';

const UpdateProduct = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const alert = useAlert();
    const {id} = useParams(); //from url
    
    const {loading, error:updateError, isUpdated} = useSelector((state) => state.deleteUpdateProduct_);
    const {error, product} = useSelector((state) => state.productDetails_);

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([])
    const [imagesPreview, setImagesPreview] = useState([]);
    const categories = ["Laptop, PC", "Phone", "Tablet", "Speaker", "Headphone", "Earbuds", "Smartwatch", "Camera", "Air Conditioner", "LED TV", "Refrigerator", "Washing Machine", "Microwave", "Printer", "Others"]
    
    const productId = id; //from url 

    useEffect(() => {

         if(product && product._id!==productId){
            //means if in product state, some other product details are stored, then we need to store current product details in that
            dispatch(getSingleProductDetails(productId));
         }
         else{
            //means now product state contains the same current product
            setName(product.name);
            setDescription(product.description);
            setPrice(product.price);
            setCategory(product.category);
            setStock(product.stock);
            setOldImages(product.images);
         }

        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        if(updateError){
            alert.error(updateError);
            dispatch(clearErrors());
        }
        if(isUpdated){
            alert.success("Product Details Updated Successfully")
            navigate("/admin/products")
            dispatch({type:UPDATE_PRODUCT_RESET});
        }
    }, [dispatch, alert, error, navigate, isUpdated, productId, product, updateError]);
    
    const updateProductSubmitHandler = (e)=>{
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("name", name);
        myForm.set("price", price);
        myForm.set("description", description);
        myForm.set("category", category);
        myForm.set("stock", stock);

        images.forEach((image_) => {
            myForm.append("images", image_)
        })

        dispatch(updateProduct(productId, myForm));
    };

    const updateProductImagesChange = (e)=>{
        const files = Array.from(e.target.files); //make an array of image-files

        setImages([]);
        setImagesPreview([]);
        setOldImages([]);

        files.forEach((file) => {
            const reader = new FileReader(); //FileReader API is needed to take finput file and put them in some variable / or render(preview) them

            reader.onload = () => {
                if(reader.readyState === 2){
                    setImages((old) => [...old, reader.result]);
                    setImagesPreview((old) => [...old, reader.result]);
                }
            }
            reader.readAsDataURL(file)
        })
    }

  return (
    <>
     <MetaData title="Update Product - ADMIN"/>

        <Sidebar/>
     <div className="dashboard">

        <div className="newProductContainer">
            <form
             className='createProductForm'
             encType='multipart/form-data'
             onSubmit={updateProductSubmitHandler}>
                <h1>Update Product Details</h1>

                <div>
                    <SpellcheckIcon/>
                    <input 
                     type="text"
                     placeholder='Product Name'
                     required
                     value={name}
                     onChange={(e)=>setName(e.target.value)}
                    />
                </div>
                <div>
                    <AttachMoneyIcon/>
                    <input 
                     type="text"
                     placeholder='Price (INR)'
                     value={price}
                     required
                     onChange={(e) => setPrice(e.target.value)}
                     />
                </div>
                <div>
                    <DescriptionIcon/>
                    <textarea 
                     placeholder='Product Description'
                     value={description}
                     rows="1"
                     cols="30"
                     onChange={(e) => setDescription(e.target.value)}
                     ></textarea>
                </div>
                <div>
                    <AccountTreeIcon/>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Choose Category</option>
                        {categories.map((cate)=>(
                            <option key={cate} value={cate}>
                                {cate}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <StorageIcon/>
                    <input
                     type="number"
                     placeholder='Stock'
                     value={stock}
                     required
                     onChange={(e) => setStock(e.target.value)}
                    />
                </div>
                {/* taking one or more image Files as input, at once */}
                <div id="createProductFormFile">
                    <p>Images</p>
                    <input 
                     type="file"
                     name="avatar"
                     accept="image/*"
                     onChange={updateProductImagesChange}
                     multiple
                    />
                </div>
                <p>ONLY 1 or 2 images, each of size less than 40KB</p>
                {/* showing already exising images of this product*/}
                <div id="createProductFormImage">
                    {oldImages.map((pic, idx) => (
                        <img key={idx} src={pic.url} alt="Old ImageS Preview"/>
                        //becoz in oldImages[], every image is already stored in images[] of product_model, which are uploaded on cloudinary already, thus using image.url
                    ))}
                </div>
                {/* showing above taken images (whcih are taken as input now) */}
                <div id="createProductFormImage">
                    {imagesPreview.map((image, idx) => (
                        <img key={idx} src={image} alt="New ImageS Preview"/>
                        //becoz in previewImages[], every image is just taken as input from local storage now, they are not uploaded on cloudinary yet, thus can't use image.url, these images are just directly present in previewImages[] , thus directly using that {image} instead of {image.url}
                    ))}
                </div>
                <Button
                 id="createProductBtn"
                 type="submit"
                 disabled={loading ? true: false}>Update
                 </Button>
            </form>
        </div>
     </div>

    </>
  )
}

export default UpdateProduct