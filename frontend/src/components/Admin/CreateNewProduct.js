import React, {useEffect, useState} from 'react';
import "./CreateNewProduct.css";
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, createProduct } from '../../actions/productAction';
import { useAlert } from 'react-alert';
import {Button} from "@material-ui/core";
import MetaData from "../layout/MetaData";
import Sidebar from './Sidebar';
import { NEW_PRODUCT_RESET } from '../../constants/productConstants';
import { useNavigate } from 'react-router-dom';
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const CreateNewProduct = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const alert = useAlert();
    
    const {loading, error, success} = useSelector((state) => state.newProduct_);

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const categories = ["Laptop, PC", "Phone", "Tablet", "Speaker", "Headphone", "Earbuds", "Smartwatch", "Camera", "Air Conditioner", "LED TV", "Refrigerator", "Washing Machine", "Microwave", "Printer", "Others"]
    
    useEffect(() => {
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        if(success){
            alert.success("Product Created Successfully")
            navigate("/admin/dashboard")
            dispatch({type:NEW_PRODUCT_RESET});
        }
    }, [dispatch, alert, error, navigate, success]);
    
    const createProductSubmitHandler = (e)=>{
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("name", name);
        myForm.set("price", price);
        myForm.set("description", description);
        myForm.set("category", category);
        myForm.set("stock", stock);

        images.forEach((image) => {
            myForm.append("images", image)
        })

        dispatch(createProduct(myForm));
    };

    const createProductImagesChange = (e)=>{
        const files = Array.from(e.target.files); //make an array of image-files

        setImages([]);
        setImagesPreview([]);

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
     <MetaData title="Create Product - ADMIN"/>

        <Sidebar/>
     <div className="dashboard">

        <div className="newProductContainer">
            <form
             className='createProductForm'
             encType='multipart/form-data'
             onSubmit={createProductSubmitHandler}>
                <h1>Create Product</h1>

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
                    <CurrencyRupeeIcon/>
                    <input 
                     type="text"
                     placeholder='Price (INR)'
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
                    <select onChange={(e) => setCategory(e.target.value)}>
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
                     onChange={createProductImagesChange}
                     multiple
                    />
                </div>
                <p>ONLY 1 or 2 images, each of size less than 40KB</p>
                {/* showing above taken images */}
                <div id="createProductFormImage">
                    {imagesPreview.map((image, idx) => (
                        <img key={idx} src={image} alt="Product Preview"/>
                    ))}
                </div>
                <Button
                 id="createProductBtn"
                 type="submit"
                 disabled={loading ? true: false}>Create
                 </Button>
            </form>
        </div>
     </div>

    </>
  )
}

export default CreateNewProduct