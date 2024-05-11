import NavBar from 'components/ui/NavBar';
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "styles/views/UserProfile.scss";

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const {taskId, purpose} = location.state;


  // State variables for the user's reviews
  const [noOfReviews, setNoOfReviews] = useState<number>(null);
  const [averageReview, setAverageReview] = useState<number>(null);
  const [reviews, setReviews] = useState<string[]>([]);


  // State variables for the user's attributes
  const [username, setUsername] = useState<string>(null);
  const [name, setName] = useState<string>(null);
  const [phonenumber, setPhonenumber] = useState<string>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await api.get(`/users/${id}`, {
          headers: {
            "Accept": "application/json"
          }
        });
        const user = userResponse.data;
  
        setUsername(user.username);
        setName(user.name);
        setPhonenumber(user.phoneNumber);
        setNoOfReviews(user.totalComments); 
        setAverageReview(user.averageStars);

        // Fetch ratings data
        const token = localStorage.getItem("token");
        const ratingsResponse = await api.get(`/ratings/${id}`, {
          headers: {
            "Accept": "application/json",
            "Authorization": token

          }
        });
        const ratings = ratingsResponse.data;

        const reviews = ratings.map(rating => ({
          comment: rating.comment,
          reviewer: rating.reviewer ? rating.reviewer.username : "Anonymous"
        }));
        setReviews(reviews);


      } catch (error) {
        console.error("Something went wrong while fetching the user: \n" + handleError(error));
        alert("Something went wrong while fetching the user! See the console for details.");
      }
    };

  
    fetchData();
    if (localStorage.getItem("token")) {
    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);}
  }, [id]);

  return (
    <>
      <NavBar />
      <div className="userprofile container">
        <h1>{username ? username : "Loading username..."}</h1>
        {/* <p>Here, you can see details of {name ? name : "Loading name..."}</p> */}
        <p className="rating">{averageReview ? averageReview.toFixed(2) : "No reviews yet"} &#9733; &nbsp; {noOfReviews} reviews</p>
        <div className="userprofile form">
          <div className="userprofile field">
            <p className="label">Username:</p>
            <p className="input">{username ? username : "Loading username..."}</p>
          </div>
          <div className="userprofile field">
            <p className="label">Name:</p>
            <p className="input">{name ? name : "Loading name..."}</p>
          </div>
          <div className="userprofile field">
            <p className="label">Phone Number:</p>
            <p className="input">{phonenumber ? phonenumber : "No phone number yet"}</p>
          </div>
        </div>
      </div>

      <div className="userprofile container">
        <h1>Reviews</h1>
          <div className="userprofile reviewform">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <p key={index} style={{ height: "20px"}}>
                  <span style={{ fontWeight: "600" }}>{review.reviewer}:</span> {review.comment}
                </p>
              ))
            ) : (
              <p>No reviews yet</p>
            )}
          </div>

         <div className="mytasks button-container">
              {purpose === "candidate-check" && (
                <Button
                  width="100%"
                  onClick={() => navigate(`/candidates`, { state: taskId })}
                >
                  Back to all helpers
                </Button>
              )}
              {purpose === "leave-review" && (
                <Button
                  width="100%"
                  onClick={() => navigate(`/mytasks`)}
                >
                  Back to all my tasks
                </Button>
              )}
              {purpose === "my-reviews" && (
                <Button
                  width="100%"
                  onClick={() => navigate(`/myprofile`)}
                >
                  Back to my profile
                </Button>
              )}
          </div>
      </div>
    </>
  );
};

export default UserProfile;