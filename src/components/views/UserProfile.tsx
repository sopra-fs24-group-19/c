import NavBar from 'components/ui/NavBar';
import { handleError } from "helpers/api";
import Review from "models/Review";
import User from "models/User";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "styles/views/UserProfile.scss";

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Mock user's review data
  const mockReview = new Review({
    no_of_stars: 126,
    no_of_votes: 28,
    reviews: ["Great user!", "Very helpful!", "Would recommend!", "Very friendly!", "Very reliable!"]
  });

  // Mock user data
  const mockUser = new User({
    id: 1,
    name: "testname",
    username: "testusername",
    phonenumber: "1234567890"
  });


  // State variables for the user's reviews
  const [noOfReviews, setNoOfReviews] = useState<number>(null);
  const [averageReview, setAverageReview] = useState<number>(null);
  const [reviews, setReviews] = useState<string[]>([]);


  // State variables for the user's attributes
  const [username, setUsername] = useState<string>(null);
  const [name, setName] = useState<string>(null);
  const [phonenumber, setPhonenumber] = useState<string>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Uncomment this once the backend is done
        // const response = await api.get(`/users/${id}`, , {
        //   headers: {
        //     "Accept": "application/json"
        //   }
        // });
        // const user = response.data;
  
        // Mock user data - remove this line after backend is done
        const user = mockUser;
  
        setUsername(user.username);
        setName(user.name);
        setPhonenumber(user.phonenumber);
      } catch (error) {
        console.error("Something went wrong while fetching the user: \n" + handleError(error));
        alert("Something went wrong while fetching the user! See the console for details.");
      }
    };

    const fetchRatings = async () => {
      try {
        // Uncomment this once the backend is done
        // const response = await api.get(`/ratings/${id}`, , {
        //   headers: {
        //     "Accept": "application/json"
        //   }
        // });
        // const ratings = response.data;
  
        // Mock ratings data - remove this line after backend is done
        const ratings = mockReview;
  
        setNoOfReviews(ratings.no_of_votes);
        setAverageReview(ratings.no_of_stars / ratings.no_of_votes);
        setReviews(ratings.reviews);
      } catch (error) {
        console.error("Something went wrong while fetching the ratings: \n" + handleError(error));
        alert("Something went wrong while fetching the ratings! See the console for details.");
      }
    };
  
    fetchUser();
    fetchRatings();
  }, [id]);

  return (
    <>
      <NavBar />
      
      <div className="userprofile container">
        <h1>{username}</h1>
        <p>Here, you can see details of {name}</p>
        <p className="rating">{averageReview} &#9733; &nbsp; {noOfReviews} reviews</p>
        <div className="userprofile form">
          <div className="userprofile field">
            <p className="label">Username:</p>
            <p className="input">{username}</p>
          </div>
          <div className="userprofile field">
            <p className="label">Name:</p>
            <p className="input">{name}</p>
          </div>
          <div className="userprofile field">
            <p className="label">Phone Number:</p>
            <p className="input">{phonenumber}</p>
          </div>
        </div>
      </div>

      <div className="userprofile container">
        <div className="userprofile commentsform">
          <p className="label">Comments:</p>
          <div className="userprofile review-list" style={{overflowY: 'scroll', maxHeight: '200px'}}>
            {reviews.slice(0, 3).map((review, index) => (
              <p key={index}>{review}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;