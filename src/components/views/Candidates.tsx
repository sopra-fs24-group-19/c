import { Button } from "components/ui/Button";
import NavBar from 'components/ui/NavBar';
import { api, handleError } from "helpers/api";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "styles/views/Candidates.scss";
import { User } from "types";

const Candidates = () => {
  const navigate = useNavigate();
  //const currentId = sessionStorage.getItem("UserId")
  const location = useLocation();
  const taskId = location.state;
  const [candidates, setCandidates] = useState<User[]>([]);

  const doAcceptHelper = async (helperId) => {
    try {
      const userId = sessionStorage.getItem("currentUserId");
      const token = sessionStorage.getItem("token");
      const requestBody = JSON.stringify({ taskId, userId, helperId });

      const response = await api.put(`/tasks/${taskId}`, requestBody, {
        headers: { Authorization: token }
      });
      alert(`You have successfully selected your helper! Check out the To-Do list to give your helper detailed instructions`);
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
    if (sessionStorage.getItem("token")) {
    const intervalId = setInterval(fetchData, 2000);
    return () => clearInterval(intervalId);}
  }, []); // Empty dependency array to run the effect only once

  return (
    <>
      <NavBar />
      <div className="candidates container">
        <h1 >Candidates</h1>
        <p>These are your neighbors that would like to help you with this task</p>

        {/* Wrap the candidates in a scrollable element*/}
        <section id="candidatesSection" style={{ height: 600, overflow: "auto", width: '100' }}>
          {candidates.map((candidate: User) => (
            <div className="candidates form" key={candidate.id}>
              <label className="candidates title">
                <span id="candidateName">{candidate.name}</span>
                <img src={process.env.PUBLIC_URL + "/profilepic.ico"} alt="Profile picture" className="img" style={{ height: 80, borderRadius: '50%' }} />
              </label>
              <section id="candidateRating" className="candidates button-container">
                <Button
                  className="candidates button"
                  onClick={() => navigate(`/userprofile/${candidate.id}`, { state: { taskId: taskId, purpose: "candidate-check" } })}
                >
                  Look at Ratings
                </Button>
                <Button
                  className="candidates button"
                  onClick={() => doAcceptHelper(candidate.id)}
                >
                  Accept as helper
                </Button>
              </section>
            </div>
          ))}
        </section>

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
