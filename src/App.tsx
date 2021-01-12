import React from 'react';
// import './App.css';
// import TodoList from "./todoList";
// import { v1 } from 'uuid';
// import AddItemForm from "./AddItemForm";
// import {AppBar, Toolbar, IconButton, Typography, Button, Grid, Container, Paper} from "@material-ui/core";
//
// import {Menu} from "@material-ui/icons";
// import { TaskStateTask } from './state/TaskReducer';
// import {TodolistType, TodoListDomainType} from './state/todoListsReducer'
//
// export type TaskType = {
//     id: string;
//     title: string;
//     isDone: boolean;
// };
//
//
//
//
//
// const App = () =>{
//
//     const todoListId1 = v1();
//     const todoListId2 = v1();
//
//     const [ todoList, setTodoList ] = useState<Array<TodoListDomainType>>([
//         {id: todoListId1, title:'What to learn', filter: 'All'},
//         {id: todoListId2, title:'What to buy', filter: 'All'}
//     ]);
//
//     const [ tasks, setTask ] = useState<TaskStateTask>({
//         [todoListId1]: [
//             {id: v1(), title: 'HTML&CSS', isDone: true},
//             {id: v1(), title: 'JS', isDone: true},
//             {id: v1(), title: 'ReactJS', isDone: false},
//             {id: v1(), title: 'Rest Api', isDone: false},
//             {id: v1(), title: 'GraphQL', isDone: false}
//         ],
//         [todoListId2]: [
//             {id: v1(), title: 'dog', isDone: true},
//             {id: v1(), title: 'cat', isDone: true},
//             {id: v1(), title: 'rabbit', isDone: false},
//             {id: v1(), title: 'Rest Api', isDone: false},
//             {id: v1(), title: 'GraphQL', isDone: false}
//         ]
//     });
//
//     const deleteTask = (id: string, todoListId: string) => {
//         tasks[todoListId] =  tasks[todoListId].filter(t => t.id !== id);
//         setTask({...tasks})
//     }
//
//     const addTask = (value:string, todoListId:string) => {
//         let task = {id: v1(), title: value, isDone: false};
//         let todolistTasks = tasks[todoListId];
//         tasks[todoListId] = [task, ...todolistTasks];
//         setTask({...tasks});
//
//     }
//
//
//
//
//     const changeTaskStatus = (id:string, isDone:boolean, todoListId:string) =>{
//
//         const todoListTasks = tasks[todoListId];
//         const task = todoListTasks.find(t => t.id === id);
//         if(task) {
//             task.isDone = isDone
//             setTask({...tasks})
//         }
//     }
//
//     const changeFilter =  (value:FilterType , todoListId: string) => {
//         let todolist1 = todoList.find(tl => tl.id === todoListId);
//         if(todolist1){
//             todolist1.filter = value;
//             setTodoList([ ...todoList])
//         }
//     }
//
//     const changeTitle =  useCallback((value:string , todoListId: string) => {
//         let todolist1 = todoList.find(tl => tl.id === todoListId);
//         if(todolist1){
//             todolist1.title = value;
//             setTodoList([ ...todoList])
//         }
//     },[])
//
//     const changeTaskInput = useCallback((id:string, title:string, todoListId:string) =>{
//
//         const todoListTasks = tasks[todoListId];
//         const task = todoListTasks.find(t => t.id === id);
//         if(task) {
//             task.title = title
//             setTask({...tasks})
//         }
//     },[])
//
//     const removeTodoList = useCallback((todoListId:string) => {
//         setTodoList(todoList.filter(tl => tl.id !== todoListId));
//         delete tasks[todoListId];
//     },[])
//
//     const filteredTodoList = (arrTodo:Array<TaskType>, filter:FilterType) => {
//         switch (filter) {
//             case "Active": return arrTodo.filter(tl => !tl.isDone)
//             case "Completed": return  arrTodo.filter(tl => tl.isDone)
//             default: return  arrTodo
//         }
//     }
//
//     const addTodoList =  useCallback((title: string) => {
//         const newTodoListId = v1();
//         const newTodoList: TodoListType = {
//             id: newTodoListId,
//             title:title,
//             filter: "All"
//         }
//         setTodoList([...todoList, newTodoList])
//         setTask({
//             ...tasks,
//             [newTodoListId]: []
//         })
//     }, [])
//
//     return (
//         <div className="App">
//             <AppBar>
//                 <Toolbar>
//                     <IconButton edge='start' color='inherit' aria-label='menu'>
//                         <Menu />
//                     </IconButton>
//                     <Typography  variant={'h6'}>
//                         News
//                     </Typography>
//                     <Button color={'inherit'}> login</Button>
//                 </Toolbar>
//             </AppBar>
//             <Container fixed>
//                 <Grid container style={{
//                     padding: '20px'
//                 }}>
//                     <AddItemForm addItem={addTodoList}/>
//                 </Grid>
//                 <Grid container spacing={3}>
//                     {
//                         todoList.map(({id, title, filter}) => {
//                             return (
//                                 <Grid item key={id}>
//                                     <Paper style={{padding: '10px'}}>
//                                         <TodoList
//                                             key={id}
//                                             idTodo={id}
//                                             title={title}
//                                             tasks={filteredTodoList(tasks[id], filter)}
//                                             deleteTask={deleteTask}
//                                             changeFilter={changeFilter}
//                                             addTask={addTask}
//                                             changeTaskStatus={changeTaskStatus}
//                                             filter={filter}
//                                             removeTodoList={removeTodoList}
//                                             changeInput={changeTaskInput}
//                                             changeTitle={changeTitle}/>
//                                     </Paper>
//                                 </Grid>
//                             )
//                         })
//                     }
//                 </Grid>
//             </Container>
//
//
//         </div>
//     );
// };
// export  default  App;
//
