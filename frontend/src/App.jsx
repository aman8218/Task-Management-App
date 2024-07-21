import React, { useState } from 'react';
import { useGlobalContext } from './context/GlobalContext';
import TaskForm from './components/TaskForm/TaskForm';
import TaskList from './components/TaskList/TaskList';
import styled from 'styled-components';

function App() {
  const [count, setCount] = useState(0)

  return (
    <AppStyled className="App">
            <h1>Task Management App</h1>
            <TaskForm />
            <TaskList />
        </AppStyled>
  )
}

export default App

const AppStyled = styled.div`
height: 100vh;
width: 100vw;
h1{
display: flex;
justify-content: center;
color: black;
font-weight: 500;
}

`;