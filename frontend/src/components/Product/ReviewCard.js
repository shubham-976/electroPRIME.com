import React from 'react'
import profileImg from "../../images/profile.png"
import { Rating } from '@material-ui/lab';

const ReviewCard = ({review}) => {
    const options = {
      value:review.rating,
      readOnly:true,
      precision:0.5
    }
  return (
    <div className="reviewCard">
        <img src={profileImg} alt="User"/>
        <p>{review.name}</p>
        <Rating {...options}/>
        <span className='reviewCardComment'>{review.comment}</span>
    </div>
  )
}

export default ReviewCard