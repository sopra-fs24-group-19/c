import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import NavBar from 'components/ui/NavBar';
import { api, handleError } from "helpers/api";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "styles/views/HomeFeed.scss";
import { User } from "types";

type Task = {
  id: number;
  creatorId: number;
  description: string;
  price: number;
  time: string;
  date: string;
  title: string;
  address: string;
  longitude: string;
  latitude: string;
  duration: number;
  compensation: number;
  status: string;
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



const TaskItem = ({ task, myApplications }: { task: Task; myApplications: number[] }) => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("currentUserId");
  const dateTime = new Date(task.date);
  const [hasApplied, setHasApplied] = useState<boolean>(false);
  const formattedDateTime = `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;

  useEffect(() => {
    setHasApplied(myApplications.includes(task.id));
  }, [myApplications, task.id]);

  const handleHelpClick = async () => {
    const userId = sessionStorage.getItem('currentUserId');
    const token = sessionStorage.getItem("token")
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
      alert(`Thanks for your application! We will notify this tasks creator`);
      navigate('/myapplications');
    }
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
      <section id="applicationContent" className="myapplications split-wrapper">
        <aside id="leftApplicationWrapper" className="myapplications left-wrapper">
          <label className="myapplications label">{"Description"}</label>
          <label className="myapplications content">{task.description}</label>
          <label className="myapplications label">{"Location"}</label>
          <label className="myapplications content">{task.address}</label>
        </aside>
        <aside id="rightApplicationWrapper" className="myapplications right-wrapper">
          <label className="myapplications label">{"Date"}</label>
          <label className="myapplications content">{formattedDateTime}</label>
          <label className="myapplications label">{"Duration"}</label>
          <label className="myapplications content">{`${(task.duration / 60).toFixed(2)} hrs`}</label>
          <label className="myapplications label">{"Compensation"}</label>
          <label className="myapplications content">{`${task.compensation} tokens`}</label>
        </aside>
      </section>
      <div className="myapplications button-container">
          {(task.creatorId.toString() === userId)?
          (<em>You created this task!</em>)
          :
          (!hasApplied?
                       (<Button width="40%" onClick={handleHelpClick}>Help</Button>)
                       :
                       (<Button width="40%" disabled={true}>You have already applied to this task!</Button>)
          )
          }
      </div>
    </div>
  );
};
TaskItem.propTypes = {
  task: PropTypes.object,
  myApplications: PropTypes.object,
};


const HomeFeed = () => {

  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(null);
  const [user, setUser] = useState<User>(null);
  const [myApplications, setMyApplications] = useState<number[]>(null);

  // get info of the current user
  useEffect(() => {
    async function fetchUser() {
      const userId = sessionStorage.getItem('currentUserId');
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
    if (sessionStorage.getItem("token")) {
    const intervalId = setInterval(fetchUser, 2000);
    return () => clearInterval(intervalId);}
  }, []);

    // Get all tasks the current user has applied for to avoid double-applications
  useEffect(() => {
    async function fetchMyApplications() {
    try {
        const currentUserId = sessionStorage.getItem('currentUserId');
        //console.log(currentUserId)
        const response = await api.get(`/tasks/appliedfor/${currentUserId}`);
        const taskIds = response.data.map(task => task.id);
        setMyApplications(taskIds);
      } catch (error) {
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching your applications! See the console for details."
        );
      }
    }
    fetchMyApplications();
    if (sessionStorage.getItem("token")) {
    const intervalId = setInterval(fetchMyApplications, 2000);
    return () => clearInterval(intervalId);}
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
        //console.log('Tasks before filtering:', response.data);

        let tasksData = response.data;

        if (user && user.radius) {
          //console.log('User data:', user);
          //console.log('Radius in fetch tasks:', user.radius);
          tasksData = tasksData.filter(task => {
            if (user.radius <= 20) {
                const distance = calculateDistance(
                  {longitude: parseFloat(user.longitude), latitude: parseFloat(user.latitude)},
                  {longitude: parseFloat(task.longitude), latitude: parseFloat(task.latitude)}
                );
                //console.log(`Distance for task ${task.id}:`, distance);
                return distance <= user.radius;
            } else {return true}
          }).filter(task => {
              return task.status === "CREATED";
            }).filter(task => {
              return task.creatorId.toString() !== sessionStorage.getItem('currentUserId');
            });
          //console.log('Tasks after filtering:', tasksData);
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
    if (sessionStorage.getItem("token")) {
    const intervalId = setInterval(fetchData, 2000);
    return () => clearInterval(intervalId);}
  }, [user]);

  let content = <div>Loading...</div>;


  if (user && (!user.radius || !user.address)) {
    content = <div>
      Hello! We have noticed that your profile is missing a radius or address setting.<br /><br />
      To ensure you are seeing all available tasks within your community, <br />
  please visit your <Link to="/myprofile">user profile</Link> to update this information.
      </div>;
  } else if (tasks)
  {
    if (tasks.length === 0) {
      content = <div>Oops, it looks like there are no tasks in your neighborhood!</div>;
    } else {
      content = (
        <div className="homefeed" style={{ height: '75vh', overflowY: 'auto', width: '100%' }}>
          <ul className="homefeed task-list" style={{ listStyleType: 'none', paddingLeft: 0 }}>


              {myApplications && tasks.map((task: Task) => (
                <li key={task.id}>
                  <TaskItem task={task} myApplications={myApplications} />
                </li>
              ))}

          </ul>
        </div>
      );
    }


    // content = (
    //   // <div className="homefeed" style={{ height: '700px', overflow: 'auto', width: '1000px' }}>
    //   <div className="homefeed" style={{ height: '75vh', overflowY: 'auto', width: '100%' }}>
    //     <ul className="homefeed task-list" style={{ listStyleType: 'none', paddingLeft: 0 }}>
    //       {tasks && tasks.map((task: Task) => (
    //         <li key={task.id}>
    //           <TaskItem task={task} />
    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    // );
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