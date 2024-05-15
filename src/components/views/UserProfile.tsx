import NavBar from 'components/ui/NavBar';
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import "styles/views/UserProfile.scss";
import dayjs from 'dayjs';

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { taskId, purpose } = location.state;


  // State variables for the user's reviews
  const [noOfReviews, setNoOfReviews] = useState<number>(null);
  const [averageReview, setAverageReview] = useState<number>(null);
  const [reviews, setReviews] = useState<any[]>([]);


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
        const token = sessionStorage.getItem("token");
        const ratingsResponse = await api.get(`/ratings/${id}`, {
          headers: {
            "Accept": "application/json",
            "Authorization": token

          }
        });
        const ratings = ratingsResponse.data;

        const reviews = ratings.map(rating => {
          const dateTime = dayjs(rating.creationDate);
          const formattedDateTime = dateTime.format('DD MMMM YYYY, HH:mm') 
          return {
            comment: rating.comment,
            reviewer: rating.reviewer ? rating.reviewer.username : "Anonymous",
            reviewerId: rating.reviewer ? rating.reviewer.id : null,
            creationDate: formattedDateTime,
            stars: rating.stars
          }
        });
        setReviews(reviews);


      } catch (error) {
        console.error("Something went wrong while fetching the user: \n" + handleError(error));
        alert("Something went wrong while fetching the user! See the console for details.");
      }
    };


    fetchData();
    if (sessionStorage.getItem("token")) {
    const intervalId = setInterval(fetchData, 2000);
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
              <div key={index} className='reviewContainer'>
                <span className='reviewTitle'>
                  <Link to={`/userprofile/${review.reviewerId}`} state={{ taskId: 'none', purpose: "leave-review" }} className='reviewLinkToUser'>{review.reviewer}</Link> ({review.creationDate}) - {"★".repeat(review.stars)}</span>
                <span>{review.comment}</span>
              </div>
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
      </div >
    </>
  );
};

export default UserProfile;