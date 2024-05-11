import NavBar from 'components/ui/NavBar';
import { api, handleError } from "helpers/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "styles/views/Leaderboard.scss"; 

const Leaderboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentUserData, setCurrentUserData] = useState({ rank: "", taskCount: 0 });
  const userId = localStorage.getItem("currentUserId"); 

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/leaderboard');
        setUsers(response.data);

        const currentUserInfo = response.data.find(user => user.id.toString() === userId);
        if (currentUserInfo) {
          setCurrentUserData({ rank: currentUserInfo.rank, taskCount: currentUserInfo.taskCount });
        }
      } catch (error) {
        console.error(`Something went wrong while fetching the leaderboard: \n${handleError(error)}`);
        alert("Something went wrong while fetching the leaderboard! See the console for details.");
      }
    }
    fetchData();
    const intervalId = setInterval(fetchData, 1);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <NavBar />
      <div className="leaderboard container">
        <h1 className="leaderboard title">Leaderboard</h1>
        {currentUserData.taskCount === 0 ? (
        <p className="leaderboard summary">
          {"It looks like you haven't completed any tasks yet..."}
          <br />
          {"Get in touch with your community to help your neighbours and earn a rank"}
        </p>
        ):(
        <p className="leaderboard summary">
          You have completed {currentUserData.taskCount} tasks and your current rank is {currentUserData.rank}.
        </p>
        )}
        <div className="leaderboard header">
          <div className="leaderboard rank-header">Rank</div>
          <div className="leaderboard name-header">Name</div>
          <div className="leaderboard count-header">Tasks Completed</div>
        </div>
        {users.map(user => (
          <div className="leaderboard form" key={user.id}>
            <div className="leaderboard field">
              <div className="leaderboard rank">{user.rank}.</div>
              <div className="leaderboard username">
                <img src="profilepic.png" alt="Profile" className="img" style={{ height: 30, borderRadius: '50%', marginRight: '10px' }}/>
                {user.id.toString() === userId ? `${user.username} (you)` : user.username}
              </div>
              <div className="leaderboard task-count">{user.taskCount}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Leaderboard;
