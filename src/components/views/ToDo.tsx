import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import NavBar from "components/ui/NavBar";
import { api } from "helpers/api";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import "styles/views/ToDo.scss";



const FormField = (props) => {
    return (
      <div className="todo field">
        <label className="todo label">{props.label}</label>
        {props.type === 'textarea' ? (
          <textarea
            className="todo input"
            placeholder={props.placeholder}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
          />
        ) : (
          <input
            type={props.type}
            className="todo input"
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

  const ToDo = () => {
    const [todo, settodo] = useState('');
    const [stars, setStars] = useState(0);
    const navigate = useNavigate();
  
    const doSubmittodo = async () => {
        
        const todoerId = localStorage.getItem('currentUserId');
        const token = localStorage.getItem("token")
        if (!todoerId) {
          console.error('User is not logged in');
          return;
        }
      
        const requestBody = {
          stars: stars,
          todoedId: '#',  // Replace with the actual todoedId
          todoerId: todoerId,
          comment: todo
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
          navigate(`/userprofile/${requestBody.todoedId}`);
          
        } catch (error) {
          console.error(`Something went wrong: ${error}`);
        }
      };

      return (
        <>
          <NavBar />
          <BaseContainer>
            <div className="todo container">
              <h1>Leave a todo!</h1>
              <div className="todo form">
              <label className="todo label">Stars</label>
                    <StarRatings
                    rating={stars}
                    starRatedColor= "#553842" // Color of filled stars
                    starHoverColor="#8d6e63" // Color of stars when hovering
                    starEmptyColor="#ebe8e5" 
                    changeRating={(newRating: number) => setStars(newRating)}
                    numberOfStars={5}
                    name='rating'
                    />
                {/* <FormField
                  label="Stars"
                  type="number"
                  placeholder="Enter number of stars (1-5)"
                  value={stars}
                  onChange={(s: string) => setStars(s)}
                /> */}
                <FormField
                  label="Your todo"
                  type="textarea"
                  placeholder="Enter your todo here..."
                  value={todo}
                  onChange={(r: string) => settodo(r)}
                />
                <div className="todo button-container">
                  <Button
                    disabled={!todo || !stars}
                    width="100%"
                    onClick={() => doSubmittodo()}
                  >
                    Submit todo
                  </Button>
                </div>
              </div>
            </div>
          </BaseContainer>
        </>
      );
    };
    
    export default ToDo;