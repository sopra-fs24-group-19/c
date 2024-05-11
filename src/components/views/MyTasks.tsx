import { Button } from "components/ui/Button";
import NavBar from 'components/ui/NavBar';
import { api, handleError } from "helpers/api";
import Task from "models/Task";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "styles/views/MyTasks.scss";

const getStatusSymbol = (status) => {
  switch (status) {
    case "CREATED":
      return "OPEN FOR APPLICATION";
    case "DONE":
      return "DONE";
    default:
      return "IN PROGRESS";
  }
};

const FormField = (props) => {
  const dateTime = new Date(props.date);
  const formattedDateTime = `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
  return (
    <div className="mytasks field">
      {/* Task details */}
      <title className="mytasks split-wrapper">
      <label className="mytasks title">{props.task}</label>
      <div className="mytasks status-box">{getStatusSymbol(props.status)}</div>
      </title>
      <content className="mytasks split-wrapper">
      <left className="mytasks left-wrapper">
      <label className="mytasks label">{"Description"}</label>
      <label className="mytasks content">{props.desc}</label>
      <label className="mytasks label">{"Location"}</label>
      <label className="mytasks content">{props.address}</label>
      </left>
      <right className="mytasks right-wrapper">
      <label className="mytasks label">{"Date"}</label>
      <label className="mytasks content">{formattedDateTime}</label>
      <label className="mytasks label">{"Duration"}</label>
      <label className="mytasks content">{`${(props.dur / 60).toFixed(2)} hrs`}</label>
      <label className="mytasks label">{"Compensation"}</label>
      <label className="mytasks content">{`${props.comp} coins`}</label>
      </right>
      </content>
    </div>
  );
};
FormField.propTypes = {
  task: PropTypes.string,
  desc: PropTypes.string,
  address: PropTypes.string,
  date: PropTypes.string,
  dur: PropTypes.int,
  comp: PropTypes.int,
  status: PropTypes.string,
};
  // const doDeleteTask = async (taskId) => {
  //   try {
  //     const response = await api.delete(`/tasks/${taskId}`, 
  //     {
  //       headers: {"AuthorizationToken":localStorage.getItem("token")}
  //     });
  //     setTasks(tasks.filter(task => task.id !== taskId));
  //   } catch (error) {
  //           alert(
  //             `Something went wrong during the task deletion: \n${handleError(error)}`
  //           );
  //   }
  // }

const MyTasks = () => {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("currentUserId")
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const doDeleteTask = async (taskId) => {
    try {
      const response = await api.delete(`/tasks/${taskId}`, 
      {
        headers: {"AuthorizationToken":localStorage.getItem("token")}
      });
      setTasks(tasks.filter(task => task.id !== taskId));
      alert("You have successfully deleted your task!")
    } catch (error) {
            alert(
              `Something went wrong during the task deletion: \n${handleError(error)}`
            );
    }
  }

  const [helperNames, setHelperNames] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    // Function to fetch helper name
    const fetchHelperName = async (id: number) => {
      try {
        const response = await api.get(`/users/${id}`);
        return response.data.name;
      } catch (error) {
        console.error(`Failed to fetch user with ID ${id}: ${error}`);
      }
    };
  
    // Fetch helper names for all tasks
    const fetchHelperNames = async () => {
      const newHelperNames: { [key: number]: string } = {};
      const fetchPromises = tasks.map(async (task) => {
        if (task.helperId !== 0 && !(task.helperId in helperNames)) {
          newHelperNames[task.helperId] = await fetchHelperName(task.helperId);
        }
      });
  
      await Promise.all(fetchPromises);
  
      // Update the helperNames state
      setHelperNames((prevHelperNames) => ({ ...prevHelperNames, ...newHelperNames }));
    };
  
    fetchHelperNames();
    if (localStorage.getItem("token")) {
    const intervalId = setInterval(fetchHelperNames, 1000);
    return () => clearInterval(intervalId);}
  }, [tasks]);

  useEffect(() => {

    async function fetchData() {
    try {
        const response = await api.get(`/tasks/created/${currentUserId}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setTasks(response.data);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the tasks: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the tasks! See the console for details."
        );
      }
    }
    fetchData();
    if (localStorage.getItem("token")) {
    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);}
  }, []); // Empty dependency array to run the effect only once

  const filteredTasks = tasks.filter(task => {
    if (filterStatus === "ALL") return true;
    return task.status === filterStatus;
  });

  return (
        <>
          <NavBar />
          <div className="mytasks container">
            <h1 >My tasks</h1>
            <p>Here is an overview of all tasks you posted</p>

            <div className="mytasks filter-container">
              <label style={{ marginRight: '10px' }}>Filter by status:</label>
              <select className="mytasks filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="ALL">All</option>
                <option value="CREATED">Open for Application</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            <br/>

          {/* Wrap the tasks in a scrollable element*/}
          <tasks style={{ height: 600, overflowY: 'auto', width: 1000 }}>
          {filteredTasks.map((task: Task) => (
          <div className="mytasks form" key={task.id}>

            {/*Show all needed attributes for a task*/}
            <div className="task-wrapper">
              <FormField
                task={task.title}
                desc={task.description}
                address={task.address}
                date={task.date}
                dur={task.duration}
                comp={task.compensation}
                status={task.status}
              />
            </div>

              {task.helperId === 0 ? (

                <div className="mytasks button-container">
                  <Button
                  style={{ marginRight: '300px' }}
                  width="30%"
                  disabled={task.status === "DONE"}
                  onClick={() => doDeleteTask(task.id)}
                  >
                  Delete task
                  </Button>

                  <Button
                    width="30%"
                    // Maybe we have to think about the status and when to give this option
                    disabled={task.status === "Undone"}
                    onClick={() => navigate(`/candidates`, {state: task.id} )}
                  >
                    Check out helpers
                  </Button>
                </div>

              ) : (
                <div className="mytasks button-container">

                    {task.status === "IN_PROGRESS" && (
                      <Button
                        width="30%"
                        onClick={() => navigate(`/todo/${task.id}`)}
                      >
                        Check out the To-Do list
                      </Button>
                    )}

                    <p className="mytasks button-replacement">
                      You have chosen {helperNames[task.helperId]} as a helper!
                    </p>

                </div>

              )}

              {/* <Button
              width="30%"
              // Maybe we have to think about the status and when to give this option
              disabled={task.status === "Undone"}
              onClick={() => navigate(`/candidates`, {state: task.id} )}
              >
              Check out helpers
              </Button> */}

          </div>
          ))}
          </tasks>
             <div className="mytasks button-container">
                <Button
                  style={{ marginTop: '20px' }}
                  width="200px"
                  onClick={() => navigate("/homefeed")}
                >
                  Back to homefeed
                </Button>
              </div>
          </div>
         </>
  );
};

export default MyTasks;
