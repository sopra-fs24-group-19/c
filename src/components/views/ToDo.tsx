import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import NavBar from "components/ui/NavBar";
import { api } from "helpers/api";
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import "styles/views/ToDo.scss";




// const FormField = (props) => {
//     return (
//       <div className="todo field">
//         <label className="todo label">{props.label}</label>
//         {props.type === 'textarea' ? (
//           <textarea
//             className="todo input"
//             placeholder={props.placeholder}
//             value={props.value}
//             onChange={(e) => props.onChange(e.target.value)}
//           />
//         ) : (
//           <input
//             type={props.type}
//             className="todo input"
//             placeholder={props.placeholder}
//             value={props.value}
//             onChange={(e) => props.onChange(e.target.value)}
//           />
//         )}
//       </div>
//     );
//   };
  
//   FormField.propTypes = {
//     label: PropTypes.string,
//     value: PropTypes.string,
//     onChange: PropTypes.func,
//     type: PropTypes.string,
//     placeholder: PropTypes.string,
//   };

//   const ToDo = () => {
//     const [todo, settodo] = useState('');
//     const [stars, setStars] = useState(0);
//     const navigate = useNavigate();
  
//     const doSubmittodo = async () => {
        
//         const todoerId = localStorage.getItem('currentUserId');
//         const token = localStorage.getItem("token")
//         if (!todoerId) {
//           console.error('User is not logged in');
//           return;
//         }
      
//         const requestBody = {
//           stars: stars,
//           todoedId: '#',  // Replace with the actual todoedId
//           todoerId: todoerId,
//           comment: todo
//         };
      
//         try {
//           // Uncomment the following lines to make the API request
         
//           const response = await api.post('/ratings/1', requestBody, {
//             headers: {
//               'Content-Type': 'application/json',
//               "Authorization": token
//             },
//           });
//           console.log(response.data);
//           navigate(`/userprofile/${requestBody.todoedId}`);
          
//         } catch (error) {
//           console.error(`Something went wrong: ${error}`);
//         }
//       };

//       return (
//         <>
//           <NavBar />
//           <BaseContainer>
//             <div className="todo container">
//               <h1>Leave a todo!</h1>
//               <div className="todo form">
//               <label className="todo label">Stars</label>
//                     <StarRatings
//                     rating={stars}
//                     starRatedColor= "#553842" // Color of filled stars
//                     starHoverColor="#8d6e63" // Color of stars when hovering
//                     starEmptyColor="#ebe8e5" 
//                     changeRating={(newRating: number) => setStars(newRating)}
//                     numberOfStars={5}
//                     name='rating'
//                     />
//                 {/* <FormField
//                   label="Stars"
//                   type="number"
//                   placeholder="Enter number of stars (1-5)"
//                   value={stars}
//                   onChange={(s: string) => setStars(s)}
//                 /> */}
//                 <FormField
//                   label="Your todo"
//                   type="textarea"
//                   placeholder="Enter your todo here..."
//                   value={todo}
//                   onChange={(r: string) => settodo(r)}
//                 />
//                 <div className="todo button-container">
//                   <Button
//                     disabled={!todo || !stars}
//                     width="100%"
//                     onClick={() => doSubmittodo()}
//                   >
//                     Submit todo
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </BaseContainer>
//         </>
//       );
//     };
    
//     export default ToDo;

const ToDo = () => {

    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [descriptions, setDescriptions] = useState({});
    const { taskId } = useParams(); // Retrieve the task ID from the URL
    const userId = localStorage.getItem('currentUserId'); // Retrieve the user ID from local storage
  
    useEffect(() => {
        const fetchTodos = async () => {
            console.log(taskId);
            try {
                if (taskId) {
                    const response = await api.get(`/todo/${taskId}`);
                    const sortedTodos = response.data.sort((a, b) => a.authorId - b.authorId);
                    setTodos(sortedTodos);
                }
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchTodos();
        const intervalId = setInterval(fetchTodos, 5000);
    
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
  
    const updateTodo = async (todoId, description, done) => {
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

    const deleteTodo = async (todoId) => {
        const token = localStorage.getItem('token');
        try {
            await api.delete(`/todo/${todoId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token
                },
            });
            setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
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
            <NavBar />
            <BaseContainer>
                <div className="todo container">
                    <h1>Todo</h1>
                    <div className="todo form">
                        <label className="todo label">New Todo</label>
                        <input
                            className="todo input"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                        />
                        <div className="todo button-container">
                            <Button onClick={postTodo}>Post</Button>
                        </div>
                        {todos.map((todo) =>
                            todo.authorId === userId ? (
                                <div key={todo.id} className="todo item">
                                    <input
                                        className="todo input"
                                        value={descriptions[todo.id] || todo.description}
                                        onChange={(e) => updateDescription(todo.id, e.target.value)}
                                        onFocus={() => setEditingTodoId(todo.id)}
                                        onBlur={() => setEditingTodoId(null)}
                                    />
                                    <div className="todo button-container">
                                        <Button onClick={() => updateTodo(todo.id, descriptions[todo.id] || todo.description, !todo.done)}>
                                            {todo.done ? 'Undo' : 'Done'}
                                        </Button>
                                        <Button onClick={() => deleteTodo(todo.id)}>Delete</Button>
                                    </div>
                                </div>
                            ) : (
                                <div key={todo.id} className="todo item">
                                    <input
                                        type="checkbox"
                                        checked={todo.done}
                                        onChange={() => updateTodo(todo.id, todo.description, !todo.done)}
                                    />
                                    <label className="todo label">{todo.description}</label>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </BaseContainer>
        </>
    );
};
    
    export default ToDo;