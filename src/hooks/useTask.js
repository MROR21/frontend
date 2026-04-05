import {useState, useCallback} from 'react';
import {useAppStore} from "../store/useAppStore";

export function useTask(){
    const userId = useAppStore((state) => state.userId);
    const token = useAppStore((state) => state.token);
    const tasks = useAppStore((state) => state.tasks);
    const setTasks = useAppStore((state) => state.setTasks);
    const logout = useAppStore((state) => state.logout);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const API_URL = import.meta.env.VITE_API_URL;

    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });
    
    const fetchTasks = useCallback(async () => {
        if(!userId || !token) return;

        setIsLoading(true);
        setError('');

        try{
            const response = await fetch(`${API_URL}/tasks?userId=${userId}`,{
                headers: { 'Authorization': `Bearer ${token}` }
            })
            
            if(response.ok){
                const data = await response.json();
                setTasks(data);
            }else{
                if(response.status === 401){
                    logout();
                    return;
                }
                setError('Erro ao carregar as tarefas.');
            }
        }catch(err){
            console.error(err);
            setError('Erro de conexão com o servidor.');
        }finally{
            setIsLoading(false);
        }
    },[userId, token, API_URL, setTasks, logout]);


    const addTask = async (title, description, priority, dueDate) => {
        setIsLoading(true);
        setError('');

        try{
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    Title: title, 
                    Description: description,
                    Priority: priority, 
                    DueDate: dueDate, 
                    UserId: userId
                })
            });

            if(response.ok){
                await fetchTasks();
            }else{
                const errorData = await response.json();
                const realMessage = errorData.Erro || errorData.erro || 'Não foi possível criar a tarefa.';
                setError(realMessage);
            }
        }catch(err){
            console.error(err);
            setError('Erro ao conectar com a API.');
        }finally{
            setIsLoading(false);
        }
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        setIsLoading(true);
        setError('');

        try{
            const response = await fetch(`${API_URL}/tasks/${taskId}?userId=${userId}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify({Status: newStatus})
            });

            if(response.ok){
                await fetchTasks();
            }else{
                setError('Erro ao atualizar a tarefa.');
            }
        }catch(err){
            console.error(err);
            setError('Erro ao conectar com a API.');
        }finally{
            setIsLoading(false);
        }
    };

    const deleteTask = async (taskId) => {
        setIsLoading(true);
        setError('');

        try{
            const response = await fetch(`${API_URL}/tasks/${taskId}?userId=${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if(response.ok){
                await fetchTasks();
            }else{
                setError('Erro ao excluir a tarefa.');
            }
        }catch(err){
            console.error(err);
            setError('Erro ao conectar com a API.');
        }finally{
            setIsLoading(false);
        }
    };

    return{
        tasks,
        isLoading,
        error,
        fetchTasks,
        addTask,
        updateTaskStatus,
        deleteTask
    };
}