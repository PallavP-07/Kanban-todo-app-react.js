// import "./App.css";
// import useFetch from '../hooks/useFetch';
// import { useEffect, useRef, useState } from "react";
// import { negate } from "lodash";

// function App() {
//   const [task, setTask] = useState([]);
//   const [dragging, setDragging] = useState(false)
//   let url = 'https://dummyjson.com/todos';
//   let { data, loading, error } = useFetch(url);

//   const dargRef = useRef()
//  const dargNode =useRef()

//   useEffect(() => {
//     if (data && data.todos) {
//       setTask(data.todos);
//     }

//   }, [data])
//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;
//   const handleDrag = (e, task) => {
//     dargRef.current = task;
//     dargNode.current=e.target;
//     dargNode.current.addEventListener('dragend',handleDragEnd);
//     setTimeout(()=>{

//       setDragging(true)
//     },0)
//   }

//   const handleDragEnd =()=>{
//     setDragging(false);
//     dargNode.current.removeEventListener('dragend',handleDragEnd);
//     dargNode.current=null;
//     dargRef.current=null;

//   }
// const dragEnter =(e,params)=>{
// const currentItem =dargRef.current;
// if(e.target !== dargNode.current){
//   setTask(oldList =>{
//     let newTask = JSON.parse(JSON.stringify(oldList));
//     newTask[params.id].todo.splice(params,0,newTask[currentItem.id].todo.splice(currentItem,)[0]);
//     dargRef.current=params
//     return newTask
//   })
// }
// }

//   const getStyle = (params) => {
//     const currentStyle = dargRef.current;
//     if (currentStyle.id === params.id && currentStyle === params) {
//       return 'current task-card'
//     }
//     return 'task-card'
//   }
//   const getStyleDone = (params) => {
//     const currentStyle = dargRef.current;
//     if (currentStyle.id === params.id && currentStyle === params) {
//       return 'current task-card'
//     }
//     return 'task-card'
//   }
//   return (
//     <>
//       <div className="container">
//         <h2>Task Management</h2>
//         <div className="grid">
//           {/* To Do Column */}
//           <div className="todo-column">
//             <h2>To Do</h2>
//             <div className="tasks">
//               {task.slice(0, 15).filter(task => !task.completed).map(task => (
//                 <div draggable key={task.id} className={dragging ? getStyle(task) : "task-card"} onDragStart={(e) => { handleDrag(e, task) }} onDragEnter={(e) => { dragEnter(e, task) }}>
//                   {task.todo}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Done Column */}
//           <div className="done-column">
//             <h2>Done</h2>
//             <div className="tasks">
//               {task.slice(0, 15).filter(task => task.completed).map(task => (
//                 <div draggable key={task.id} className={dragging ? getStyleDone(task) : "task-card"} onDragStart={(e) => { handleDrag(e, task) }}>
//                   {task.todo}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;

import "./App.css";
import useFetch from '../hooks/useFetch';
import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [draggingTask, setDraggingTask] = useState(null);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [targetColumn, setTargetColumn] = useState(null);

  let url = 'https://dummyjson.com/todos';
  let { data, loading, error } = useFetch(url);

  useEffect(() => {
    if (data && data.todos) {
      setTasks(data.todos);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;


  const handleDragStart = (task, index, column) => {
    setDraggingTask(task);
    setDraggingIndex(index);
    setTargetColumn(column);
  };

  const handleDrop = (completedStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.id === draggingTask.id ? { ...task, completed: completedStatus } : task
    );

    setTasks(updatedTasks);
    setDraggingTask(null);
    setDraggingIndex(null);
    setTargetColumn(null);
  };


  const handleDragEnter = (index, column) => {
    if (column === targetColumn && index !== draggingIndex) {

      const updatedTasks = [...tasks];
      const [movedTask] = updatedTasks.splice(draggingIndex, 1);
      updatedTasks.splice(index, 0, movedTask);
      setTasks(updatedTasks);
      setDraggingIndex(index);
    }
  };

  return (
    <>
      <div className="container">
        <h2>Task Management</h2>
        <div className="grid">
          {/* To Do Column */}
          <div
            className="todo-column"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(false)}
          >
            <h2>To Do</h2>
            <div className="tasks">
              {tasks
                .filter(task => !task.completed)
                .map((task, index) => (
                  <div
                    key={task.id}
                    draggable
                    className={draggingIndex === index && targetColumn === "todo" ? "task-card dragging" : "task-card"}
                    onDragStart={() => handleDragStart(task, index, "todo")}
                    onDragEnter={() => handleDragEnter(index, "todo")}
                  >
                    {draggingTask === task ? '' : task.todo}
                  </div>
                ))}
            </div>
          </div>

          {/* Done Column */}
          <div
            className="done-column"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(true)}
          >
            <h2>Done</h2>
            <div className="tasks">
              {tasks
                .filter(task => task.completed)
                .map((task, index) => (
                  <div
                    key={task.id}
                    draggable
                    className={draggingIndex === index && targetColumn === "done" ? "task-card dragging" : "task-card"}
                    onDragStart={() => handleDragStart(task, index, "done")}
                    onDragEnter={() => handleDragEnter(index, "done")}
                  >
                    {draggingTask === task ? '' : task.todo}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
