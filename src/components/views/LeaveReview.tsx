import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import NavBar from "components/ui/NavBar";
import { api } from "helpers/api";
import PropTypes from "prop-types";
import { useState } from "react";
import "styles/views/LeaveReview.scss";

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
    const [review, setReview] = useState('');
    const [stars, setStars] = useState('');
  
    const doSubmitReview = async () => {
        const reviewerId = localStorage.getItem('currentUserId');
        const token = localStorage.getItem("token")
        if (!reviewerId) {
          console.error('User is not logged in');
          return;
        }
      
        const requestBody = {
          stars: stars,
          reviewedId: '#',  // Replace with the actual reviewedId
          reviewerId: reviewerId,
          comment: review
        };
      
        try {
          // Uncomment the following lines to make the API request
         
          const response = await api.post('/ratings/1', requestBody, {
            headers: {
              'Content-Type': 'application/json',
              "Authorization": token
            },
          });
          console.log(response.data);
          
        } catch (error) {
          console.error(`Something went wrong: ${error}`);
        }
      };

      return (
        <>
          <NavBar />
          <BaseContainer>
            <div className="review container">
              <h1>Leave a review!</h1>
              <div className="review form">
                <FormField
                  label="Stars"
                  type="number"
                  placeholder="Enter number of stars (1-5)"
                  value={stars}
                  onChange={(s: string) => setStars(s)}
                />
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
                    onClick={() => doSubmitReview()}
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            </div>
          </BaseContainer>
        </>
      );
    };
    
    export default LeaveReview;