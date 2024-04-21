import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import NavBar from 'components/ui/NavBar';
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "styles/views/HomeFeed.scss";

type Task = {
  id: number;
  creatorId: number;
  description: string;
  price: number;
  time: string;
  date: string;
};

const formatDate = (dateString: string) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// function that will help us filter tasks that are only within certain distance from us
const calculateDistance = (location1: {longitude: number, latitude: number}, location2: {longitude: number, latitude: number}) => {
  // Use the Haversine formula to calculate the distance between two locations
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(location2.latitude - location1.latitude);
  const dLon = deg2rad(location2.longitude - location1.longitude);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(location1.latitude)) * Math.cos(deg2rad(location2.latitude)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI/180);
};



const TaskItem = ({ task }: { task: Task }) => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("currentUserId");

  const handleHelpClick = async () => {
    const userId = localStorage.getItem('currentUserId');
    const token = localStorage.getItem("token")
    if (!userId) {
      console.error('User is not logged in');
      return;
    }

    const requestBody = {
      taskId: task.id,
      userId: userId,
    };

    try {
      const response = await api.put('/apply', requestBody, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": token
        },
      });
      navigate('/myapplications');
    } 
    // catch (error) {
    //   console.error(`Something went wrong: ${error}`);
    // }
    catch (error) {
      if (error.response && error.response.status === 409) {
        alert('You have already applied for this task.');
      } else {
        console.error(`Something went wrong: ${error}`);
      }
    }
  };

  return (
    <div className="task container">
      <div className="task field">
        <span className="task label">Description</span>
        <span className="task answer">{task.description}</span>
      </div>
      <div className="task field">
        <span className="task label">Compensation</span>
        <span className="task answer">{task.compensation} tokens</span>
      </div>
      <div className="task field">
        <span className="task label">Duration</span>
        <span className="task answer">{task.duration}</span>
      </div>
      <div className="task field">
        <span className="task label">Date</span>
        <span className="task answer">{formatDate(task.date)}</span>
      </div>
      {/*<div className="addtasks button-container">
        <Button width="100%" onClick={handleHelpClick}>Help</Button>
      </div>*/}
      <div className="addtasks button-container">
      {task.creatorId.toString() !== userId && (
          <Button width="100%" onClick={handleHelpClick}>Help</Button>
        )}
      </div>
    </div>
  );
};



TaskItem.propTypes = {
  task: PropTypes.object,
};


const HomeFeed = () => {

  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(null);
  const [user, setUser] = useState<User>(null);

  // get info of the current user
  useEffect(() => {
    async function fetchUser() {
      const userId = localStorage.getItem('currentUserId');
      if (!userId) {
        console.error('User is not logged in');
        return;
      }
  
      try {
        const response = await api.get(`/users/${userId}`, {
          headers: {
            'Accept': 'application/json',
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error(`Something went wrong: ${error}`);
      }
    }
  
    fetchUser();
  }, []);


 // get all tasks
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/tasks", {
          headers: {
            "Accept": "application/json"
          }
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        ///// REMOVE THE LINE BELOW ONCE BACKEND IS DONE /////

        setTasks(response.data);


        ///// UNCOMMENT THIS OUT ONCE BACKEND IS DONE /////

        // let tasksData = response.data;

        // // If the user's radius is set, filter the tasks based on the user's radius
        // if (user && user.radius) {
        //   tasksData = tasksData.filter(task => calculateDistance({longitude: user.longitude, latitude: user.latitude}, {longitude: task.longitude, latitude: task.latitude}) <= user.radius);
        // }

        // setTasks(tasksData);


      } catch (error) {
        console.error(
          `Something went wrong while fetching the tasks: \n${handleError(
            error
          )}`
        );
        alert(
          "Something went wrong while fetching the tasks! See the console for details."
        );
      }
    }

    fetchData();
    ///// WHEN BACKEND IS DONE USE [user] /////
  }, []);

  let content = <div>Loading...</div>;

  ///// UNCOMMENT THIS OUT ONCE BACKEND IS DONE /////

  // if (user && !user.radius) {
  //   content = <div>
  //     Hello, we have noticed that your profile is missing a radius setting.<br /><br />
  //     To ensure you are seeing all available tasks within your community, <br />
  // please visit your <Link to="/myprofile">user profile</Link> to update this information.
  //     </div>;
  // } else if (tasks)
  if (tasks) 
  {
    content = (
      <div className="homefeed">
        <ul className="homefeed task-list">
          {tasks && tasks.map((task: Task) => (
            <li key={task.id}>
              <TaskItem task={task} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <>
      <NavBar />
        <BaseContainer className="homefeed container">
          <h2 className="homefeed-title">Discover all tasks in your local community!</h2>
          {content}
      </BaseContainer>
    </>
  );
};

export default HomeFeed;