import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "styles/views/UserProfile.scss";
import { User } from "types";


const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);

  const backToOverview = (): void => {
    navigate("/game");
  };

  const logout = async (): Promise<void> => {
    const currentUserId = localStorage.getItem("currentUserId");
    console.log(currentUserId);
    const requestBody = { id: currentUserId };
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
      
    try {
      await api.post("/logout", requestBody, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      navigate("/login");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };
  const goToEdit = () => {
    navigate(`/userprofile/${id}/edit`);
  };
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/users/query", {
          params: {
            userId: id
          },
          headers: {
            "Accept": "application/json"
          }
        });
        setUser(response.data);
      } catch (error) {
        handleError(error);
      }
    };
  
    fetchUser();
  }, [id]);
  
  if (!user) {
    return <div>Loading...</div>;
  };
  
  return (
    <BaseContainer>
      <div className="userprofile container">
        <h1>Profile page of {user.username}</h1>
        <div className="userprofile form">
          <h2>{user.username}&apos;s information</h2>
          <p>Username: {user.username}</p>
          <p>Status: {user.status}</p>
          <p>Creation Date: {user.creationDate}</p>
          <p>Birthday: {user.birthday ? user.birthday : "Not provided"}</p>
          <div className="register button-container">
            <Button width="100%" onClick={() => logout()}>
                  Logout
            </Button>
          </div>
          <div className="register button-container">
            <Button width="100%" onClick={() => backToOverview()}>
                  Back to users overview
            </Button>
          </div>
          <div className="register button-container">
            <Button width="100%" onClick={goToEdit}>
                  Edit
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};
  
export default UserProfile;
