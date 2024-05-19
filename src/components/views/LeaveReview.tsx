import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import NavBar from "components/ui/NavBar";
import { api } from "helpers/api";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import "styles/views/LeaveReview.scss";
import Popup from './CompletionPopUp.tsx';

const FormField = (props) => {
    return (
      <div className="review field">
        <label className="review label">{props.label}</label>
        {props.type === 'textarea' ? (
          <textarea
            className="review input"
            placeholder={props.placeholder}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
          />
        ) : (
          <input
            type={props.type}
            className="review input"
            placeholder={props.placeholder}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
          />
        )}
      </div>
    );
  };
  
  FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    type: PropTypes.string,
    placeholder: PropTypes.string,
  };

  const LeaveReview = () => {
    const { id: reviewedId, taskId } = useParams();
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    const userStatus  = location.state;

    const [showPopup, setShowPopup] = useState(false);
    const togglePopup = () => {
      setShowPopup(!showPopup);
    };

    const doSubmitReview = async () => {
        
        const reviewerId = sessionStorage.getItem('currentUserId');
        const token = sessionStorage.getItem("token")
        if (!reviewerId) {
          console.error('User is not logged in');
          return;
        }
      
        const requestBody = {
          stars: stars,
          reviewedId: reviewedId.toString(),  
          reviewerId: reviewerId.toString(),
          comment: review,
          taskId: taskId
        };
        try {
          const response = await api.post(`/ratings/${reviewedId}`, requestBody, {
            headers: {
              'Content-Type': 'application/json',
              "Authorization": token
            },
          });
          togglePopup();

        } catch (error) {
          console.error(`Something went wrong: ${error}`);
          alert("Something went wrong while giving feedback! See the console for details.");
        }
      };

      const handlePopupClose = () => {
        navigate(`/userprofile/${reviewedId}`, { state: { taskId: 'none', purpose: "leave-review" }});
      };

      return (
        <>
          <NavBar />
          <BaseContainer>
            <div className="review container">
              <h1>Leave a review!</h1>
              <div className="review form">
              <label className="review label">Stars</label>
                <div style={{ paddingBottom: '20px' }}>
                    <StarRatings
                        rating={stars}
                        starRatedColor="#553842"
                        starHoverColor="#8d6e63"
                        starEmptyColor="#ebe8e5"
                        changeRating={(newRating: number) => setStars(newRating)}
                        numberOfStars={5}
                        name='rating'
                        starDimension="calc(1vw + 2vh + 20px)"
                    />
                </div>
                <FormField
                  label="Your Review"
                  type="textarea"
                  placeholder="Enter your review here..."
                  value={review}
                  onChange={(r: string) => setReview(r)}
                />

                <div className="review button-container">
                  <Button
                    disabled={!review || !stars}
                    width="100%"
                    onClick={() => {doSubmitReview(); // Call your function here
                                   }}
                  >
                    Submit Review
                  </Button>
                  {showPopup && <Popup onClose={handlePopupClose} userStatus={userStatus} />}
                </div>



              </div>
            </div>
          </BaseContainer>
        </>
      );
    };
    
    export default LeaveReview;