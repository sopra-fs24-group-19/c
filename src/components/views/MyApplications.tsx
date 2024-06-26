import { Button } from "components/ui/Button";
import NavBar from 'components/ui/NavBar';
import dayjs from "dayjs";
import { api, handleError } from "helpers/api";
import Task from "models/Task";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "styles/views/MyApplications.scss";

const getStatusSymbol = (status) => {
  switch (status) {
    case "CREATED":
      return "APPLIED";
    case "CONFIRMED_BY_HELPER":
    case "DONE":
      return "DONE";
   default:
      return "IN PROGRESS";
  }
};

const getDuration = (dur) => {
  switch (dur) {
    case 241:
      return ">4";
   default:
      return (dur / 60).toFixed(2);
  }
}


const FormField = (props) => {
  const dateTime = dayjs(props.date);
  const formattedDateTime = dateTime.format('DD MMMM YYYY, HH:mm')
  return (
    <div className="myapplications field">
      {/* Task details */}
      <title className="myapplications split-wrapper">
        <label className="myapplications title">{props.task}</label>
        <div className="myapplications status-box">{getStatusSymbol(props.status)}</div>
      </title>
      <section id="applicationWrapper" className="myapplications split-wrapper">
        <aside id="applicationLeftWrapper" className="myapplications left-wrapper">
          <label className="myapplications label">{"Description"}</label>
          <label className="myapplications content">{props.desc}</label>
          <label className="myapplications label">{"Location"}</label>
          <label className="myapplications content">{props.address}</label>
        </aside>
        <aside id="applicationRightWrapper" className="myapplications right-wrapper">
          <label className="myapplications label">{"Date"}</label>
          <label className="myapplications content">{formattedDateTime}</label>
          <label className="myapplications label">{"Duration"}</label>
          <label className="myapplications content">{`${getDuration(props.dur)} hrs`}</label>
          <label className="myapplications label">{"Compensation"}</label>
          <label className="myapplications content">{`${props.comp} coins`}</label>
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


const MyApplications = () => {
  const navigate = useNavigate();
  const currentUserId = sessionStorage.getItem("currentUserId");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const userStatus = "Helper;"
  const [reviewStatuses, setReviewStatuses] = useState({});
            

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/tasks/appliedfor/${currentUserId}`);
        setTasks(response.data);

      } catch (error) {
        console.error(
          `Something went wrong while fetching the tasks: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert("Something went wrong while fetching the tasks! See the console for details.");
      }
    }

    fetchData();

    if (sessionStorage.getItem("token")) {
          const intervalId = setInterval(fetchData, 2000);
          return () => clearInterval(intervalId);
        }
      }, [currentUserId]);

  useEffect(() => {
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

    tasks.forEach(task => {
      fetchIsReviewed(task.id);
    });
  }, [tasks, currentUserId]);


  const filteredTasks = tasks.filter(task => {
    if (filterStatus === "ALL") return true;
    return task.status === filterStatus;
  });

  const doWithdraw = async (task) => {
    const taskId = task.id;
    try {
      const token = sessionStorage.getItem("token")
      const response = await api.delete(`/tasks/candidate/${taskId}`, { headers: { "AuthorizationToken": token } });
      alert(`You have just deleted your application, take a look at your Homefeed to find other interesting tasks`);
    } catch (error) {
      alert(
        `Something went wrong during the withdrawal: \n${handleError(error)}`
      );
    }
  }
  //console.log(reviewStatuses)
  return (
    <>
      <NavBar />
      <div className="myapplications container">
        <h1>My applications</h1>
        <p>Here is an overview of all tasks you{"'"}ve applied to</p>
        <div className="mytasks filter-container">
          <label style={{ marginRight: '10px' }}>Filter by status:</label>
          <select className="mytasks filter" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="ALL">All</option>
            <option value="CREATED">Applied</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
        <br />
        <br />
        {/* Wrap the tasks in a scrollable element*/}

        <div className="myapplications" id="taskContainer" style={{ height: '75vh', overflowY: 'auto', width: '100%'}}>
          {filteredTasks.map((task: Task) => (
            <div className="myapplications form" key={task.id}>

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


              {getStatusSymbol(task.status) !== "DONE"? (
              <div className="myapplications button-container">
                <Button
                  width="40%"
                  disabled={getStatusSymbol(task.status) !== "APPLIED"}
                  onClick={() => doWithdraw(task)}
                >
                  Withdraw my application
                </Button>
                <Button
                  width="40%"
                  disabled={getStatusSymbol(task.status) !== "IN PROGRESS"}
                  onClick={() => navigate(`/todo/${task.id}`)}
                >
                  Look at your To-Do list
                </Button>
              </div>
              ):(
              reviewStatuses[task.id] ? (
              <p style={{fontWeight: 'bold'}}>This task is done, thanks for your help!</p>
              ):(
              <p style={{fontWeight: 'bold'}}>Don{"'"}t forget to{" "}
              <Link
                to={{
                  pathname: `/leavereview/${task.creatorId}/${task.id}`,
                  state: { userStatus }
                }}
              >
              leave a review</Link>
              {" "}for this task!
              </p>
              )
              )}




            </div>
          ))}
        </div>
        <div className="myapplications button-container">
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

export default MyApplications;
