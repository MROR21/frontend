import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { useTask } from '../hooks/useTask';

export function Tasks(){

    const navigate = useNavigate();
    const logout = useAppStore((state) => state.logout);
    
    const isNewUser = useAppStore((state) => state.isNewUser);
    const clearNewUserFlag = useAppStore((state) => state.clearNewUserFlag);
    const [isExiting, setIsExiting] = useState(false);

    const {tasks,isLoading, error, fetchTasks, addTask, updateTaskStatus, deleteTask} = useTask();

    const [filtroAtual, setFiltroAtual] = useState('Todas');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority,setPriority] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const today = new Date().toISOString().split('T')[0];
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const userName = useAppStore((state) => state.userName); 

 useEffect(() => {
   if (isNewUser) {
     const exitTimer = setTimeout(() => {
       setIsExiting(true);
     }, 3500);

     const removeTimer = setTimeout(() => {
       clearNewUserFlag();
     }, 4000);

     return () => {
       clearTimeout(exitTimer);
       clearTimeout(removeTimer);
       setIsExiting(false);
     };
   }
 }, [isNewUser, clearNewUserFlag]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]); 


    const filteredTasks = useMemo(() => {
        let result = filtroAtual === 'Todas'
        ? tasks
        : tasks.filter((task) => task.status === filtroAtual);

        const pesos = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };

        return [...result].sort((a, b) => {

            if (pesos[b.priority] !== pesos[a.priority]) {
                return pesos[b.priority] - pesos[a.priority];
            }
            return new Date(a.dueDate) - new Date(b.dueDate);
        });
    }, [tasks, filtroAtual]);


    const handleCreateTask = async (e) => {
        e.preventDefault();
        await addTask(title, description, priority, dueDate);
        setTitle('');
        setDescription('');
        setDueDate('');
        setPriority('');
        setIsModalOpen(false);
    };
    
    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout();
        navigate('/login');
    }

    return (
      <div className="min-h-screen bg-gray-100 p-8 relative">

        {isNewUser && (
          <div className={`fixed bottom-5 left-5 z-[70] ${isExiting ? 'animate-[slide-down_0.5s_forwards]' : 'animate-[slide-up_0.5s_ease-out]'}`}>
            <div className="relative overflow-hidden bg-emerald-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 border-b-4 border-emerald-800">
              <div className="bg-white/20 p-2 rounded-full text-xl animate-[spin_3s_linear_infinite]">✅</div>
              <div>
                <p className="font-bold text-lg leading-tight text-white">
                  Bem-vindo, {userName}!
                </p>
                <p className="text-sm opacity-95 text-emerald-50 font-medium">
                  Sua conta foi criada com sucesso.
                </p>
              </div>

              <div className="absolute bottom-0 left-0 h-1 bg-emerald-300/50 w-full origin-left" />
            </div>

            <style dangerouslySetInnerHTML={{__html: `

                  @keyframes slide-up {
                  from { transform: translateY(100%); opacity: 0; }
                  to { transform: translateY(0); opacity: 1; }
               }
                  @keyframes slide-down {
                  from { transform: translateY(0); opacity: 1; }
                  to { transform: translateY(100%); opacity: 0; }
               }
                  @keyframes shrink {
                  from { transform: scaleX(1); }
                  to { transform: scaleX(0); }
               }
                  @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
               }

            `,}}/>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md mb-8">
            <h1 className="text-3xl font-bold text-blue-600">Minhas Tarefas</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow-md transition-all flex items-center gap-2"
              >
                <span className="text-xl">+</span> Nova Tarefa
              </button>
              <button
                onClick={handleLogoutClick}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded shadow-md transition-colors"
              >
                Sair
              </button>

              {showLogoutModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
                  <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center">
                    <div className="flex justify-center mb-4">
                      <div className="bg-red-100 p-3 rounded-full">
                        <span className="text-red-600 text-3xl">🚪</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Encerrar Sessão?
                    </h3>
                    <p className="text-gray-600 mb-6">
                      <span className="font-bold text-blue-600">
                        {userName || "Usuário"}
                      </span>
                      , você tem certeza que deseja sair do sistema agora?
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={confirmLogout}
                        className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-all shadow-md"
                      >
                        Sim, Sair
                      </button>
                      <button
                        onClick={() => setShowLogoutModal(false)}
                        className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
              {error}
            </div>
          )}
          {isLoading && (
            <div className="text-blue-500 font-bold mb-4">
              Carregando dados com a API...
            </div>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  x
                </button>

                <form
                  onSubmit={handleCreateTask}
                  className="flex flex-col gap-4"
                >
                  <h2 className="text-2xl font-bold text-gray-800">
                    Nova Tarefa
                  </h2>

                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-600 mb-1">
                      Título da Tarefa:
                    </span>
                    <input
                      required
                      type="text"
                      placeholder="Título... "
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-600 mb-1">
                      Descrição da Tarefa:
                    </span>
                    <textarea
                      required
                      placeholder="Descrição... "
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-600 mb-1">
                        Prazo da Tarefa:
                      </span>
                      <input
                        required
                        type="date"
                        value={dueDate}
                        min={today}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-600 mb-1">
                        Prioridades:
                      </span>
                      <select
                        required
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value={""}>Selecione a Prioridade</option>
                        <option value={1}>Low</option>
                        <option value={2}>Medium</option>
                        <option value={3}>High</option>
                        <option value={4}>Critical</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg shadow-md transition-colors disabled:opacity-50"
                    >
                      Adicionar Tarefa
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
          {taskToDelete && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Excluir Tarefa?
                </h3>
                <p className="text-gray-600 mb-6">
                  Essa ação não pode ser desfeita. Tem certeza?
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      await deleteTask(taskToDelete); // Deleta de verdade
                      setTaskToDelete(null); // Fecha o modal
                    }}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors shadow-md"
                  >
                    Sim, Excluir
                  </button>
                  <button
                    onClick={() => setTaskToDelete(null)} // Cancela e fecha
                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-2 mb-6 mt-4">
            {["Todas", "Pendente", "Em Andamento", "Concluída"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFiltroAtual(status)}
                  className={`px-4 py-2 rounded shadow-md transition-colors ${filtroAtual === status ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-200"}`}
                >
                  {status}
                </button>
              ),
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredTasks.length === 0 ? (
              <p className="text-gray-500 text-center">
                Nenhuma tarefa encontrada.
              </p>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center border-l-4 ${task.status === "Concluída" ? "border-green-500" : task.status === "Em Andamento" ? "border-yellow-500" : "border-blue-500"}`}
                >
                  <div>
                    <h3>Título: {task.title}</h3>
                    <p>Descrição: {task.description}</p>
                    <p className="mt-2 text-sm text-gray-700">
                      Status:{" "}
                      <span
                        className={`font-semibold ${task.status === "Concluída" ? "text-green-500" : task.status === "Em Andamento" ? "text-yellow-500" : "text-blue-500"}`}
                      >
                        {task.status}
                      </span>
                      <span className="mx-2">|</span>
                      Prioridade:{" "}
                      <span className="font-bold">{task.priority}</span>
                      <span className="mx-2">|</span>
                      Prazo:{" "}
                      <span className="font-bold text-gray-500">
                        {task.dueDate
                          .split("T")[0]
                          .split("-")
                          .reverse()
                          .join("/")}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4 md:mt-0 flex gap-2">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateTaskStatus(task.id, e.target.value)
                      }
                      className={`p-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 font-semibold cursor-pointer transition-colors ${
                        task.status === "Concluída"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : task.status === "Em Andamento"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Em Andamento">Em Andamento</option>
                      <option value="Concluída">Concluída</option>
                    </select>

                    <button
                      onClick={() => setTaskToDelete(task.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm font-bold"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
}