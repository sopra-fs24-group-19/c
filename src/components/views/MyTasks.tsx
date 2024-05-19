import { Button } from "components/ui/Button";
import NavBar from 'components/ui/NavBar';
import dayjs from "dayjs";
import { api, handleError } from "helpers/api";
import Task from "models/Task";
import * as PropTypes from "prop-types";
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
  const dateTime = dayjs(props.date);
  const formattedDateTime = dateTime.format('DD MMMM YYYY, HH:mm');
  return (
    <div className="mytasks field">
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

const MyTasks = () => {
  const navigate = useNavigate();
  const currentUserId = sessionStorage.getItem("currentUserId");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/tasks/created/${currentUserId}`);
        setTasks(response.data);
      } catch (error) {
        console.error(`Something went wrong while fetching the tasks: \n${handleError(error)}`);
        alert("Something went wrong while fetching the tasks! See the console for details.");
      }
    };

    if (sessionStorage.getItem("token")) {
      fetchData();  // Fetch initially on component mount
      const intervalId = setInterval(fetchData, 2000);  // Set up an interval to fetch data every 1 seconds
      return () => clearInterval(intervalId);  // Clean up the interval on component unmount
    }
  }, [currentUserId]);  // Dependency on `currentUserId` to avoid unnecessary re-runs

  const doDeleteTask = async (taskId) => {
    try {
      const response = await api.delete(`/tasks/${taskId}`, {
        headers: { "AuthorizationToken": sessionStorage.getItem("token") }
      });
      setTasks(tasks.filter(task => task.id !== taskId));
      alert("You have successfully deleted your task!");
    } catch (error) {
      alert(`Something went wrong during the task deletion: \n${handleError(error)}`);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filterStatus === "ALL") return true;
    return task.status === filterStatus;
  });

  return (
    <>
      <NavBar />
      <div className="mytasks container">
        <h1>My tasks</h1>
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
        <section id="tasksSection" style={{ height: 600, overflowY: 'auto', width: 1000 }}>
          {filteredTasks.map((task: Task) => (
            <div className="mytasks form" key={task.id}>
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
              <div className="mytasks button-container">
                <Button
                  width="30%"
                  disabled={task.status !== "CREATED"}
                  onClick={() => doDeleteTask(task.id)}
                >
                  Delete Task
                </Button>
                <Button
                  width="30%"
                  onClick={() => navigate(`/task/${task.id}`)}
                >
                  View Task
                </Button>
              </div>
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
