import { Button } from "components/ui/Button";
import NavBar from 'components/ui/NavBar';
import dayjs from "dayjs";
import { api, handleError } from "helpers/api";
import Task from "models/Task";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "styles/views/MyTasks.scss";

const getStatusSymbol = (status) => {
  switch (status) {
    case "CREATED":
      return "OPEN FOR APPLICATION";
    case "CONFIRMED_BY_CREATOR":
    case "DONE":
      return "DONE";
    default:
      return "IN PROGRESS";
  }
};

const FormField = (props) => {
  const dateTime = dayjs(props.date);
  const formattedDateTime = dateTime.format('DD MMMM YYYY, HH:mm') 
  return (
    <div className="mytasks field">
      {/* Task details */}
      <title className="mytasks split-wrapper">
        <label className="mytasks title">{props.task}</label>
        <div className="mytasks status-box">{getStatusSymbol(props.status)}</div>
      </title>
      <section id="taskWrapper" className="mytasks split-wrapper">
        <aside id="taskLeftWrapper" className="mytasks left-wrapper">
          <label className="mytasks label">{"Description"}</label>
          <label className="mytasks content">{props.desc}</label>
          <label className="mytasks label">{"Location"}</label>
          <label className="mytasks content">{props.address}</label>
        </aside>
        <aside id="taskRightWrapper" className="mytasks right-wrapper">
          <label className="mytasks label">{"Date"}</label>
          <label className="mytasks content">{formattedDateTime}</label>
          <label className="mytasks label">{"Duration"}</label>
          <label className="mytasks content">{`${(props.dur / 60).toFixed(2)} hrs`}</label>
          <label className="mytasks label">{"Compensation"}</label>
          <label className="mytasks content">{`${props.comp} coins`}</label>
        </aside>
      </section>
    </div>
  );
};
FormField.propTypes = {
  task: PropTypes.string,
  desc: PropTypes.string,
  address: PropTypes.string,
  date: PropTypes.string,
  dur: PropTypes.number,
  comp: PropTypes.number,
  status: PropTypes.string,
};
// const doDeleteTask = async (taskId) => {
//   try {
//     const response = await api.delete(`/tasks/${taskId}`, 
//     {
//       headers: {"AuthorizationToken":sessionStorage.getItem("token")}
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
  const currentUserId = sessionStorage.getItem("currentUserId")
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [reviewStatuses, setReviewStatuses] = useState({});
  const [helperNames, setHelperNames] = useState<{ [key: number]: string }>({});
  
  const doDeleteTask = async (taskId) => {
    try {
      const response = await api.delete(`/tasks/${taskId}`,
        {
          headers: { "AuthorizationToken": sessionStorage.getItem("token") }
        });
      setTasks(tasks.filter(task => task.id !== taskId));
      alert("You have successfully deleted your task!")
    } catch (error) {
      alert(
        `Something went wrong during the task deletion: \n${handleError(error)}`
      );
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/tasks/created/${currentUserId}`);
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
    if (sessionStorage.getItem("token")) {
      const intervalId = setInterval(fetchData, 2000);
      return () => clearInterval(intervalId);
    }
  }, [currentUserId]);

  const filteredTasks = tasks.filter(task => {
    if (filterStatus === "ALL") return true;
    return task.status === filterStatus;
  });



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

    const fetchIsReviewed = async (taskId) => {
      try {
        const response = await api.get(`/ratings/${taskId}/${currentUserId}/isReviewed`, {
          headers: { "Authorization": sessionStorage.getItem("token") }
        });
        const isReviewed = response.data;  
        setReviewStatuses(prevStatuses => ({
          ...prevStatuses,
          [taskId]: isReviewed
        }));
      } catch (error) {
        console.error(`Failed to fetch review status for task with ID ${taskId}: ${error}`);
        setReviewStatuses(prevStatuses => ({
          ...prevStatuses,
          [taskId]: false 
        }));
      }
    };

   if (tasks.length > 0) {
      fetchHelperNames();
      tasks.forEach(task => {
        fetchIsReviewed(task.id);
      });
    }

    if (sessionStorage.getItem("token")) {
      const intervalId = setInterval(() => {
        tasks.forEach(task => {
          fetchIsReviewed(task.id);
        });
      }, 2000);
      return () => clearInterval(intervalId);
    }
  }, [tasks, currentUserId]);


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
        <br />

        {/* Wrap the tasks in a scrollable element*/}
        <section id="tasksSection" style={{ height: 600, overflow: "auto", width: '100%' }}>
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
                    width="30%"
                    // Maybe we have to think about the status and when to give this option
                    disabled={task.status === "Undone"}
                    onClick={() => navigate(`/candidates`, { state: task.id })}
                  >
                    Check out helpers
                  </Button>
                  <Button
                    width="30%"
                    disabled={task.status === "DONE"}
                    onClick={() => doDeleteTask(task.id)}
                  >
                    Delete task
                  </Button>
                </div>
              ) : (
                getStatusSymbol(task.status) !== "DONE"? (
               <div className="mytasks button-container">
                <p className="mytasks button-replacement">
                  You have chosen {helperNames[task.helperId]} as a helper!
                </p>
                <Button
                  width="30%"
                  onClick={() => navigate(`/todo/${task.id}`)}
                >
                  Check out the To-Do list
                </Button>
                </div>
                ):(


              reviewStatuses[task.id] ? (
              <p style={{fontWeight: 'bold'}}>This task is finished!</p>
              ):(
              <p style={{fontWeight: 'bold'}}>Don{"'"}t forget to{" "}
              <Link

                to={{
                  pathname: `/leavereview/${task.helperId}/${task.id}`,
                  state: { userStatus: "Creator" }
                }}
              >
              leave a review</Link>
              {" "}for your helper!
              </p>
              )



                )
                )}

            </div>
          ))}
        </section>
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
