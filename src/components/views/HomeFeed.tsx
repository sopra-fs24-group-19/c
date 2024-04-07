import BaseContainer from "components/ui/BaseContainer";
import NavBar from 'components/ui/NavBar';
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

const TaskItem = ({ task }: { task: Task }) => (
    <div className="task container">
      <div className="task field">
        <span className="task label">Id of a person that created the task:</span>
        <span className="task answer">{task.creatorId}</span>
      </div>
      <div className="task field">
        <span className="task label">Description:</span>
        <span className="task answer">{task.description}</span>
      </div>
      <div className="task field">
        <span className="task label">Compensation:</span>
        <span className="task answer">{task.price} tokens</span>
      </div>
      <div className="task field">
        <span className="task label">Time needed to complete the task:</span>
        <span className="task answer">{task.time}</span>
      </div>
      <div className="task field">
        <span className="task label">Date:</span>
        <span className="task answer">{task.date}</span>
      </div>
    </div>
);

TaskItem.propTypes = {
  task: PropTypes.object,
};

const mockTasks: Task[] = [
  { id: 1, creatorId: 1, description: 'Description of Task 1', price: 20, time: '1:00', date: '2024-05-05' },
  { id: 2, creatorId: 2, description: 'Description of Task 2', price: 35, time: '2:00', date: '2024-06-52' },
];

const HomeFeed = () => {

  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(null);

  useEffect(() => {
    /*
    async function fetchData() {
      try {
        const response = await api.get("/tasks", {
          headers: {
            "Accept": "application/json"
          }
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setTasks(response.data);
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
    */
    setTasks(mockTasks);

  }, []);

  let content = <div>Loading...</div>;

  if (tasks) {
    content = (
      <div className="homefeed">
        <ul className="homefeed task-list">
          {tasks.map((task: Task) => (
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
          <h2 className="homefeed-title">All the tasks in your local community</h2>
          {content}
      </BaseContainer>
    </>
  );
};

export default HomeFeed;