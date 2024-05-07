import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import NavBar from "components/ui/NavBar";
import { api } from "helpers/api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import "styles/views/ToDo.scss";




const ToDo = () => {

    // const [todos, setTodos] = useState([]);
    const [todos, setTodos] = useState({ myTodos: [], otherTodos: [] });
    const [newTodo, setNewTodo] = useState('');
    const [editingTodoId, setEditingTodoId] = useState({});
    const [descriptions, setDescriptions] = useState({});
    const { taskId } = useParams(); // Retrieve the task ID from the URL
    const userId = localStorage.getItem('currentUserId'); // Retrieve the user ID from local storage
    const [task, setTask] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [allTodosDone, setAllTodosDone] = useState(false);
    const navigate = useNavigate();

    

    // get info about who is creator and a helper
    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await api.get(`/tasks`, {
                    headers: {
                        "Accept": "application/json"
                    },
                });
                const task = response.data.find(task => task.id === Number(taskId));
                setTask(task);
                setIsLoading(false);
                console.log(`Creator ID: ${task.creatorId}, Helper ID: ${task.helperId}`);
            } catch (error) {
                console.error(`Something went wrong while fetching the tasks: \n${handleError(error)}`);
                alert("Something went wrong while fetching the tasks! See the console for details.");
                setIsLoading(false);
            }
        };
    
        fetchTask();
    }, []);

    const fetchAllTodosDone = async () => {
        try {
            const response = await api.get(`/allTodosDone/${taskId}`);
            setAllTodosDone(response.data);
        } catch (error) {
            console.error(`Something went wrong: ${error}`);
        }
    };

  
    useEffect(() => {
        
        const fetchTodos = async () => {
            console.log(taskId);
            try {
                if (taskId) {
                    const token = localStorage.getItem('token');
                    const todosResponse = await api.get(`/todo/${taskId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": token
                        },
                    });
                    const allTodosDoneResponse = await api.get(`/allTodosDone/${taskId}`);
                    setAllTodosDone(allTodosDoneResponse.data);

                    const myTodos = todosResponse.data.filter(todo => Number(todo.authorId) === Number(userId));
                    const otherTodos = todosResponse.data.filter(todo => Number(todo.authorId) !== Number(userId));
                    console.log('My todos:', myTodos);
                    console.log('Other todos:', otherTodos);
                    setTodos({ myTodos, otherTodos });
                }
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchTodos();
        const intervalId = setInterval(fetchTodos, 100);

        return () => clearInterval(intervalId);
    }, [taskId]);


      const postTodo = async () => {
        const token = localStorage.getItem('token');
        const requestBody = {
            description: newTodo,
            taskId: taskId,
        };

        try {
            await api.post('/todo', requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token
                },
            });
            setNewTodo('');
        } catch (error) {
            console.error(`Something went wrong: ${error}`);
        }
    };
  
    const updateTodo = async (todoId, done, description) => {
        const token = localStorage.getItem('token');
        const requestBody = {
            description: description,
            done: done,
        };
    
        try {
            await api.put(`/todo/${todoId}`, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token
                },
            });
        } catch (error) {
            console.error(`Something went wrong: ${error}`);
        }
    };

    const doneTodo = async (todoId, description) => {
        console.log('doneTodo function called');
        if (Number(userId) !== Number(task.creatorId)) {
            return; 
        }
    
        const token = localStorage.getItem('token');
        const requestBody = {
            description: description,
            done: true,
        };
    
        try {
            console.log(`Calling PUT /todo/${todoId}`);
            await api.put(`/todo/${todoId}`, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token
                },
            });

            // Update the local state
            setTodos((prevTodos) => ({
                myTodos: prevTodos.myTodos.map((todo) => todo.id === todoId ? { ...todo, done: true } : todo),
                otherTodos: prevTodos.otherTodos.map((todo) => todo.id === todoId ? { ...todo, done: true } : todo)
            }));
        } catch (error) {
            console.error(`Something went wrong: ${error}`);
        }
    };

    const deleteTodo = async (todoId) => {
        const token = localStorage.getItem('token');
        // const requestBody = {
        //     id: todoId,
        //     description: description,
        //     taskId: Number(taskId),
        // };

        // console.log('Request body:', requestBody);
    
        try {
            await api.delete(`/todo/${todoId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token
                },
            });
            setTodos((prevTodos) => ({
                myTodos: prevTodos.myTodos.filter((todo) => todo.id !== todoId),
                otherTodos: prevTodos.otherTodos
            }));
        } catch (error) {
            console.error(`Something went wrong: ${error}`);
        }
        
    };

    const updateDescription = (todoId, description) => {
        setDescriptions((prevDescriptions) => ({
            ...prevDescriptions,
            [todoId]: description,
        }));
    };

    return (
        <>
        {isLoading ? (
            <div>Loading...</div>
        ) : (
            <>
                      <NavBar />
            <BaseContainer>
                <div className="todo container">
                    <h1>To-Do list for: {task.title}</h1>
                    <div className="todo form">


                        <br/>
                        {/*Obtain tasks that the counter-part has submitted*/}
                        {todos.otherTodos.map((todo) =>
                            <div key={todo.id} className="todo item">
                            <div className="todo task-container">
                                <input
                                    className="todo input"
                                    value={todo.description}
                                    style={{background:'none'}}
                                />
                                <label className="todo description">Not changeable</label>
                                    {Number(userId) === Number(task.creatorId) ?
                                    (
                                        <span
                                          className={`todo tick ${todo.done ? 'clicked' : ''}`}
                                          onClick={() => {doneTodo(todo.id, descriptions[todo.id] || todo.description)}}
                                        >
                                          ✔
                                        </span>
                                    )
                                    :
                                    (
                                    <span className={`todo tick ${todo.done ? 'clicked' : ''}`} style={{cursor: 'initial'}}>
                                      ✔
                                    </span>
                                    )
                                    }
                            </div>
                            </div>
                        )}


                        {/*Obtain tasks that the logged-in user has submitted*/}
                        {todos.myTodos.map((todo) =>
                            <div key={todo.id} className="todo item">
                            <div className="todo task-container">
                                <input
                                    className="todo input"
                                    value={descriptions[todo.id] || todo.description}
                                    onChange={(e) => updateDescription(todo.id, e.target.value)}
                                    onFocus={() => setEditingTodoId(todo.id)}
                                    onBlur={() => setEditingTodoId(null)}
                                />
                                <div className="todo button-container">
                                    {todo.done ?
                                    (<label className="todo description">Task completed</label>)
                                    :
                                    (<>
                                    <Button
                                        disabled={!descriptions[todo.id] || descriptions[todo.id] === todo.description}
                                        onClick={() => updateTodo(todo.id, todo.done, descriptions[todo.id] || todo.description)}>
                                        Update
                                    </Button>
                                    <Button
                                        onClick={() => deleteTodo(todo.id)}>
                                        Delete
                                    </Button>
                                    </>
                                    )}
                                    {Number(userId) === Number(task.creatorId) ?
                                    (
                                        <span
                                          className={`todo tick ${todo.done ? 'clicked' : ''}`}
                                          onClick={() => {doneTodo(todo.id, descriptions[todo.id] || todo.description)}}
                                        >
                                          ✔
                                        </span>
                                    )
                                    :
                                    (
                                    <span className={`todo tick ${todo.done ? 'clicked' : ''}`} style={{cursor: 'initial'}}>
                                      ✔
                                    </span>
                                    )
                                    }
                                </div>
                            </div>
                            </div>
                       )}


                        <br/>
                        {/*Here new ToDo's can be added*/}
                        <div className="todo task-container">
                            <input
                                className="todo input"
                                placeholder="Add a new subtask"
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                            />
                            <div className="todo button-container">
                                <Button
                                    onClick={postTodo}
                                    disabled={!newTodo}>
                                    Submit
                                </Button>
                            </div>
                        </div>


                        <br/>
                       {/*This button terminates the task and marks it as done*/}
                        <div className="todo button-container">
                            <Button
                                disabled={!allTodosDone}
                                onClick={() => {
                                    const redirectUserId = Number(userId) === Number(task.creatorId) ? task.helperId : task.creatorId;
                                    navigate(`/leavereview/${redirectUserId}`);
                                }}
                            >
                            Mark task as DONE
                            </Button>
                        </div>


                    </div>
                </div>
            </BaseContainer>
            </>
        )}
  
        </>
    );
};
    
    export default ToDo;