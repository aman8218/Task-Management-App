import React, { useState } from 'react';
import { useGlobalContext } from './../../context/GlobalContext';
import styled from 'styled-components';

const TaskList = () => {
    const { tasks, updateTask, deleteTask, loading, error } = useGlobalContext();
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editStatus, setEditStatus] = useState('');
    const [formError, setFormError] = useState('');

    const handleEditClick = (task) => {
        setEditingTaskId(task.id);
        setEditTitle(task.title);
        setEditDescription(task.description);
        setEditStatus(task.status);
    };

    const handleSaveClick = async (taskId) => {
        if (!editTitle || !editDescription || !editStatus) {
            setFormError("All fields are required");
            return;
        }
        await updateTask(taskId, {
            title: editTitle,
            description: editDescription,
            status: editStatus
        });
        setEditingTaskId(null); // Close the edit form after updating
    };

    return (
        <TaskListStyled>
            {loading && <p>Loading...</p>}
            <table border="1" style={{borderCollapse: "collapse"}}>
                <thead>
                    <tr>
                        <th>Tasks</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.id}>
                            {editingTaskId === task.id ? (
                                <>
                                    <td>
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <select
                                            value={editStatus}
                                            onChange={(e) => setEditStatus(e.target.value)}
                                        >
                                            <option value="todo">To Do</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="done">Done</option>
                                        </select>
                                    </td>
                                    <td><button onClick={() => handleSaveClick(task.id)} className='update-btn'>Save</button></td>
                                    <td><button onClick={() => setEditingTaskId(null)} className='cancel-btn'>Cancel</button></td>
                                </>
                            ) : (
                                <>
                                    <td><h3>{task.title}</h3></td>
                                    <td><p>{task.description}</p></td>
                                    <td>
                                        {/* <select value={task.status} onChange={(e) => updateTask(task.id, { status: e.target.value })} className='status'>
                                            <option value="todo">To Do</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="done">Done</option>
                                        </select> */}
                                        <span style={{fontWeight: "bold"}}>{task.status}</span>
                                    </td>
                                    <td><button onClick={() => handleEditClick(task)} className='update-btn' disabled={loading}>Edit</button></td>
                                    <td><button onClick={() => deleteTask(task.id)} className='delete-btn' disabled={loading}>Delete</button></td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {error && <p className="error">{formError}</p>}
        </TaskListStyled>
    );
};

export default TaskList;

const TaskListStyled = styled.div`
    width: 100%;
    position: absolute;
    top: 28rem;
    display: flex;
    justify-content: center;

    table {
        width: 80%;
        border-collapse: collapse;

        th, td {
            border: 1px solid black;
            padding-left: 8px;
            padding-right: 8px;
            text-align: center;
        }
    }

    .task {
        display: flex;
    }

    .task-info {
        display: flex;
    }

    .status {
        height: 2.5rem;
        border-radius: .5rem;
    }

    .delete-btn {
        background-color: red;
        color: white;
    }

    .delete-btn:hover {
        background-color: white;
        outline: solid red;
        color: red;
        border: none;
    }

    .update-btn {
        background-color: pink;
    }

    .update-btn:hover {
        background-color: white;
        outline: solid pink;
        color: pink;
        font-weight: bold;
        border: none;
    }

    .complete-btn {
        background: yellowgreen;
        color: white;
    }

    .complete-btn:hover {
        background-color: white;
        outline: solid yellowgreen;
        border: none;
        color: yellowgreen;
    }

    .cancel-btn {
        background-color: lightgray;
    }

    .cancel-btn:hover {
        background-color: white;
        outline: solid lightgray;
        border: none;
        color: lightgray;
    }

    p
    {
    margin: 2rem;
    }
`;
