import React, { useState } from 'react';
import { useGlobalContext } from './../../context/GlobalContext';
import styled from 'styled-components'

const TaskForm = () => {
    const { addTask, error, loading } = useGlobalContext();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('todo');
    const [formError, setFormError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !description || !status) {
            setFormError("All fields are required");
            return;
        }
        addTask({ title, description, status });
        setTitle('');
        setDescription('');
        setStatus('todo');
    };

    return (
        <TaskFormStyled onSubmit={handleSubmit}>
            <div className="inputs">
            <div>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Enter Task' required disabled={loading} />
            </div>
            <div>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Enter Description' required disabled={loading} />
            </div>
            <div>
                <label>Status:</label> &nbsp;
                <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={loading}>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </div>
            {formError && <p className="error">{formError}</p>}
                {error && <p className="error">{error}</p>}
            <button type="submit" className='btn' disabled={loading}>Add Task</button>
            {loading && <p>Loading...</p>}
            </div>
        </TaskFormStyled>
    );
};

export default TaskForm;

const TaskFormStyled = styled.form`
display: flex;
width: 100vw;
height: 100vh;
flex-direction: column;
align-items: center;
input{
width: 15rem;
height: 2rem;
margin: 1rem;
font-size: 1.2rem;
border-radius: 0.5rem;
}
label{
color: black;
margin-left: 1.5rem;
font-weight: bold;
}
select{
width: 10rem;
height: 1.7rem;
border-radius: .5rem;
}
.btn{
margin-top: 1rem;
margin-left: 4.5rem;
background-color: blue;
color: white;
}
.btn:hover{
outline: blue;
background-color: white;
color: blue;
}
p{
margin-top: 2rem;
}
`;