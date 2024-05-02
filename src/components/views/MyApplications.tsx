import { Button } from "components/ui/Button";
import NavBar from 'components/ui/NavBar';
import { api, handleError } from "helpers/api";
import Task from "models/Task";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "styles/views/MyApplications.scss";

const FormField = (props) => {
  const dateTime = new Date(props.date);
  const formattedDateTime = `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
  return (
    <div className="myapplications field">
      {/* Task details */}
      <title className="myapplications split-wrapper">
      <label className="myapplications title">{props.task}</label>
      <div className="myapplications status-box">{props.status}</div>
      </title>
      <content className="myapplications split-wrapper">
      <left className="myapplications left-wrapper">
      <label className="myapplications label">{"Description"}</label>
      <label className="myapplications content">{props.desc}</label>
      </left>
      <right className="myapplications right-wrapper">
      <label className="myapplications label">{"Date"}</label>
      <label className="myapplications content">{formattedDateTime}</label>
      <label className="myapplications label">{"Duration"}</label>
      <label className="myapplications content">{`${(props.dur / 60).toFixed(2)} hrs`}</label>
      <label className="myapplications label">{"Compensation"}</label>
      <label className="myapplications content">{`${props.comp} coins`}</label>
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


const MyApplications = () => {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("currentUserId");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchData() {
    try {
        const response = await api.get(`/tasks/appliedfor/${currentUserId}`);
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

  const doWithdraw = async (task) => {
    taskId = task.id;
    try {
      const requestBody = JSON.stringify({taskId, currentUserId});
      const response = await api.delete(`/tasks/${taskId}/candidates/${currentUserId}`, requestBody);

    } catch (error) {
            alert(
              `Something went wrong during the withdrawal: \n${handleError(error)}`
            );
    }
  }


  }, []); // Empty dependency array to run the effect only once

  return (
        <>
          <NavBar />
          <div className="myapplications container">
            <h1 >My applications</h1>
            <p>Here is an overview of all tasks you{"'"}ve applied to</p>

          {/* Wrap the tasks in a scrollable element*/}
          <tasks style={{height:600, overflow: "auto", width: 1000}}>
          {tasks.map((task: Task) => (
          <div className="myapplications form" key={task.id}>

            {/*Show all needed attributes for a task*/}
            <div className="task-wrapper">
              <FormField
                task={task.title}
                desc={task.description}
                date={task.date}
                dur={task.duration}
                comp={task.compensation}
                status={task.status}

              />
            </div>
            <div className="myapplications button-container">
              <Button
              width="40%"
              disabled={task.status !== "Undone"}
              //onClick={() => doWithdraw(task)}
              >
              Withdraw my application
              </Button>
              <>
              {task.status === "IN_PROGRESS" && (
                <Button
                  width="30%"
                  onClick={() => navigate(`/todo/${task.id}`)}
                >
                  Start your To-Do list
                </Button>
              )}
              </>
              
            </div>

          </div>
          ))}
          </tasks>
             <div className="myapplications button-container">
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

export default MyApplications;
