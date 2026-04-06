import{ useState} from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

export function Login(){

    const [name, setName] = useState('');
    const [email,setEmail] = useState('');
    const [error,setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const setLogin = useAppStore((state) => state.setLogin);    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

    const API_URL = import.meta.env.VITE_API_URL;
    try{
        const response = await fetch(`${API_URL}/users/login`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Name: name, Email: email })
        });

        if(response.ok){
            const data = await response.json();
            console.log("Dados recebidos da API:", data);
            setLogin(data.id, data.token, data.name, data.isNewUser);
            navigate('/tasks');
        }else{
            const errorData = await response.json();
            setError(errorData.erro || 'Erro ao fazer login.');
        }
    } catch (err){
        console.error("Erro detalhado: ", err);
        setError("Erro de conexão com o servidor. A API está ligada?")
    }finally{
        setIsLoading(false);
    }
};


    return(
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <form
                onSubmit={handleLogin}
                noValidate
                className="bg-white p-8 rounded-lg shadow-md w-96 flex flex-col gap-4"
            >
                <h1 className="text=2xl font-bold text-center text-gray-800 mb-4">Entrar</h1>
                {error && <p className= "text-red-500 text-sm text-center font-semibold"> {error} </p>}

                <div>
                    <label className= "block text-sm font-medium text-gray-700">Nome</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="digite seu nome..."
                    />
                </div>

                <div>
                    <label className= "block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="exemplo@email.com"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-4 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
}