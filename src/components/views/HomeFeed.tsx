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
      <div className="task creatorId">{task.creatorId}</div>
      <div className="task Description">{task.description}</div>
      <div className="task Price">{task.price}</div>
      <div className="task Time">{task.time}</div>
      <div className="task Date">{task.date}</div>
    </div>
);

TaskItem.propTypes = {
  task: PropTypes.object,
};

const mockTasks: Task[] = [
  { id: 1, creatorId: 1, description: 'Task 1', price: 100, time: '10:00', date: '2022-01-01' },
  { id: 2, creatorId: 2, description: 'Task 2', price: 200, time: '11:00', date: '2022-01-02' },
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
          <h2>All the tasks in your local community</h2>
          {content}
      </BaseContainer>
    </>
  );
};

export default HomeFeed;