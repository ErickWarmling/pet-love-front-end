import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import './Login.css'
import { useAutCtx } from "./AuthProvider";

function Login() {
    const { autenticar } = useAutCtx();
    const navigate = useNavigate();

    const handleLoginSubmit = async ({ usuario, senha }) => {
        try {
            const sucesso = await autenticar(usuario, senha);
            if (sucesso) {
                toast.success("Login efetuado com sucesso!");
                navigate('/');
            } else {
                toast.error("Login ou senha inválidos");
            }
        } catch (error) {
            console.error("Erro no login: ", error);
            toast.error("Ocorreu um erro. Por favor, tente novamente!")
        }
    }

    return (
       <div className="pageLogin">
        <img className="logo-petlove" src="../../../public/logo.png" alt="Logo PetLove" />
         <div className="container mt-5">
            <h1 className="text-center">LOGIN</h1>
            <LoginForm onSubmit={handleLoginSubmit}/>
        </div>
       </div>
    );
}

export default Login;