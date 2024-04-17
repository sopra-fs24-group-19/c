import NavBar from 'components/ui/NavBar';
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Task from "models/Task"
import "styles/views/MyTasks.scss";

const FormField = (props) => {
  return (
    <div className="mytasks field">
      {/* Task details */}
      <title className="mytasks split-wrapper">
      <label className="mytasks title">{props.task}</label>
      <div className="mytasks status-box">{props.status}</div>
      </title>
      <content className="mytasks split-wrapper">
      <left className="mytasks left-wrapper">
      <label className="mytasks label">{"Description"}</label>
      <label className="mytasks content">{props.desc}</label>
      </left>
      <right className="mytasks right-wrapper">
      <label className="mytasks label">{"Date"}</label>
      <label className="mytasks content">{props.date}</label>
      <label className="mytasks label">{"Duration"}</label>
      <label className="mytasks content">{`${props.dur/60} hrs`}</label>
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
  date: PropTypes.string,
  dur: PropTypes.int,
  comp: PropTypes.int,
  status: PropTypes.string,
};


const MyTasks = () => {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("UserId")
  const [tasks, setTasks] = useState<Task[]>([]);

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
    //fetchData();

  const doDeleteTask = async (task) => {
    taskId = task.id;
    try {
      const requestBody = JSON.stringify({taskId});
      const response = await api.delete(`/tasks/${taskId}`, requestBody);

    } catch (error) {
            alert(
              `Something went wrong during the task deleteion: \n${handleError(error)}`
            );
    }
  }


  }, []); // Empty dependency array to run the effect only once

  return (
        <>
          <NavBar />
          <div className="mytasks container">
            <h1 >My tasks</h1>
            <p>Here is an overview of all tasks you posted</p>

          {/* Wrap the tasks in a scrollable element*/}
          <tasks style={{height:600, overflow: "auto", width: 1000}}>
          {tasks.map((task: Task) => (
          <div className="mytasks form" key={task.id}>

            {/*Show all needed attributes for a task*/}
            <div className="task-wrapper">
              <FormField
                task={task.title}
                desc={task.description}
                date={task.date}
                dur={task.duration}
                comp={task.price}
                status={task.status}

              />
            </div>
            <div className="mytasks button-container">
              <Button
              style={{ marginRight: '300px' }}
              width="30%"
              disabled={task.status === "Done"}
              //onClick={() => doDeleteTask(task)}
              >
              Delete task
              </Button>
              <Button
              width="30%"
              disabled={task.status !== "Undone"}
              onClick={() => navigate(`/candidates`, {state: task.id} )}
              >
              Check out helpers
              </Button>
            </div>

          </div>
          ))}
          </tasks>
             <div className="mytasks button-container">
                <Button
                  style={{ marginRight: '10px' }}
                  width="100%"
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
