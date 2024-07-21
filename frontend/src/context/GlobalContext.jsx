import { createContext, useState, useContext, useEffect } from "react";
import axios from 'axios';

const BASE_URL = "https://task-management-app-fastapi.vercel.app"

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all tasks
    const getTasks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/get-tasks`);
            setTasks(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Add a new task
    const addTask = async (task) => {
        if (!task.title || !task.description || !task.status) {
            setError("All fields are required");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/api/add-task`, task);
            console.log(response.data)
            setTasks([...tasks, response.data]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Update a task's status
    const updateTask = async (taskId, updatedTask) => {
        if (!updatedTask.title || !updatedTask.description || !updatedTask.status) {
            setError("All fields are required");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.put(`${BASE_URL}/api/update-task/${taskId}`, updatedTask);
            console.log(response.data)
            setTasks(tasks.map(task => (task.id === taskId ? response.data : task)));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    

    // Delete a task
    const deleteTask = async (taskId) => {
        setLoading(true);
        try {
            await axios.delete(`${BASE_URL}/api/delete-task/${taskId}`);
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Use effect to fetch tasks on initial render
    useEffect(() => {
        getTasks();
    }, []);

    return (
        <GlobalContext.Provider value={{ tasks, loading, error, addTask, updateTask, deleteTask, getTasks }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};