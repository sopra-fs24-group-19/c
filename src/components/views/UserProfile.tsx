import NavBar from 'components/ui/NavBar';
import { handleError } from "helpers/api";
import User from "models/User";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "styles/views/UserProfile.scss";

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Mock user data
  const mockUser = new User({
    id: 1,
    name: "testname",
    username: "testusername",
    phonenumber: "1234567890"
  });

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
  
    fetchUser();
  }, [id]);

  return (
    <>
      <NavBar />
      <div className="userprofile container">
        <h1>{username}</h1>
        <p>Here, you can see details of {name}</p>
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
    </>
  );
};

export default UserProfile;