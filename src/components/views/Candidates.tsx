import { Button } from "components/ui/Button";
import NavBar from 'components/ui/NavBar';
import { api, handleError } from "helpers/api";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "styles/views/Candidates.scss";

const Candidates = () => {
  const navigate = useNavigate();
  //const currentId = localStorage.getItem("UserId")
  const location = useLocation();
  const taskId = location.state;
  const [candidates, setCandidates] = useState<User[]>([]);

  const doAcceptHelper = async (helperId) => {
    try {
      const userId = localStorage.getItem("currentUserId");
      const token = localStorage.getItem("token");
      const requestBody = JSON.stringify({taskId, userId, helperId});
      
      const response = await api.put(`/tasks/${taskId}`, requestBody, {
        headers: { Authorization: token}
      });
      navigate("/mytasks");
    } catch (error) {
            alert(
              `Something went wrong during the selection: \n${handleError(error)}`
            );
    }
  }


  useEffect(() => {
    // Fetch tasks from an API
    async function fetchData() {
    try {
        const response = await api.get(`/candidates/${taskId}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCandidates(response.data);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the tasks: \n${handleError(error)}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the tasks! See the console for details."
        );
      }
    }
    fetchData();

  // const doAcceptHelper = async (helperId) => {
  //   try {
  //     const userId = localStorage.getItem("currentUserId");
  //     const token = localStorage.getItem("token");
  //     const requestBody = JSON.stringify({taskId, userId, helperId});
      
  //     const response = await api.put(`/tasks/${taskId}`, requestBody, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     navigate("/mytasks");
  //   } catch (error) {
  //           alert(
  //             `Something went wrong during the selection: \n${handleError(error)}`
  //           );
  //   }
  // }

  }, []); // Empty dependency array to run the effect only once

  return (
        <>
          <NavBar />
          <div className="candidates container">
            <h1 >Candidates</h1>
            <p>These are your neighbors that would like to help you with this task</p>

          {/* Wrap the candidates in a scrollable element*/}
          <candidates style={{height:600, overflow: "auto", width: 1000}}>
          {candidates.map((candidate: User) => (
          <div className="candidates form" key={candidate.id}>
            <label className="candidates title">
                <name>{candidate.name}</name>
                <img src="profilepic.png" alt="Profile picture" className="img" style={{height:80, borderRadius: '50%'}}/>
            </label>
            <rate className="candidates button-container">
              <Button
              className="candidates button"
              onClick={() => navigate(`/userprofile/${candidate.id}`)}
              >
              Look at Ratings
              </Button>
              <Button
              className="candidates button"
              onClick={() => doAcceptHelper(candidate.id)}
              >
              Accept as helper
              </Button>
            </rate>
          </div>
          ))}
          </candidates>

             <div className="candidates button-container">
                <Button
                  style={{ marginRight: '15px' }}
                  width="100%"
                  onClick={() => navigate("/mytasks")}
                >
                  Back to all my tasks
                </Button>
              </div>
          </div>
         </>
  );
};

export default Candidates;
