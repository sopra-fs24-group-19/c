import NavBar from 'components/ui/NavBar';
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Task from "models/Task"
import "styles/views/MyApplications.scss";

const FormField = (props) => {
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
      <label className="myapplications content">{props.date}</label>
      <label className="myapplications label">{"Duration"}</label>
      <label className="myapplications content">{`${props.dur/60} hrs`}</label>
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
  //const currentUserId = localStorage.getItem("UserId")
  const currentUserId = 1
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Fetch tasks from an API or use any other method to retrieve data
    setTasks([
      { id: "1", title: "Gardening", description: "...", date:"a date", price: "10", address: "...", duration: "30", status:"Undone"},
      { id: "2", title: "Homework", description: "...", date:"a date", price: "15", address: "...", duration: "120", status:"In Progress"},
      { id: "2", title: "Moving", description: "...", date:"a date", price: "20", address: "...", duration: "120", status:"Done"},
    ]);


    async function fetchData() {
    try {
        const response = await api.get(`/tasks/${userId}`);
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

  const doWithdraw = async (task) => {
    try {
      const requestBody = JSON.stringify({description, title, compensation, date, address, duration, creatorId });
      const response = await api.delete(`/tasks/${task.id}/candidates/${currentUserId}`, {}, {});

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
                comp={task.price}
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
