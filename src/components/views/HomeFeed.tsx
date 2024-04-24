import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import NavBar from 'components/ui/NavBar';
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "styles/views/HomeFeed.scss";

type Task = {
  id: number;
  creatorId: number;
  description: string;
  price: number;
  time: string;
  date: string;
};


// const formatDate = (dateString: string) => {
//   const options = { year: 'numeric', month: 'long', day: 'numeric' };
//   return new Date(dateString).toLocaleDateString(undefined, options);
// }

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
  const dateTime = new Date(task.date);
  const formattedDateTime = `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;

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
    <div className="myapplications form">
      <title className="myapplications split-wrapper">
        <label className="myapplications title">{task.title}</label>
      </title>
      {/* <div className="myapplications split-wrapper">
        <label className="myapplications title">{task.title}</label>
      </div> */}
      <content className="myapplications split-wrapper">
        <left className="myapplications left-wrapper">
          <label className="myapplications label">{"Description"}</label>
          <label className="myapplications content">{task.description}</label>
        </left>
        <right className="myapplications right-wrapper">
          <label className="myapplications label">{"Date"}</label>
          <label className="myapplications content">{formattedDateTime}</label>
          <label className="myapplications label">{"Duration"}</label>
          <label className="myapplications content">{`${(task.duration / 60).toFixed(2)} hrs`}</label>
          <label className="myapplications label">{"Compensation"}</label>
          <label className="myapplications content">{`${task.compensation} tokens`}</label>
        </right>
      </content>
      <div className="myapplications button-container">
        {/* {task.creatorId.toString() !== userId && (
          <Button width="40%" onClick={handleHelpClick}>Help</Button>
        )} */}
        {task.creatorId.toString() === userId ? (
          <em>You created this task!</em>
        ) : (
          <Button width="40%" onClick={handleHelpClick}>Help</Button>
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

        let tasksData = response.data;

        if (user && user.radius) {
          tasksData = tasksData.filter(task => 
            calculateDistance(
              {longitude: parseFloat(user.longitude), latitude: parseFloat(user.latitude)}, 
              {longitude: parseFloat(task.longitude), latitude: parseFloat(task.latitude)}
            ) <= user.radius
          );
        }

        setTasks(tasksData);


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
  }, [user]);

  let content = <div>Loading...</div>;


  if (user && (!user.radius || !user.address)) {
    content = <div>
      Hello, we have noticed that your profile is missing a radius or address setting.<br /><br />
      To ensure you are seeing all available tasks within your community, <br />
  please visit your <Link to="/myprofile">user profile</Link> to update this information.
      </div>;
  } else if (tasks)
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